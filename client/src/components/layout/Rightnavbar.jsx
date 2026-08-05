import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import courses from '../../assets/images/icons8-courses-64.png'
import fire from '../../assets/images/icons8-firee.png'
import { Link, useNavigate } from 'react-router-dom'
import CalendarApp from '../common/Calendar'
import { getuserRoute } from '../../utils/Apiroutes'
import axios from 'axios';
import { getAssetUrl } from '../../utils/assets'

const CppLogo = () => (
  <svg viewBox="0 0 32 32" width="24" height="24" style={{ minWidth: '24px' }}>
    <path d="M27.6947 22.9999C27.883 22.6617 28 22.2807 28 21.9385V10.0613C28 9.71913 27.8831 9.33818 27.6947 9L16 16L27.6947 22.9999Z" fill="#00599C"/>
    <path d="M17.0395 29.7433L26.9611 23.8047C27.2469 23.6336 27.5067 23.3382 27.695 23L16.0003 16L4.30566 23C4.49398 23.3382 4.75382 23.6337 5.03955 23.8047L14.9611 29.7433C15.5326 30.0855 16.468 30.0855 17.0395 29.7433Z" fill="#004482"/>
    <path d="M27.6947 8.99996C27.5064 8.6617 27.2465 8.36629 26.9608 8.19521L17.0392 2.25662C16.4677 1.91446 15.5323 1.91446 14.9608 2.25662L5.03922 8.19521C4.46761 8.53729 4 9.37709 4 10.0613V21.9386C4 22.2807 4.11694 22.6618 4.30533 23L16 16L27.6947 8.99996Z" fill="#659AD2"/>
    <path d="M16.0385 24C11.6061 24 8 20.4112 8 16C8 11.5888 11.6061 8 16.0385 8C18.8458 8 21.4674 9.47569 22.919 11.8618L19.4765 13.9265C18.7492 12.736 17.4399 12 16.0385 12C13.8222 12 12.0193 13.7944 12.0193 16C12.0193 18.2056 13.8222 20 16.0385 20C17.4362 20 18.7421 19.2681 19.4707 18.0832L22.9205 20.1359C21.4692 22.5234 18.8467 24 16.0385 24Z" fill="white"/>
    <path d="M23 15.4948H21.9999V14.5H21.0001V15.4948H20V16.4895H21.0001V17.4844H21.9999V16.4895H23V15.4948Z" fill="white"/>
    <path d="M27 15.5H25.9999V14.5H25.0001V15.5H24V16.4999H25.0001V17.5H25.9999V16.4999H27V15.5Z" fill="white"/>
  </svg>
  // <svg viewBox="0 0 128 128" width="24" height="24" style={{ minWidth: '24px' }}>
  //   <path fill="#00599C" d="M117.5 33.5L64 2.5 10.5 33.5v61l53.5 31 53.5-31v-61z"/>
  //   <path fill="#004482" d="M64 2.5v123l53.5-31v-61L64 2.5z"/>
  //   <path fill="#FFF" d="M80 60.5h10v7H80V78h-7V67.5H63v-7h10V50h7v10.5zm19 0h10v7H99V78h-7V67.5H82v-7h10V50h7v10.5z"/>
  //   <path fill="#FFF" d="M35 64c0-11 8.5-20 19-20 6 0 11.5 2.5 15 7l-5.5 4.5c-2.5-3-6-4.5-9.5-4.5-7 0-12 6-12 13s5 13 12 13c3.5 0 7-1.5 9.5-4.5l5.5 4.5c-3.5 4.5-9 7-15 7-10.5 0-19-9-19-20z"/>
  // </svg>
);

