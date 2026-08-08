import React, { useEffect, useState } from 'react';
import Welcome from '../../components/common/Welcome';
import { Outlet, useNavigate } from 'react-router-dom';
import SideNavbar from '../../components/layout/SideNavbar';
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
display: flex;
width: 100%;
min-height: 100vh;
box-sizing: border-box;
overflow-x: hidden;

.side-navbar {
    flex: 0 0 250px; 
    position: relative;
    z-index: 1000;
  @media screen and (max-width: 1199px) and (min-width: 706px) {
    flex: 0 0 90px; 
  }
  @media screen and (max-width: 705px) {
    flex: none;
    width: 0;
    height: 0;
  }
}

.outlet {
  flex: 1;
  position: relative;
  z-index: 1;
  min-width: 0;
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
  @media screen and (max-width: 705px) {
    padding-bottom: 80px;
  }
}
`
export default CodeByte;