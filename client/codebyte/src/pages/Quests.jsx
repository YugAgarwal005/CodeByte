import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import firee from '../assets/images/fireee.png'
import target from '../assets/images/target.png'
import Rightnavbar from '../components/Rightnavbar'
import { getuserRoute } from '../utils/Apiroutes'
import axios from 'axios';
import About from '../components/About';
import { Link, useNavigate } from 'react-router-dom';
import leaderboard from '../assets/images/coins12.png';
import welcome from '../assets/images/welcome.gif';

function Quests() {

  const [userData, setUserData] = useState(null);
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();

  useEffect(() => {
    (async () => {
      if (user) {
        const { data } = await axios.get(`${getuserRoute}/${user._id}`);
        setUserData(data);
      }
    })()
  }, [user]);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await JSON.parse(localStorage.getItem('codebyte-user'));
      setUser(userData);
    };
    fetchUser();
  }, []);

  return (
    <Container>
      <div className="left">
        <div className="welcome">
          <div className="text">
            <div><h3>Welcome !</h3><span>{userData?.username}</span></div>
            <span>Complete quests to earn rewards! Quests refresh every day.</span>
          </div>
          <img src={welcome} alt="" />
        </div>
        <div className="dailyquests">
          <div className='header'><span>Daily Quests</span> <span className='time'><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="1"><path d="M1 8C1 4.13401 4.13401 0.999999 8 0.999999C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8Z" stroke="currentColor" stroke-width="2"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M8 6C9.10457 6 10 6.89543 10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M4.79155 6.09591C4.41476 5.71261 4.41664 5.09746 4.79576 4.71647V4.71647C5.18084 4.3295 5.80777 4.33141 6.19047 4.72073L7.94687 6.50744C8.32366 6.89074 8.32179 7.50589 7.94266 7.88688V7.88688C7.55759 8.27385 6.93065 8.27194 6.54795 7.88263L4.79155 6.09591Z" fill="currentColor"></path></g></svg>
            {24 - hours > 1 ? `${23 - hours} HOURS` : `${59 - minutes} MINUTES`}</span></div>
          <div className='main'>
            <div className="box">
              <img src={firee} alt="" />
              <div>
                <h3><span>Earn 100 XP </span> <span>{userData ? ((userData.userData.dailyChallenges.xp) <= 100 ? (userData.userData.dailyChallenges.xp) : 100) : 0}/100</span></h3>
                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${userData ? ((userData.userData.dailyChallenges.xp) * 100 / 100 <= 100 ? (userData.userData.dailyChallenges.xp) * 100 / 100 : 100) : 0}%`
                    }}
                  ></div>
                </div>
                <h3 className='second'>Earn XP by solving lessons</h3>
              </div>
            </div>
            <div className="box">
              <img src="https://d35aaqx5ub95lt.cloudfront.net/images/goals/2b5a211d830a24fab92e291d50f65d1d.svg" alt="" className='star' />
              <div>
                <h3><span>Solve 10 Questions Correctly</span> <span>{userData ? ((userData.userData.dailyChallenges.correctQuestions) <= 10 ? (userData.userData.dailyChallenges.correctQuestions) : 10) : 0}/10</span></h3>
                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${userData ? ((userData.userData.dailyChallenges.correctQuestions) * 100 / 10 <= 100 ? (userData.userData.dailyChallenges.correctQuestions) * 100 / 10 : 100) : 0}%` }}
                  ></div>
                </div>
                <h3 className='second'>Ace the challenge: complete 10 questions perfectly</h3>
              </div>
            </div>
            <div className="box last">
              <img src={target} alt="" />
              <div>
                <h3><span>Score 100% in 3 lessons </span> <span>{userData ? ((userData.userData.dailyChallenges.lessonsNumber) <= 3 ? (userData.userData.dailyChallenges.lessonsNumber) : 3) : 0}/3</span></h3>
                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${userData ? ((userData.userData.dailyChallenges.lessonsNumber) * 100 / 3 <= 100 ? (userData.userData.dailyChallenges.lessonsNumber) * 100 / 3 : 100) : 0}%` }}
                  ></div>
                </div>
                <h3 className='second'>Strive for excellence: get 100% in 3 lessons</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="right">
        <Rightnavbar />
        <div className="monthly">
          <div className='divv'>
            <div className="text">
              <span className='hd'>Monthly challenges unlock soon!</span>
              <span>Complete each month’s challenge to earn exclusive badges</span>
            </div>
            <img src="https://d35aaqx5ub95lt.cloudfront.net/images/goals/e07e459ea20aef826b42caa71498d85f.svg" alt="" />
          </div>
          <div className="lesson" onClick={() => setTimeout(() => { navigate('/') }, 700)}>
            Start a lesson
          </div>
        </div>
        <div className="leaderboard">
          <div className="head">
            <span>Rankings</span>
            <Link to='/leaderboards'>VIEW LEAGUE</Link>
          </div>
          <div className="content">
            <img src={leaderboard} alt="" />
            <div>
              You are ranked <span>#{userData?.rank}</span> Complete lessons to join leaderboard and compete against other learners
            </div>
          </div>
        </div>
        <About />
      </div>
    </Container>
  )
}

const Container = styled.div`
display:flex;
color: #AFAFAF;
margin:25px auto 0;
padding:0 25px;
gap:25px;
.left{
  margin-top: 15px;
}
@media (min-width: 900px) {
  max-width: 1080px;
  .left{
    flex: 1;
    /* border:1px white solid; */
  }
  .right{
    flex: 0 0 auto; 
    width: 400px; 
  }
}
 .welcome{
  border: 1.5px solid #333;
  border-radius: 16px;
  height: 240px;
  margin-bottom: 30px;
  margin-top: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: linear-gradient(to right, #ff8c00, #ff0080);
  .text{
    align-self: center;
    padding: 30px;
    padding-right: 0;
    font-size: 1.25rem;
    line-height: 1.5;
  div{
    h3{
    margin-bottom: 5px;
    font-family:"Bricolage Grotesque";

      color: #fff;
    }
    span{
      color: #0f0f0f;
      font-size: 1.35rem;
    }
  }
  span{
    color: #fff;
  }
}
 }
  .dailyquests{
  margin-bottom: 30px;
  padding-bottom:35px;
  .header{
    font-size:1.3rem;
    color:#fff;
    font-weight:500;
    margin: 20.8px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span{
    font-family:"Bricolage Grotesque";
    svg{
      margin-right:7px;
    }
    }
    .time{
      color: #ff9600;
      font-size: 1.05rem;
    }
  }
  h3{
    font-size:1.3rem;
    color:#fff;
    font-weight:500;
    font-family:"Bricolage Grotesque";
  }
  .main{
    display: flex;
    flex-direction: column;
    border:1.5px solid #333;
    border-radius:16px;
    .box{
      display: flex;
      align-items: center;
      flex-direction: row;
      padding:22px 25px;
      gap:32px;
      border-bottom:1.5px solid #333;
      .star{
          width: 73px;
        }
      div{
        display: flex;
        flex-direction: column;
        width: 100%;
        gap:20px;
        .progress-container {
          width: 100%;
          background-color: #33333380;
          border-radius: 16px;
         }
        .progress-bar {
          width: 0;
          height: 12px;
          border-radius: 16px;
          background: linear-gradient(to left, #FF5722, #FFC107);
         }
    }
      img{
        width: 70px;
        height: 70px;
      }
      h3{
          margin:0;
          font-size: 1.1rem;
          display: flex;
          justify-content:space-between;
          span:nth-child(2){
            opacity: 30%;
          }
        }
        .second{
          opacity: 30%;
          font-weight: 400;
          font-size: 1rem;
        }
    }
    .last{
      border: none;
    }
  }
}
.right{
  display: flex;
  padding-left:15px;
  flex-direction: column;
  align-items: center;
  gap:20px;
  .monthly{
    width: 368px;
    border: 1.5px solid #333;
    border-radius: 16px;
    padding: 22px;
    padding-top: 35px;
    padding-bottom: 25px;
    z-index: 0;
    height: 275px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    .divv{
      display: flex;
      flex-direction: row;
      .text{
        display: flex;
        flex-direction: column;
        gap: 20px;
        line-height: 1.5;
        font-weight: 600;
        color: #AFAFAf80;
        .hd{
          color: #fff;
        }
      }
    }
    .lesson{
      padding: 13px;
      border: 1.5px solid #333;
      border-radius: 12px;
      background-color: #0f0f0f;
      box-shadow: 0px 3px 0px 0px #222;
      text-align: center;
      color: #1cb0f6;
      cursor: pointer;
      text-transform: uppercase;
      &:active{
        box-shadow: none;
        transform: translateY(10%);
        border: 1px solid #33333380;
      }
      &:hover{
        background-color:hsla(0, 0%, 100%, 0.02);
        /* transition: 0.5s ease-out; */
      }
    }
  }
  .leaderboard{
    width: 368px;
    border: 1.5px solid #333;
    border-radius: 16px;
    padding: 22px;
    z-index: 0;
    .head{
      display: flex;
      font-weight: 600;
      font-size: 0.9rem;
      justify-content: space-between;
      span{
        text-transform: uppercase;
        color: #fff;
      }
      a{
        text-decoration: none;
        color: #1cb0f6;
        z-index: 2;
      }
      margin-bottom: 25px;
    }
    .two{
        margin-top: 25px;
        margin-bottom:10px;
      }
    .content{
      display: flex;
      justify-content: space-between;
      gap: 22px;
      color: #777;
      align-items: center;
      line-height: 1.2;
      span{
        color: #eb2632;
      }
      img{
        width:73px ;
      }
    }
  }
  }`;

export default Quests