const JavaLogo = () => (
  <svg viewBox="-118.513 4.399 540.906 540.906" width="24" height="24" style={{ minWidth: '24px' }}>
    <path d="M285.104 430.945h-2.037v-1.14h5.486v1.14h-2.025v5.688h-1.424v-5.688zm10.942.297h-.032l-2.02 5.393h-.924l-2.006-5.393h-.024v5.393h-1.343v-6.828h1.976l1.86 4.835 1.854-4.835h1.969v6.828h-1.311l.001-5.393z" fill="#e76f00"/>
    <path d="M102.681 291.324s-14.178 8.245 10.09 11.035c29.4 3.354 44.426 2.873 76.825-3.259 0 0 8.518 5.341 20.414 9.967-72.63 31.128-164.376-1.803-107.329-17.743M93.806 250.704s-15.902 11.771 8.384 14.283c31.406 3.24 56.208 3.505 99.125-4.759 0 0 5.937 6.018 15.271 9.309-87.815 25.678-185.624 2.025-122.78-18.833" fill="#5382a1"/>
    <path d="M168.625 181.799c17.896 20.604-4.701 39.146-4.701 39.146s45.439-23.458 24.571-52.833c-19.491-27.395-34.438-41.005 46.479-87.934.001-.001-127.013 31.721-66.349 101.621" fill="#e76f00"/>
    <path d="M264.684 321.369s10.492 8.646-11.555 15.333c-41.923 12.7-174.488 16.535-211.314.507-13.238-5.76 11.587-13.752 19.396-15.429 8.144-1.766 12.798-1.437 12.798-1.437-14.722-10.371-95.157 20.363-40.857 29.166 148.084 24.015 269.944-10.814 231.532-28.14M109.499 208.617s-67.431 16.016-23.879 21.832c18.389 2.462 55.047 1.905 89.192-.956 27.906-2.354 55.928-7.358 55.928-7.358s-9.84 4.214-16.959 9.074c-68.475 18.01-200.756 9.631-162.674-8.79 32.206-15.568 58.392-13.802 58.392-13.802M230.462 276.231c69.608-36.171 37.425-70.932 14.96-66.248-5.506 1.146-7.961 2.139-7.961 2.139s2.045-3.202 5.947-4.588c44.441-15.624 78.619 46.081-14.346 70.521 0 0 1.079-.962 1.4-1.824" fill="#5382a1"/>
    <path d="M188.495 4.399s38.55 38.562-36.563 97.862c-60.233 47.567-13.735 74.689-.025 105.678-35.158-31.723-60.96-59.647-43.65-85.637 25.406-38.151 95.792-56.648 80.238-117.903" fill="#e76f00"/><path d="M116.339 374.246c66.815 4.277 169.417-2.373 171.846-33.987 0 0-4.67 11.984-55.219 21.503-57.027 10.731-127.364 9.479-169.081 2.601.002-.002 8.541 7.067 52.454 9.883" fill="#5382a1"/><path d="M105.389 495.049c-6.303 5.467-12.96 8.536-18.934 8.536-8.527 0-13.134-5.113-13.134-13.314 0-8.871 4.937-15.357 24.739-15.357h7.328l.001 20.135m17.392 19.623V453.93c0-15.518-8.85-25.756-30.188-25.756-12.457 0-23.369 3.076-32.238 6.999l2.56 10.752c6.983-2.563 16.022-4.949 24.894-4.949 12.292 0 17.58 4.949 17.58 15.181v7.678h-6.135c-29.865 0-43.337 11.593-43.337 28.993 0 15.018 8.878 23.554 25.594 23.554 10.745 0 18.766-4.437 26.264-10.929l1.361 9.221 13.645-.002zM180.824 514.672h-21.691l-26.106-84.96h18.944l16.198 52.199 3.601 15.699c8.195-22.698 13.992-45.726 16.891-67.898h18.427c-4.938 27.976-13.822 58.684-26.264 84.96M264.038 495.049c-6.315 5.467-12.983 8.536-18.958 8.536-8.512 0-13.131-5.113-13.131-13.314 0-8.871 4.947-15.357 24.748-15.357h7.341v20.135m17.39 19.623V453.93c0-15.518-8.871-25.756-30.186-25.756-12.465 0-23.381 3.076-32.246 6.999l2.557 10.752c6.985-2.563 16.041-4.949 24.906-4.949 12.283 0 17.579 4.949 17.579 15.181v7.678h-6.146c-29.873 0-43.34 11.593-43.34 28.993 0 15.018 8.871 23.554 25.584 23.554 10.752 0 18.77-4.437 26.28-10.929l1.366 9.221 13.646-.002zM36.847 529.099c-4.958 7.239-12.966 12.966-21.733 16.206L6.527 535.2c6.673-3.424 12.396-8.954 15.055-14.104 2.3-4.581 3.252-10.485 3.252-24.604v-96.995h18.478v95.666c-.001 18.875-1.51 26.5-6.465 33.936" fill="#e76f00"/>
  </svg>
  // <svg viewBox="0 0 128 128" width="24" height="24" style={{ minWidth: '24px' }}>
  //   <path fill="#5382a1" d="M88.7 82.5c2.3 1.1 4.5 2.5 6.3 4.2 4.1-1.7 5.7-4.3 4.4-6.8-2.3-4.3-13.6-5.8-25.2-3.4 5 1.7 10.2 3.6 14.5 6zM96.4 69c4.2-3.8 6.4-7.5 5.2-10-2-3.9-12-3.3-22.3 1.3 5.4.9 11.2 2.4 17.1 8.7z"/>
  //   <path fill="#f89820" d="M51.2 121.2c5.9 0 11.1-.3 15.3-.9 11.1-1.5 18-5.3 18.5-10.3.6-5-5-8.4-14.4-10-8.5-1.5-19.1-1.9-26.6-.7-10 1.6-15.6 5.3-15.1 10.2.6 5.1 7.2 8.5 17 10.4 1.8.3 3.6.7 5.3 1.3zm31-23.7c-2 0-3.9.1-5.7.3 10 2.2 14.9 5.8 14.3 9-.5 2.8-4.4 5.1-11.2 6.4 13.9.7 20-2.4 20.6-7.3.7-5.4-6-8.4-18-8.4zm-48.4 19.3c-7-1.4-10.7-3.6-11.1-6-.4-2.5 2.6-5 8.1-6.7-1 1.7-1.4 3.7-1.2 5.7.4 3 2.1 5.3 4.2 7zM71 78.5c5.3-7.5 10.5-15.5 13-25.5 3-12.2.8-21.6-6-27-2-1.6-4.2-2.9-6.6-3.8.3 1-.1 2.2-.8 3.5-3 5.3-9.1 9.4-14.7 14.4-5.5 5-11 11-13.9 18.2-3.4 8.7-2.7 16 1.8 21.3 5.6 6.5 15.7 9.5 27.2 8.9zm-29.3-17c1.7-5.1 5.4-9.3 9.4-13.2 4.3-4.1 8.9-7.9 11.6-12.6.4-.7.6-1.4.7-2.1 1 1 2 2.2 2.8 3.6 4.3 7 2.2 14.9-1.3 21.6-3 5.7-7.2 11.2-11.2 16.7-4.1.2-8-.8-10.7-3.8-2.6-2.9-2.9-6.9-1.3-10.2z"/>
  //   <path fill="#5382a1" d="M60.1 23c4.1-1.4 6-4.5 4.5-7.7-1.2-2.6-4.7-3.9-8.4-4.2 1.3 1.1 2.3 2.8 2.2 4.6-.2 4-4.8 6.4-8.8 8l2.6 1.1c2.6-1 5.3-1.4 7.9-1.8zm-11-2.5c3.2-1.6 4.4-4.4 2.9-7.1-.9-1.7-3.1-2.6-5.5-3 .9.8 1.5 2 1.3 3.3-.2 2.8-3.4 4.5-6.2 5.7l1.8.8c1.9-.7 3.8-1 5.7-1.3zM40 92.5c6.5.6 13.8.3 20.3-1 .9 2.5 1.5 5 2.1 7.4-6.4 1.1-13.4 1.2-19.8.5-1-.9-1.8-1.7-2.6-6.9zm13.1-49.8c.8 4 1.1 8 .6 12-4.3.4-8.3.1-12-.9 1-3.6 3.1-7 6.4-9.5 1.6-.7 3.3-1.2 5-1.6z"/>
  // </svg>
);

