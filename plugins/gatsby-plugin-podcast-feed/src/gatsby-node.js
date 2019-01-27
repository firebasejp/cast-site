import fs from 'fs'
import path from 'path'
import { js2xml } from 'xml-js'
import merge from 'lodash.merge'
import mkdirp from 'mkdirp'
import { defaultOptions, runQuery, writeFile } from './internal'

const publicPath = `./public`

const serialize = ({ query: { site, allMarkdownRemark } }) =>
  allMarkdownRemark.edges.map(edge => {
    const data = merge({}, edge.node.frontmatter)
    const {
      about,
      audioLink,
      contentType,
      duration,
    } = data
    data.pubDate = data.date
    delete data.date

    const enclosure = {
      '_attributes': {
        url: audioLink,
        type: contentType,
        length: duration,
      }
    }
    delete data.about
    delete data.contentType
    delete data.audioLink
    delete data.duration
    return {
      ...data,
      description: `${about}\n\n${edge.node.html}`,
      enclosure,
      'itunes:duration': duration,
      url: site.siteMetadata.siteUrl + edge.node.fields.slug,
      guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
    }
  })

exports.onPostBuild = async ({ graphql }, pluginOptions) => {
  delete pluginOptions.plugins

  const options = merge({}, defaultOptions, pluginOptions)

  options.query = await runQuery(graphql, options.query)
  for (let f of options.feeds) {
    if (f.query) {
      f.query = await runQuery(graphql, f.query)

      if (options.query) {
        f.query = merge(options.query, f.query)
        delete options.query
      }
    }

    const { setup, ...locals } = {
      ...options,
      ...f,
    }

    const serializer =
      f.serialize && typeof f.serialize === `function` ? f.serialize : serialize

    const items = serializer(locals)

    const header = {
      '_declaration': {
        '_attributes': { 'version': '1.0', 'encoding': 'utf-8' }
      }
    }

    const {
      title,
      author,
      description,
      link,
    } = f.query.site.siteMetadata

    const {
      category,
      image,
      explicit,
      language,
    } = f

    const rss = {
      '_attributes': {
        'version': '2.0',
        'xmlns:googleplay': 'http://www.google.com/schemas/play-podcasts/1.0',
        'xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd'
      },
      channel: {
        title,
        description,
        generator: f.generator || 'GatsbyJS',
        link,
      }
    }


    if (author) {
      merge(rss.channel, {
        'googleplay:author': author,
        'itunes:author': author,
      })
    }

    if (category) {
      merge(rss.channel, {
        category,
        'googleplay:category': category,
        'itunes:category': category,
      })
    }

    if (image) {
      merge(rss.channel, {
        image: {
          link,
          title,
          url: image
        },
        'googleplay:image': image,
        'itunes:image': image,
      })
    }

    merge(rss.channel, {
      'language': language || 'en'
    })

    merge(rss.channel, {
      'googleplay:explicit': explicit || 'no',
      'itunes:explicit': explicit || 'no',
    })

    merge(rss.channel, {
      item: items
    })

    const data = {
      ...header,
      rss
    }
    const xml = js2xml(data, { compact: true, ignoreComment: true, spaces: 2 })

    const outputPath = path.join(publicPath, f.output)
    const outputDir = path.dirname(outputPath)
    if (!fs.existsSync(outputDir)) {
      mkdirp.sync(outputDir)
    }
    await writeFile(outputPath, xml)
  }
}