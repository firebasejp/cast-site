module.exports = {
  siteMetadata: {
    title: `FJUG CAST`,
    author: `Firebase Japan User Group`,
    description: `Firebase Japan User Groupの人たちで送る、Firebaseについての番組です。`,
    siteUrl: `https://cast.firebase.asia`,
    keywords: [`FirebaseJapanUserGroup`, `Firebase`, `GoogleCloudPlatform`, `Podcast`],
    hashtag: [`FJUG`, `FJUG_CAST`],
    subscribes: [
      { name: `YouTube`, link: `https://www.youtube.com/playlist?list=PLKWMaZMUqz3-U6QleiQfQ52-qk6gb7mYS` }
    ],
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    `gatsby-transformer-yaml`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `data/cast.yaml`,
        name: `cast`
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: `gatsby-remark-external-links`,
            options: {
              target: `_blank`,
              rel: `noopener`
            }
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
          {
            resolve: `gatsby-remark-external-links`,
            options: {
              target: `_blank`,
              rel: `noopener`
            }
          }
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-52147387-8`,
      },
    },
    {
      resolve: `gatsby-plugin-podcast-feed`,
      options: {
        feeds: [
          {
            title: 'FJUG CAST',
            language: `ja`,
            category: `Technology`, // https://developers.google.com/search/docs/data-types/podcast#podcast-tags
            image: `https://cast.firebase.asia/icon1500.png`,
            language: 'ja',
            keywords: [
              `Firebase`, `GoogleCloudPlatform`, `GCP`,
              `tech`, `technology`, `programming`, `mobile`,
              `web`, `development`, `developer`, `software`
            ],
            itunes: {
              owner: {
                name: `Firebase Japan User Group`,
                email: `k2.wanko+fjug@gmail.com`
              }
            }
          }
        ]
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `FJUG CAST`,
        short_name: `FJUG CAST`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#ffab40`,
        display: `minimal-ui`,
        icon: `content/assets/fjug-icon.png`
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
  ],
}
