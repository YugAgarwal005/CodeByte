import React from 'react'
import { styled } from 'styled-components'

function About() {
  return (
    <Container>
      <span><a href="https://yug-agarwal-portfolio.vercel.app">about</a></span>
      <span><a href="https://www.linkedin.com/in/yugagarwal005/">linkedin</a></span>
      <span><a href="https://github.com/YugAgarwal005">github</a></span>
      <span>DEVELOPED BY YUG AGARWAL</span>
    </Container>
  )
}

const Container=styled.div`
text-transform: uppercase;
padding: 20px 0 40px;
display: flex;
justify-content: space-around;
gap: 10px;
width: 300px;
line-height: 1.5;
font-size: 0.8rem;
color: #ffffff4D;
flex-wrap: wrap;
font-family:"Bricolage Grotesque";
a{
  text-decoration: none;
  color: #ffffff4D;
}
`

export default About