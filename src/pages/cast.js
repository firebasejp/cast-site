import React from 'react'
import { Link, graphql } from 'gatsby'
import Image from 'gatsby-image'

import Layout from '../components/Layout'
import SEO from '../components/seo'
import { rhythm } from '../utils/typography'

export default class CastListPage extends React.Component {
  render() {
    const { data } = this.props
    const avatars = data.avatars.edges.reduce((o, c, i) => {
      c = c.node
      o[c.base.slice('icon_'.length, c.base.length - c.ext.length)] = c.childImageSharp
      return o
    }, {})

    const casts = data.allCastYaml.edges

    return (
      <Layout location={this.props.location} title={data.site.siteMetadata.title}>
        <SEO
          title="Cast"
          keywords={data.site.siteMetadata.keywords}
        />
        {casts.map(({ node }) => {
          const {
            id,
            displayName,
            role,
            twitter,
            description,
          } = node
          return (
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
              <div style={{whiteSpace: `pre-wrap`}}>
                {description}
              </div>
              <div>
                <a href={`https://twitter.com/${twitter}`}>Twitter</a>
              </div>
            </div>
          )
        })}
      </Layout>
    )
  }
}

export const pageQuery = graphql`
  query CastListPage {
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
    site {
      siteMetadata {
        title
      }
    }
    allCastYaml {
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
  }
`