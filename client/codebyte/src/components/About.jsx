import React from 'react'
import { styled } from 'styled-components'

function About() {
  return (
    <Container>
      <span><a href="SRS.pdf">about</a></span>
      <span><a href="https://www.linkedin.com/in/vedant-gore-a2b965291?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app">linkedin</a></span>
      <span><a href='mailto:vedantgore96@gmail.com?bcc=lci2022056@iiitl.ac.in&subject=Reaching+out+to+contact+CodeByte'>contact</a></span>
      <span><a href="https://github.com/vedantgore1331/CodeByte">github</a></span>
      <span>&copy; 2023 TEAM AKATSUKI</span>
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