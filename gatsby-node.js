const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  const createBlogPost = () => {
    const blogPost = path.resolve(`./src/templates/blog-post.js`)
    return graphql(
      `
        {
          allMarkdownRemark(
            sort: { fields: [frontmatter___date], order: DESC }
            limit: 1000
          ) {
            edges {
              node {
                fields {
                  slug
                }
                frontmatter {
                  title
                }
              }
            }
          }
        }
      `
    ).then(result => {
      if (result.errors) {
        throw result.errors
      }

      // Create blog posts pages.
      const posts = result.data.allMarkdownRemark.edges

      posts.forEach((post, index) => {
        const previous = index === posts.length - 1 ? null : posts[index + 1].node
        const next = index === 0 ? null : posts[index - 1].node

        createPage({
          path: post.node.fields.slug,
          component: blogPost,
          context: {
            slug: post.node.fields.slug,
            previous,
            next,
          },
        })
      })
    })
  }

  const createCastPage = async () => {
    const castPage = path.resolve('./src/templates/cast-page.js')
    const results = await graphql(
      `
        {
          allCastYaml {
            edges {
              node {
                id
              }
            }
          }
        }
      `
    )
    if (results.errors) {
      throw results.errors
    }

    const casts = results.data.allCastYaml.edges
    casts.forEach((cast) => {
      createPage({
        path: `cast/${cast.node.id}`,
        component: castPage,
        context: {
          id: cast.node.id
        }
      })
    })
  }

  return Promise.all([
    createBlogPost(),
    createCastPage(),
  ])
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
