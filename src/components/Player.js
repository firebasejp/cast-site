import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'

import { rhythm } from '../utils/typography'

function Player(props) {
    const { src } = props
    return (<audio src={src} controls></audio>)
}

export default Player