function Rightnavbar(props) {

  const [user, setUser] = useState(null);
  const [userData, setuserData] = useState(null);
  const [forceHover, setForceHover] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await JSON.parse(localStorage.getItem('codebyte-user'));
      setUser(userData);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    setForceHover(props.showStreak);
  }, [props]);

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        const { data } = await axios.get(`${getuserRoute}/${user._id}`);
        setuserData(data);
      }
    };
    fetchUser();
  }, [user,props]);

  const handleCourseClick = (course) => {
    // Set the local storage item 'course' to the clicked course
    localStorage.setItem('course', course);
    navigate('/');
    window.location.reload();
  };

  const navigate = useNavigate();

  const currentCourse = localStorage.getItem('course') || 'c&c++';

  return (
    <Container>
      <div className='box'>
        {currentCourse === 'java' ? <JavaLogo /> : <CppLogo />}
        <span className="course-btn-text">
          {currentCourse === 'java' ? 'Java' : 'C & C++'}
        </span>
        <div className="course" >
          <h3 id='one'>MY COURSES</h3>
          <h3 onClick={() => handleCourseClick('c&c++')} className='crs'>C & C++</h3>
          <h3 id='last' onClick={() => handleCourseClick('java')} className='crs'>Java</h3>
        </div>
      </div>
      <div className={`box ${forceHover ? 'force-hover' : null}`} onMouseLeave={() => {
        setForceHover(false); if (props.onShowStreakChange) {
          props.onShowStreakChange(false);
        }
      }}>
        <img src={getAssetUrl('icons8-firee.png', fire)} alt="fire" className='fire' /> <span>{userData?.userData.streak.days || 0}</span>
        <div className="course hoverfire">
          <div className="calendardiv">
            <h3>Streak</h3>
            <h4>Complete a lesson everyday to build your streak !</h4>
            <CalendarApp dates={userData?.userData.streak.dates} />
          </div>
        </div>
      </div>
    </Container>
  )
}

