import React, { useState } from 'react';
import logout from '../assets/images/logout.png';
import logoutclick from '../assets/images/switch.png'
import styled from 'styled-components';
import {useNavigate, useSearchParams} from 'react-router-dom';

function Logout() {
  const [ishover,setishover]=useState(false);  
  const navigate=useNavigate();
  const handleclick=()=>{
    localStorage.clear();
    navigate('/login');
  }
  return (
    <Button>
        <img src={!ishover ? logout :logoutclick} alt="logout" 
        onMouseOver={()=>setishover(true)} 
        onMouseOut={()=>setishover(false)}
        onClick={()=>handleclick()}    
        />
    </Button>
  )
}

const Button=styled.div`
img{
    width: 2.5rem;
    cursor: pointer;
}
`
export default Logout