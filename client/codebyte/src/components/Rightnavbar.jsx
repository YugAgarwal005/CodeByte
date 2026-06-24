import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import courses from '../assets/images/icons8-courses-64.png'
import gem from '../assets/images/icons8-emeraldd.png'
import fire from '../assets/images/icons8-firee.png'
import heart from '../assets/images/icons8-love.png'
import { Link, useNavigate } from 'react-router-dom'
import CalendarApp from './Calendar'
import { getuserRoute } from '../utils/Apiroutes'
import axios from 'axios';

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

  return (
    <Container>
      <div className='box'>
        <img src={courses} alt="courses" />
        <div className="course" >
          <h3 id='one'>MY COURSES</h3>
          <h3 onClick={() => handleCourseClick('c&c++')} className='crs'>C & C++ BASICS</h3>
          <h3 id='last' onClick={() => handleCourseClick('java')} className='crs'>JAVA CONCEPTS</h3>
        </div>
      </div>
      <div className={`box ${forceHover ? 'force-hover' : null}`} onMouseLeave={() => {
        setForceHover(false); if (props.onShowStreakChange) {
          props.onShowStreakChange(false);
        }
      }}>
        <img src={fire} alt="fire" className='fire' /> <span>{userData?.userData.streak.days}</span>
        <div className="course hoverfire">
          <div className="calendardiv">
            <h3>Streak</h3>
            <h4>Complete a lesson everyday to build your streak !</h4>
            <CalendarApp dates={userData?.userData.streak.dates} />
          </div>
        </div>
      </div>
      <div className='box'>
        <img src={gem} alt="gem" className='gem' />
        <span>{userData?.userData.gems}</span>
        <div className="course hovergem">
          <img src='https://d35aaqx5ub95lt.cloudfront.net/vendor/33b35ed687f7caabe24c79829a1b98a3.svg' alt="gems" />
          <div className="gemsdiv">
            <h3>Gems</h3>
            <h4>You have {userData?.userData.gems} gems</h4>
            <Link to='/shop'>GO TO SHOP</Link>
          </div>
        </div>
      </div>
      <div className='heartdiv box'>
        <img src={heart} alt="heart" className='heart' /><span>♾️</span>
        <div className="course hoverlove" >
          <h3>Unlimited Hearts <span>♾️</span></h3>
          <h3 id='last'>You don't need to worry about making mistakes</h3>
        </div>
      </div>
    </Container>
  )
}

const Container = styled.div`
position:relative;
display:flex;
width: 100%;
justify-content: space-around;
margin-bottom:10px;
z-index: 2;
h3{
  &:hover{
    background-color: transparent;
  }
}

.box{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    padding: 5px 12px;
    border-radius: 12px;
    cursor: pointer;
    &:hover{
     background-color:hsla(0, 0%, 100%, 0.02);
     transform: translateY(-10%);
     .course{
      display: flex;
      transition: opacity 0.3s ease;
     }
    }
    img{
        width: 30px;
    }
    .gem{
      padding: 1.5px;
      transform: translateY(-12%);
    }
    .fire{
        width: 26px;
        transform: translateY(-8%);
    }
    span{
        font-size: 1.05rem;
        color: whitesmoke;
        font-size: 900;
    }
    .course{
      display: none;
      background-color:#0f0f0f;
      flex-direction: column;
      z-index: 2;
      width: 240px;
      top: 65px;
      border: 1px solid #333;
      border-radius: 16px;
      position: absolute;
      font-size: 0.75rem;
      .crs:active{
        background: none;
      }
      &::before,&::after {
        content: '';
        position: absolute;
        top: -16%;
        left: 50%;
        transform: translateX(-50%);
        border: 12px solid transparent;
        border-bottom-color: #333; 
       }
       &::after {
        border-bottom: 12px solid #0f0f0f;
        top: calc(-16% + 2.4px); 
       }
      h3{
        text-align: center;
        padding: 17px;
        margin:0;
        color:#fff;
        opacity: 0.8;
        &:hover{
          background-color:hsla(0, 0%, 100%, 0.02);
         }
      }
      #one{
        text-align: left;
        color:#ffffff80;
        opacity: 0.7;
        &:hover{
          background: none;
        }
      }
    }
    .hoverfire{
      width: 365px;
      z-index: 1;
      transform: translateX(3px);
      &::before,&::after {
        content: '';
        position: absolute;
        top: -4.5%;
        left: 50%;
        transform: translateX(-50%);
        border: 12px solid transparent;
        border-bottom-color: #333; 
       }
       &::after {
        border-bottom: 12px solid #0f0f0f;
        top: calc(-4.5% + 2.4px); 
       }
      .calendardiv{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 10px 0 22px;
        h3{
        font-family:"Bricolage Grotesque";
        padding-bottom: 0;
        font-size: 1.3rem;
        &:hover{
          background: transparent;
        }
        }
        h4{
          font-size:1rem;
          opacity: 0.8;
          line-height: 1.3;
          text-align: center;
          padding:0 50px;
          margin-top: 12px;
          margin-bottom: 26px;
        }
      } 
    }
    .hoverlove{
      right: -25px;
      &::before,&::after {
        content: '';
        position: absolute;
        top: -17%;
        left: 74%;
        transform: translateX(-50%);
        border: 12px solid transparent;
        border-bottom-color: #333; 
       }
       &::after {
        border-bottom: 12px solid #0f0f0f;
        top: calc(-17% + 2.4px); 
       }
      h3{
        font-size: 1.04rem;
        opacity: 0.85;
        font-weight: normal;
        padding: 26px;
        &:hover{
          background: transparent;
        }
        span{
          font-size: 1.2rem;
        }
        padding-bottom:20px;
      }
      #last{
        padding-top: 0px;
        padding-bottom:25px;
      }
    }
    .hovergem{
      flex-direction: row;
      right: -60px;
      justify-content: flex-start;
      gap: 20px;
      align-items: center;
      padding:20px;
      width: 368px;
      &::before,&::after {
        content: '';
        position: absolute;
        top: -16%;
        left: 70%;
        transform: translateX(-50%);
        border: 12px solid transparent;
        border-bottom-color: #333; 
       }
       &::after {
        border-bottom: 12px solid #0f0f0f;
        top: calc(-16% + 2.4px); 
       }
      img{
        width: 100px;
        height: 100px;
        transform: translateY(-4%);
      }
      .gemsdiv{
        display: flex;
        flex-direction: column;
        h3{
          &:hover{
            background:none;
          }
          font-size: 1.3rem;
          padding: 0;
          font-family:"Bricolage Grotesque";
          text-align: left;
        }
        h4{
          font-size: 1rem;
          font-weight: normal;
        }
        a{
          text-decoration: none;
          color: #1cb0f6;
          font-size: 0.85rem;
        }
      }
    }
}
.force-hover{
    background-color:hsla(0, 0%, 100%, 0.02);
    transform: translateY(-10%);
  .course{
    display: flex;
    transition: opacity 0.3s ease;
  }
}
  .heartdiv{
      gap:4px;
    .heart{
      width: 26px;
    }
    span{
      transform: translateY(-6%);
    }
  }
`

export default Rightnavbar