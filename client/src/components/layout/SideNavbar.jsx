import { Link, useLocation, useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import learn from '../../assets/images/icons8-home-64.png'
import leaderboard from '../../assets/images/coins1.png'
import quest from '../../assets/images/icons8-treasure-100.png'
import user from '../../assets/images/icons8-user-male-1001.png'
import more from '../../assets/images/icons8-more-64.png'
import logo from '../../assets/images/icons8-module-481.png'
import gitlogo from '../../assets/images/github-logo.png'
import { useState, useEffect, useRef } from 'react';
import { getAssetUrl } from '../../utils/assets';

function SideNavbar() {
  const location = useLocation();
  const [moreHovered, setMoreHovered] = useState(false);
  const navigate=useNavigate();
  const childRef2 = useRef(null);
  const timeoutRef = useRef(null);
  
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setMoreHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setMoreHovered(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleParentClick2 = () => {
    // Trigger a click on the child element
    if (childRef2.current) {
      childRef2.current.click();
    }
  };

  const menuItems = [
    { to: '/fake', label: 'learn', imgSrc: getAssetUrl('icons8-home-64.png', learn) },
    { to: '/', label: 'learn', imgSrc: getAssetUrl('icons8-home-64.png', learn) },
    { to: '/leaderboards', label: 'leaderboards', imgSrc: getAssetUrl('coins1.png', leaderboard) },
    { to: '/quests', label: 'quests', imgSrc: getAssetUrl('icons8-treasure-100.png', quest) },
    { to: '/profile', label: 'profile', imgSrc: getAssetUrl('icons8-user-male-1001.png', user) },
    { to: location.pathname, label: 'more', imgSrc: getAssetUrl('icons8-more-64.png', more) },
  ];

  const menuItems2 = [
    { to: '/', label: 'learn', imgSrc: getAssetUrl('icons8-module-481.png', logo) },
    { to: '/', label: '', imgSrc: getAssetUrl('icons8-home-64.png', learn) },
    { to: '/leaderboards', label: 'leaderboards', imgSrc: getAssetUrl('coins1.png', leaderboard) },
    { to: '/quests', label: 'quests', imgSrc: getAssetUrl('icons8-treasure-100.png', quest) },
    { to: '/profile', label: 'profile', imgSrc: getAssetUrl('icons8-user-male-1001.png', user) },
    { to: location.pathname, label: 'more', imgSrc: getAssetUrl('icons8-more-64.png', more) },
  ];

  return (
    <SidebarContainer>
      <div className='laptop'>
        <div className='heading'><img src={getAssetUrl('icons8-module-481.png', logo)} />CodeByte</div>
        {menuItems.map((item, index) => (
          <Link key={index}
            to={item.to}
            onMouseEnter={() => {
              if (item.label === 'more') {
                handleMouseEnter();
              }
            }}
            onMouseLeave={() => {
              if (item.label === 'more') {
                handleMouseLeave();
              }
            }}
            onClick={(e) => {
              if (item.label === 'more') {
                e.preventDefault();
                setMoreHovered(prev => !prev);
              }
            }}
            className={`menuitem ${location.pathname === item.to && item.label !== 'more'  ? 'active' : ''} ${item.to === '/fake' ? 'more' : ''}`} >
            <img src={item.imgSrc} />
            {item.label}
          </Link>
        ))}
        {moreHovered && (
          <div className="morehover" onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}>
            <ul>
              <li onClick={()=>{handleParentClick2()}} className='li'><img src={getAssetUrl('github-logo.png', gitlogo)} alt="gitlogo" /><span><a href='https://github.com/vedantgore1331/CodeByte' ref={childRef2}>Github</a></span></li>
              <li onClick={() => {
                localStorage.removeItem('codebyte-user');
                localStorage.removeItem('course');
                navigate('/login');
              }}>LOGOUT</li>
            </ul>
          </div>
        )}
      </div>

      <div className="mobileortab">
        {menuItems2.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className='menuitem'>
            <img src={item.imgSrc} className={`${location.pathname === `/${item.label}` && item.label !== 'more' && item.imgSrc !== logo ? 'active' : ''} ${item.label === 'more' || item.imgSrc === logo ? 'more' : ''}`} />
          </Link>
        ))}
      </div>
    </SidebarContainer>
  )
}

