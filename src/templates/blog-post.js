import React from 'react'
import { Link, graphql } from 'gatsby'

import Image from 'gatsby-image'
import Player from '../components/Player'
import Layout from '../components/Layout'
import SEO from '../components/seo'
import { rhythm, scale } from '../utils/typography'

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const avatars = this.props.data.avatars.edges.reduce((o, c, i) => {
      c = c.node
      o[c.base.slice('icon_'.length, c.base.length - c.ext.length)] = c.childImageSharp
      return o
    }, {})
    const profile = this.props.data.profile.edges.reduce((o, c) => {
      c = c.node
      o[c.id] = c
      return o
    }, {})
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pageContext

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title={post.frontmatter.title} description={post.excerpt} />
        <h1 style={{ fontSize: '2rem' }}>{post.frontmatter.title}</h1>
        <p
          style={{
            ...scale(-1 / 5),
            display: `block`,
            marginBottom: rhythm(1),
            marginTop: rhythm(-1),
          }}
        >
          {post.frontmatter.date}
        </p>
        <Player src={post.frontmatter.audioLink}></Player>
        <p>{post.frontmatter.about}</p>
        <div>
          <h2>Starring</h2>
          <div
            style={{
              display: `flex`,
              flexDirection: `row`
            }}
          >
            {post.frontmatter.starring.map((id) => {
              return (<div
                key={id}
              >
                <Link style={{
                  boxShadow: `none`,
                  display: `flex`,
                  flexDirection: `column`,
                  alignItems: `center`,
                  color: `black`,
                  marginRight: `10px`,
                  marginLeft: `10px`,
                }} to={'/cast/' + id}>
                  <Image
                    fixed={avatars[id].fixed}
                    alt={id}
                    style={{
                      marginRight: rhythm(1 / 2),
                      marginBottom: 0,
                      minWidth: 50,
                      borderRadius: `100%`,
                    }}
                    imgStyle={{
                      borderRadius: `50%`,
                    }}
                  />
                  <p>{profile[id].displayName}</p>
                </Link>
              </div>)
            })}
          </div>
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />

        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </Layout >
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    avatars: allFile(filter: {absolutePath: {regex: "/icon_[0-9a-zA-Z_]+\\.jpg$/"}}) {
      edges {
        node {
          base
          ext
          childImageSharp {
            fixed(width: 80, height: 80) {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
    }
    profile: allCastYaml {
      edges {
        node {
          id
          displayName
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        about
        date(formatString: "MMMM DD, YYYY")
        starring
        audioLink
      }
    }
  }
`
