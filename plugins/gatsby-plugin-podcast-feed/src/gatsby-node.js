import fs from 'fs'
import path from 'path'
import { js2xml } from 'xml-js'
import merge from 'lodash.merge'
import mkdirp from 'mkdirp'
import { defaultOptions, runQuery, writeFile } from './internal'

const publicPath = `./public`

const serialize = ({ query: { site, allMarkdownRemark, profile }, image }) =>
  allMarkdownRemark.edges.map(edge => {
    const data = merge({}, edge.node.frontmatter)
    const {
      about,
      starring,
      audioLink,
      contentType,
      duration,
      explicit,
    } = data
    data.pubDate = new Date(data.date).toUTCString()
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

    const casts = profile.edges.reduce((o, { node }) => {
      o[node.id] = node
      return o
    }, {})

    const starringHtml = ['<ul>'].concat(starring.map((id) => {
      const profile = casts[id]
      if (!profile) {
        throw new Error(`No profile ${id}`)
      }
      const { displayName, url } = profile
      return `<li><a href="${url}" target="_blank" rel="noopener">${displayName}(@${id})</a></li>`
    })).concat(['</ul>']).join('\n')

    const description = `${about}\n\n<h2>Starring</h2>\n${starringHtml}\n\n${edge.node.html}`

    return {
      ...data,
      description,
      'itunes:subtitle': description,
      enclosure,
      'itunes:duration': duration,
      link: site.siteMetadata.siteUrl + edge.node.fields.slug,
      guid: {
        '_attributes': {
          isPermaLink: 'true'
        },
        '_text': site.siteMetadata.siteUrl + edge.node.fields.slug
      },
      'itunes:explicit': explicit || 'no',
      'media:thumbnail': {
        '_attributes': {
          url: image
        }
      }
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
        'xmlns:atom': 'http://www.w3.org/2005/Atom',
        'xmlns:googleplay': 'http://www.google.com/schemas/play-podcasts/1.0',
        'xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
        'xmlns:media': 'http://search.yahoo.com/mrss/',
        'xml:lang': language || 'en'
      },
      channel: {
        'atom:link': {
          '_attributes': {
            href: link + '/' + f.output,
            rel: 'self',
            type: 'application/rss+xml'
          }
        },
        title,
        description,
        generator: f.generator || 'GatsbyJS',
        link,
      }
    }

    if (f.keywords && Array.isArray(f.keywords)) {
      const keywords = f.keywords.join(',')
      merge(rss.channel, {
        'media:keywords': keywords,
        'itunes:keywords': keywords
      })
    }

    if (description) {
      merge(rss.channel, {
        'itunes:subtitle': description
      })
    }


    if (author) {
      merge(rss.channel, {
        'googleplay:author': author,
        'itunes:author': author,
      })
    }

    if (f.itunes && f.itunes.owner) {
      merge(rss.channel, {
        'itunes:owner': {
          'itunes:name': f.itunes.owner.name,
          'itunes:email': f.itunes.owner.email
        }
      })
    }

    if (category) {
      merge(rss.channel, {
        category,
        'googleplay:category': category,
        'itunes:category': category,
        'media:category': {
          '_attributes': {
            scheme: 'http://www.itunes.com/dtds/podcast-1.0.dtd'
          },
          '_text': category,
        }
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