const SidebarContainer = styled.div`
height: 100%;
 .laptop{
  position: fixed;
  text-transform: uppercase;
  display:flex;
  flex-direction:column;
  gap:1rem;
  width: 250px;
  height:100%;
  border-right: 1px solid #333;
  .heading{
    color:transparent;
    background: linear-gradient(45deg, hsl(100, 100%, 50%), hsl(150, 100%, 50%), hsl(200, 100%, 50%), hsl(250, 100%, 50%));
    -webkit-background-clip: text;
    text-transform:none;
    font-weight:bold;
    font-family:"Bricolage Grotesque";
    font-size: 1.7rem;
    padding:2.5rem 0 0.7rem 1rem;
    cursor: pointer;
    display: flex;
    align-items:flex-end;
    gap: 0.4rem;
    img{
      width: 35px;
    }
  }
  .morehover{
    width: 250px;
    transform: translateX(241.5px);
    position: relative;
    bottom: 78px;
    z-index: 2;
    border: 1px solid #333;
    border-radius: 12px;
    background-color: #0f0f0f;
    ul{
      padding:0 0 5px 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      color: #fff;
      list-style:none;
      .li{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-bottom: 13px;
        gap:25px;
        border-bottom: 1px solid #333;
      }
      li{
      padding: 16px 25px;
      cursor: pointer;
      font-size: 0.9rem;
      a{
        text-decoration: none;
        color: #fff;
      }
      &:hover{
      background-color:hsla(0, 0%, 100%, 0.02);
     } 
      }
      img{
        width: 30px;
        transform: translateY(-3px);
      }
    }
  }
  .menuitem{
    text-decoration: none;
    padding:0rem 1rem 1rem 1rem;
    display: flex;
    align-items:flex-end;
    gap: 1.5rem;
    color:#fff;
    font-weight:500;
    border-radius:10px;
    margin:0 1rem;
    img{
      width: 35px;
      position:relative;
      top:0.3rem;
    }
    &:hover{
     background-color:hsla(0, 0%, 100%, 0.04);
     /* transition: 0.5s ease-out; */
    }
  }
  .more{
    display:none;
  }
  .active{
     background-color:#eb2632;
     border:0.015px #F9F6EE solid;
     &:hover{
      background-color:#eb2632;
     }
    }
  
  @media screen and (max-width: 1199px) {
    display: none;
  }
}

.mobileortab{
  position: fixed;
  display:flex;
  flex-direction:column;
  padding:1.5rem 0.2rem;
  gap:1rem;
  width: 90px;
  border-right: 1px solid #333;
  height: 100%;
  .menuitem{
    text-decoration: none;
    padding:0rem 1rem 0rem 1rem;
    img{
      width: 50px;
      border-radius:10px;
      padding:0.3rem;
      &:hover{
     background-color:hsla(0, 0%, 100%, 0.08);
    }
    }
    img.more{
      &:hover{
        background-color:transparent;
      }
    }
  }
  img.active{
     background-color:#eb2632;
     border:0.015px #F9F6EE solid;
     &:hover{
      background-color:#eb2632;
     }
    }
  
  @media screen and (min-width: 1199px){
    display: none;
  }
  @media screen and (max-width: 705px){
    padding:0;
    flex-direction:row;
    position:absolute;
    justify-content:space-between;
    bottom: 0;
    width:100%;
    height:80px;
    border:none;
    border-top: 1px solid #333;
    .menuitem{
    padding:1rem 0rem;
  }
  .more{
    display:none;
  }
  }
}
`
export default SideNavbar;