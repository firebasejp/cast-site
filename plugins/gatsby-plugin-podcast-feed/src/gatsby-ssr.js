import React from 'react'
import merge from 'lodash.merge'
import { withPrefix } from 'gatsby'
import { defaultOptions } from './internal'

exports.onRenderBody = ({ setHeadComponents }, pluginOptions) => {
  const { feeds } = merge({}, defaultOptions, pluginOptions)

  const links = feeds.map(({ output, title }, i) => {
    if (output.charAt(0) !== `/`) {
      output = `/` + output
    }

    return (
      <link
        key={`gatsby-plugin-feed-${i}`}
        rel="alternate"
        type="application/rss+xml"
        title={title}
        href={withPrefix(output)}
      />
    )
  })

  setHeadComponents(links)
}