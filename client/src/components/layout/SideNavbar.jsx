import { Link, useLocation, useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import learn from '../../assets/images/icons8-home-64.png'
import leaderboard from '../../assets/images/coins1.png'
import quest from '../../assets/images/icons8-treasure-100.png'
import user from '../../assets/images/icons8-user-male-1001.png'
import more from '../../assets/images/icons8-more-64.png'
import logo from '../../assets/images/icons8-module-481.png'
import gitlogo from '../../assets/images/github-logo.png'
import practice from '../../assets/images/icons8-courses-64.png'
import { useState, useEffect, useRef } from 'react';
import { getAssetUrl } from '../../utils/assets';

function SideNavbar() {
  const location = useLocation();
  const [moreHovered, setMoreHovered] = useState(false);
  const navigate = useNavigate();
  const childRef2 = useRef(null);
  const timeoutRef = useRef(null);
  const containerRef = useRef(null);

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
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setMoreHovered(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleParentClick2 = () => {
    if (childRef2.current) {
      childRef2.current.click();
    }
  };

  const menuItems = [
    { to: '/fake', label: 'learn', imgSrc: getAssetUrl('icons8-home-64.png', learn) },
    { to: '/', label: 'learn', imgSrc: getAssetUrl('icons8-home-64.png', learn) },
    { to: '/leaderboards', label: 'leaderboards', imgSrc: getAssetUrl('coins1.png', leaderboard) },
    { to: '/quests', label: 'quests', imgSrc: getAssetUrl('icons8-treasure-100.png', quest) },
    // Practice link — opens the online judge problem list
    { to: '/problems', label: 'practice', imgSrc: getAssetUrl('icons8-courses-64.png', practice) },
    { to: '/profile', label: 'profile', imgSrc: getAssetUrl('icons8-user-male-1001.png', user) },
    { to: location.pathname, label: 'more', imgSrc: getAssetUrl('icons8-more-64.png', more) },
  ];

  const menuItems2 = [
    { to: '/', label: 'logo', isLogo: true, imgSrc: getAssetUrl('icons8-module-481.png', logo) },
    { to: '/', label: '', imgSrc: getAssetUrl('icons8-home-64.png', learn) },
    { to: '/leaderboards', label: 'leaderboards', imgSrc: getAssetUrl('coins1.png', leaderboard) },
    { to: '/quests', label: 'quests', imgSrc: getAssetUrl('icons8-treasure-100.png', quest) },
    // Practice link for mobile/tablet nav bar
    { to: '/problems', label: 'practice', imgSrc: getAssetUrl('icons8-courses-64.png', practice) },
    { to: '/profile', label: 'profile', imgSrc: getAssetUrl('icons8-user-male-1001.png', user) },
    { to: location.pathname, label: 'more', imgSrc: getAssetUrl('icons8-more-64.png', more) },
  ];

  return (
    <SidebarContainer ref={containerRef}>
      <div className='laptop'>
        <div className='heading'><img src={getAssetUrl('icons8-module-481.png', logo)} alt="logo" />CodeByte</div>
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
            <img src={item.imgSrc} alt={item.label} />
            {item.label}
          </Link>
        ))}
        {moreHovered && (
          <div className="morehover" onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}>
            <ul>
              <li onClick={()=>{handleParentClick2(); setMoreHovered(false);}} className='li'><img src={getAssetUrl('github-logo.png', gitlogo)} alt="gitlogo" /><span><a href='https://github.com/YugAgarwal005/CodeByte' ref={childRef2}>Github</a></span></li>
              <li onClick={() => {
                setMoreHovered(false);
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
            onClick={(e) => {
              if (item.label === 'more') {
                e.preventDefault();
                e.stopPropagation();
                setMoreHovered(prev => !prev);
              }
            }}
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
            className={`menuitem ${item.isLogo ? 'logo-link' : ''}`}>
            <img src={item.imgSrc} alt={item.label || 'nav'} className={`${(location.pathname === item.to || (item.to === '/' && location.pathname === '/')) && !item.isLogo && item.label !== 'more' ? 'active' : ''} ${item.isLogo ? 'logo-icon' : ''}`} />
          </Link>
        ))}
        {moreHovered && (
          <div className="morehover-mobile" onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}>
            <ul>
              <li onClick={()=>{handleParentClick2(); setMoreHovered(false);}} className='li'><img src={getAssetUrl('github-logo.png', gitlogo)} alt="gitlogo" /><span><a href='https://github.com/YugAgarwal005/CodeByte' ref={childRef2}>Github</a></span></li>
              <li onClick={() => {
                setMoreHovered(false);
                localStorage.removeItem('codebyte-user');
                localStorage.removeItem('course');
                navigate('/login');
              }}>LOGOUT</li>
            </ul>
          </div>
        )}
      </div>
    </SidebarContainer>
  )
}

const SidebarContainer = styled.div`
height: 100%;
position: relative;
z-index: 10000;
 .laptop{
  position: fixed;
  z-index: 10000;
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
    z-index: 99999;
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
  z-index: 10000;
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
    img.logo-icon{
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

  .morehover-mobile{
    width: 200px;
    position: absolute;
    left: 95px;
    bottom: 20px;
    z-index: 99999;
    border: 1px solid #333;
    border-radius: 12px;
    background-color: #0f0f0f;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
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
  
  @media screen and (min-width: 1199px){
    display: none;
  }
  @media screen and (max-width: 705px){
    padding: 0 4px;
    flex-direction: row;
    position: fixed;
    left: 0;
    right: 0;
    justify-content: space-around;
    align-items: center;
    bottom: 0;
    width: 100%;
    height: 60px;
    border: none;
    border-top: 1px solid #333;
    background-color: #0f0f0f;
    z-index: 9999;
    box-sizing: border-box;
    .menuitem{
      padding: 4px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      max-width: 20%;
      img {
        width: 36px;
        height: 36px;
        padding: 4px;
        box-sizing: border-box;
      }
    }
    .logo-link{
      display: none !important;
    }
    .morehover-mobile{
      position: fixed;
      bottom: 68px;
      right: 10px;
      left: auto;
      width: 180px;
    }
  }
}
`
export default SideNavbar;