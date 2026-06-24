import React from 'react'
import styled from 'styled-components';
import robot from '../assets/images/welcome.gif';
import { useState,useEffect } from 'react';

function Welcome({currentuser}) {
    const [currentuserName,setCurrentUserName]=useState(undefined);
    useEffect(()=>{
        if(currentuser){
          setCurrentUserName(currentuser.username);
        }
      },[currentuser])
  return (
    <>
     <Container>
      <img src={robot} alt="robot" />
      <h1>Welcome, <span>{currentuserName}</span></h1>
      <h3>Please select a chat to start messaging</h3>
     </Container>
    </>
  )
}

const Container=styled.div`
display:flex;
align-items: center;
justify-content:center;
flex-direction: column;
color: white;
img{
    height: 20rem;
}
h1{
    margin-bottom:10px;
}
h3{
    margin-top:0;
}
span{
    color:#eb2632;
}
`;

export default Welcome;