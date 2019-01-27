import React from 'react'
import { Link, graphql } from 'gatsby'
import Image from 'gatsby-image'

import Layout from '../components/Layout'
import SEO from '../components/seo'
import { rhythm, scale } from '../utils/typography'

export default class CastPageTemplate extends React.Component {
  render() {
    const { id } = this.props.pageContext
    const profile = this.props.data.profile.edges[0].node
    const avatars = this.props.data.avatars.edges.reduce((o, c, i) => {
      c = c.node
      o[c.base.slice('icon_'.length, c.base.length - c.ext.length)] = c.childImageSharp
      return o
    }, {})

    const episodes = this.props.data.episodes.edges

    const {
      displayName,
      role,
      twitter,
      description,
    } = profile
    return (
      <Layout location={this.props.location} title={this.props.data.site.siteMetadata.title}>
        <SEO title={profile.displayName} description={profile.description} />
        <div
          key={id}
          style={{
            display: `flex`,
            flexDirection: `column`,
            marginBottom: rhythm(2.5),
          }}
        >
          <div
            style={{
              display: `flex`,
              aligItems: `flex-start`
            }}
          >
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
            <div style={{ flex: 1 }}>
              <Link style={{ boxShadow: `none` }} to={'/cast/' + id}>
                {displayName}
              </Link>
              <p>{role}</p>
            </div>
          </div>
          <div style={{ whiteSpace: `pre-wrap` }}>
            {description}
          </div>
          <div>
            <a href={`https://twitter.com/${twitter}`}>Twitter</a>
          </div>
        </div>
        <h2>Episodes</h2>
        <ul>
          {episodes.map(({ node }) => {
            return (
              <li key={node.fields.slug}>
                <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                  {node.frontmatter.title}
                </Link>
              </li>
            )
          })}
        </ul>
      </Layout>
    )
  }
}

export const pageQuery = graphql`
query CastPage($id: String!) {
  site {
    siteMetadata {
      title
    }
  }
  profile: allCastYaml(filter: {id: {eq: $id}}) {
    edges {
      node {
        id
        displayName
        twitter
        role
        description
      }
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
  
  episodes: allMarkdownRemark(filter: {frontmatter: {starring: {in: [$id]}}}) {
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