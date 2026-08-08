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
);

const PythonLogo = () => (
  <svg viewBox="0 0 128 128" width="24" height="24" style={{ minWidth: '24px' }}>
    <path fill="#3776AB" d="M63.3 2C32.6 2 34 15.3 34 15.3l.1 15.8h29.8v4.2H21.7S2 31.8 2 62.8c0 30.9 17.2 29.8 17.2 29.8h10.3V78.1s-.6-17.5 17.2-17.5h29.5s16.6.2 16.6-16V18S94.8 2 63.3 2zm-12.7 9.5c2.7 0 4.9 2.2 4.9 4.9s-2.2 4.9-4.9 4.9-4.9-2.2-4.9-4.9 2.2-4.9 4.9-4.9z"/>
    <path fill="#FFD43B" d="M64.7 126c30.7 0 29.3-13.3 29.3-13.3l-.1-15.8H64.1v-4.2h42.2s19.7 3.5 19.7-27.5c0-30.9-17.2-29.8-17.2-29.8H98.5V49.9s.6 17.5-17.2 17.5H51.8s-16.6-.2-16.6 16v26.4S33.2 126 64.7 126zm12.7-9.5c-2.7 0-4.9-2.2-4.9-4.9s2.2-4.9 4.9-4.9 4.9 2.2 4.9 4.9-2.2 4.9-4.9 4.9z"/>
  </svg>
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

  const renderCourseLogo = () => {
    if (currentCourse === 'python') return <PythonLogo />;
    if (currentCourse === 'java') return <JavaLogo />;
    return <CppLogo />;
  };

  const renderCourseLabel = () => {
    if (currentCourse === 'python') return 'Python';
    if (currentCourse === 'java') return 'Java';
    return 'C & C++';
  };

  return (
    <Container>
      <div className='box'>
        {renderCourseLogo()}
        <span className="course-btn-text">
          {renderCourseLabel()}
        </span>
        <div className="course" >
          <h3 id='one'>MY COURSES</h3>
          <h3 onClick={() => handleCourseClick('c&c++')} className='crs'>C & C++</h3>
          <h3 onClick={() => handleCourseClick('java')} className='crs'>Java</h3>
          <h3 id='last' onClick={() => handleCourseClick('python')} className='crs'>Python</h3>
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