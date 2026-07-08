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
  <svg viewBox="0 0 128 128" width="24" height="24" style={{ minWidth: '24px' }}>
    <path fill="#00599C" d="M117.5 33.5L64 2.5 10.5 33.5v61l53.5 31 53.5-31v-61z"/>
    <path fill="#004482" d="M64 2.5v123l53.5-31v-61L64 2.5z"/>
    <path fill="#FFF" d="M80 60.5h10v7H80V78h-7V67.5H63v-7h10V50h7v10.5zm19 0h10v7H99V78h-7V67.5H82v-7h10V50h7v10.5z"/>
    <path fill="#FFF" d="M35 64c0-11 8.5-20 19-20 6 0 11.5 2.5 15 7l-5.5 4.5c-2.5-3-6-4.5-9.5-4.5-7 0-12 6-12 13s5 13 12 13c3.5 0 7-1.5 9.5-4.5l5.5 4.5c-3.5 4.5-9 7-15 7-10.5 0-19-9-19-20z"/>
  </svg>
);

const JavaLogo = () => (
  <svg viewBox="0 0 128 128" width="24" height="24" style={{ minWidth: '24px' }}>
    <path fill="#5382a1" d="M88.7 82.5c2.3 1.1 4.5 2.5 6.3 4.2 4.1-1.7 5.7-4.3 4.4-6.8-2.3-4.3-13.6-5.8-25.2-3.4 5 1.7 10.2 3.6 14.5 6zM96.4 69c4.2-3.8 6.4-7.5 5.2-10-2-3.9-12-3.3-22.3 1.3 5.4.9 11.2 2.4 17.1 8.7z"/>
    <path fill="#f89820" d="M51.2 121.2c5.9 0 11.1-.3 15.3-.9 11.1-1.5 18-5.3 18.5-10.3.6-5-5-8.4-14.4-10-8.5-1.5-19.1-1.9-26.6-.7-10 1.6-15.6 5.3-15.1 10.2.6 5.1 7.2 8.5 17 10.4 1.8.3 3.6.7 5.3 1.3zm31-23.7c-2 0-3.9.1-5.7.3 10 2.2 14.9 5.8 14.3 9-.5 2.8-4.4 5.1-11.2 6.4 13.9.7 20-2.4 20.6-7.3.7-5.4-6-8.4-18-8.4zm-48.4 19.3c-7-1.4-10.7-3.6-11.1-6-.4-2.5 2.6-5 8.1-6.7-1 1.7-1.4 3.7-1.2 5.7.4 3 2.1 5.3 4.2 7zM71 78.5c5.3-7.5 10.5-15.5 13-25.5 3-12.2.8-21.6-6-27-2-1.6-4.2-2.9-6.6-3.8.3 1-.1 2.2-.8 3.5-3 5.3-9.1 9.4-14.7 14.4-5.5 5-11 11-13.9 18.2-3.4 8.7-2.7 16 1.8 21.3 5.6 6.5 15.7 9.5 27.2 8.9zm-29.3-17c1.7-5.1 5.4-9.3 9.4-13.2 4.3-4.1 8.9-7.9 11.6-12.6.4-.7.6-1.4.7-2.1 1 1 2 2.2 2.8 3.6 4.3 7 2.2 14.9-1.3 21.6-3 5.7-7.2 11.2-11.2 16.7-4.1.2-8-.8-10.7-3.8-2.6-2.9-2.9-6.9-1.3-10.2z"/>
    <path fill="#5382a1" d="M60.1 23c4.1-1.4 6-4.5 4.5-7.7-1.2-2.6-4.7-3.9-8.4-4.2 1.3 1.1 2.3 2.8 2.2 4.6-.2 4-4.8 6.4-8.8 8l2.6 1.1c2.6-1 5.3-1.4 7.9-1.8zm-11-2.5c3.2-1.6 4.4-4.4 2.9-7.1-.9-1.7-3.1-2.6-5.5-3 .9.8 1.5 2 1.3 3.3-.2 2.8-3.4 4.5-6.2 5.7l1.8.8c1.9-.7 3.8-1 5.7-1.3zM40 92.5c6.5.6 13.8.3 20.3-1 .9 2.5 1.5 5 2.1 7.4-6.4 1.1-13.4 1.2-19.8.5-1-.9-1.8-1.7-2.6-6.9zm13.1-49.8c.8 4 1.1 8 .6 12-4.3.4-8.3.1-12-.9 1-3.6 3.1-7 6.4-9.5 1.6-.7 3.3-1.2 5-1.6z"/>
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
  .course {
    display: flex;
    opacity: 1;
    transition: opacity 0.3s ease;
  }
}
`

export default Rightnavbar