const Container = styled.div`
position: relative;
display: flex;
width: 100%;
justify-content: space-between;
align-items: center;
margin-bottom: 20px;
z-index: 10;
gap: 15px;

h3 {
  &:hover {
    background-color: transparent;
  }
}

.box {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 8px 16px;
    border: 1.5px solid #333;
    border-radius: 16px;
    cursor: pointer;
    background-color: #0f0f0f;
    transition: all 0.2s ease;
    flex: 1;

    &:hover {
      background-color: #1a1a1a;
      border-color: #555;
      transform: translateY(-2px);
      
      &::after {
        content: '';
        position: absolute;
        bottom: -20px;
        left: 0;
        right: 0;
        height: 20px;
        background: transparent;
        z-index: 99;
      }

      .course {
        display: flex;
        opacity: 1;
        transition: opacity 0.3s ease;
      }
    }

    img {
        width: 24px;
        height: 24px;
    }
    
    .course-btn-text, span {
        font-size: 0.95rem;
        color: whitesmoke;
        font-weight: 700;
    }

    .fire {
        width: 22px;
        height: 22px;
    }

    .course {
      display: none;
      background-color: #0f0f0f;
      flex-direction: column;
      z-index: 100;
      width: 200px;
      top: 55px;
      left: 50%;
      transform: translateX(-50%);
      border: 1.5px solid #333;
      border-radius: 16px;
      position: absolute;
      font-size: 0.85rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);

      &::before {
        content: '';
        position: absolute;
        top: -12px;
        left: 50%;
        transform: translateX(-50%);
        border: 6px solid transparent;
        border-bottom-color: #333; 
      }
      &::after {
        content: '';
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
        border: 5px solid transparent;
        border-bottom-color: #0f0f0f; 
      }

      h3 {
        text-align: center;
        padding: 12px;
        margin: 0;
        color: #fff;
        opacity: 0.8;
        font-size: 0.9rem;
        cursor: pointer;
        &:hover {
          background-color: hsla(0, 0%, 100%, 0.05);
        }
      }
      #one {
        text-align: left;
        color: #ffffff80;
        opacity: 0.7;
        font-size: 0.8rem;
        text-transform: uppercase;
        border-bottom: 1.5px solid #333;
        padding: 10px 12px;
        pointer-events: none;
        &:hover {
          background: none;
        }
      }
    }

    .hoverfire {
      width: 320px;
      z-index: 100;
      
      .calendardiv {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 12px;
        
        h3 {
          font-family: "Bricolage Grotesque";
          padding-bottom: 0;
          font-size: 1.1rem;
          color: #fff;
          border-bottom: none;
          &:hover {
            background: transparent;
          }
        }
        h4 {
          font-size: 0.85rem;
          opacity: 0.8;
          line-height: 1.3;
          text-align: center;
          padding: 0 15px;
          margin-top: 8px;
          margin-bottom: 15px;
          color: #aaa;
          font-weight: normal;
        }
      } 
    }
}

.force-hover {
  background-color: #1a1a1a;
  border-color: #555;
  transform: translateY(-2px);
  
  &::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 0;
    right: 0;
    height: 20px;
    background: transparent;
    z-index: 99;
  }

  .course {
    display: flex;
    opacity: 1;
    transition: opacity 0.3s ease;
  }
}
`

export default Rightnavbar