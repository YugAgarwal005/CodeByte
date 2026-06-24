import React, { useEffect, useState } from 'react';
import Welcome from '../components/Welcome';
import { Outlet, useNavigate } from 'react-router-dom';
import SideNavbar from './SideNavbar';
import { styled } from 'styled-components';

function CodeByte() {
  const navigate = useNavigate();
  const [currentuser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    (async () => {
      if (!localStorage.getItem('codebyte-user')) {
        navigate("/login");
      }
      else {
        const userString = localStorage.getItem('codebyte-user');
        const user = await JSON.parse(userString);
        setCurrentUser(user);
      }
    })();
  }, [])

  useEffect(() => {
    (async () => {
      if (currentuser) {
        if (!currentuser.IsAvatarImageSet) {
          navigate("/setavatar");
        }
      };
    })();
  }, [currentuser]);

  return (
    <>
      <Container>
        <div className="side-navbar">
          <SideNavbar />
        </div>
        <div className="outlet">
          <Outlet />
        </div>
      </Container>
    </>
  )
}

const Container = styled.div`
display:flex;
.side-navbar{
    flex: 0 0 250px; 
  @media screen and (max-width: 1199px) and (min-width: 705px){
    flex: 0 0 90px; 
  }
  @media screen and (max-width: 705px){
    flex:none;
  }
}
.outlet{
  flex:1;
}
`
export default CodeByte;