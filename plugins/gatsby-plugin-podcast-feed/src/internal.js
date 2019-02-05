import fs from 'fs'
import pify from 'pify'

export const writeFile = pify(fs.writeFile)

export const runQuery = (handler, query) =>
  handler(query).then(r => {
    if (r.errors) {
      throw new Error(r.errors.join(`, `))
    }

    return r.data
  })

export const defaultOptions = {
  generator: `GatsbyJS`,

  query: `
    {
      site {
        siteMetadata {
          title
          author
          description
          siteUrl
          link: siteUrl
          keywords
        }
      }
    }
  `,

  setup: ({
    query: {
      site: { siteMetadata },
      ...rest
    },
  }) => {
    return {
      ...siteMetadata,
      ...rest,
    }
  },

  feeds: [
    {
      query: `
      {
        profile: allCastYaml {
          edges {
            node {
              id
              displayName
              url
            }
          }
        }
        allMarkdownRemark(
          limit: 1000,
          sort: {
            order: DESC,
            fields: [frontmatter___date]
          }
        ) {
          edges {
            node {
              frontmatter {
                title
                date
                about
                starring
                contentType
                duration
                audioLink
              }
              fields {
                slug
              }
              excerpt
              html
            }
          }
        }
      }
    `,

      output: `feed.xml`,

      title: null,
    },
  ],
}
