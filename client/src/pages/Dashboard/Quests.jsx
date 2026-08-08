import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import firee from '../../assets/images/fireee.png'
import target from '../../assets/images/target.png'
import Rightnavbar from '../../components/layout/Rightnavbar'
import { getuserRoute, claimQuestRoute } from '../../utils/Apiroutes'
import axios from 'axios';
import About from '../../components/common/About';
import { Link, useNavigate } from 'react-router-dom';
import leaderboard from '../../assets/images/coins12.png';
import welcome from '../../assets/images/welcome.gif';
import { getAssetUrl } from '../../utils/assets'

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

  const handleClaimQuest = async (questId) => {
    if (!user || !user._id) return;
    try {
      const { data } = await axios.post(claimQuestRoute, { userId: user._id, questId });
      if (data.status && data.user) {
        setUserData(data.user);
      }
    } catch (err) {
      console.error("Error claiming quest:", err);
    }
  };

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
          <img src={getAssetUrl('welcome.gif', welcome)} alt="" />
        </div>
        <div className="dailyquests">
          <div className='header'><span>Daily Quests</span> <span className='time'><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="1"><path d="M1 8C1 4.13401 4.13401 0.999999 8 0.999999C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8Z" stroke="currentColor" strokeWidth="2"></path><path fillRule="evenodd" clipRule="evenodd" d="M8 6C9.10457 6 10 6.89543 10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6Z" fill="currentColor"></path><path fillRule="evenodd" clipRule="evenodd" d="M4.79155 6.09591C4.41476 5.71261 4.41664 5.09746 4.79576 4.71647V4.71647C5.18084 4.3295 5.80777 4.33141 6.19047 4.72073L7.94687 6.50744C8.32366 6.89074 8.32179 7.50589 7.94266 7.88688V7.88688C7.55759 8.27385 6.93065 8.27194 6.54795 7.88263L4.79155 6.09591Z" fill="currentColor"></path></g></svg>
            {24 - hours > 1 ? `${23 - hours} HOURS` : `${59 - minutes} MINUTES`}</span></div>
          <div className='main'>
            <div className="box">
              <img src={getAssetUrl('fireee.png', firee)} alt="" />
              <div className="box-content">
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
              <div className="quest-action">
                {userData?.userData?.dailyChallenges?.claimedQuests?.includes('earn100xp') ? (
                  <span className="claimed-badge">CLAIMED ✓</span>
                ) : (userData?.userData?.dailyChallenges?.xp || 0) >= 100 ? (
                  <button className="claim-btn" onClick={() => handleClaimQuest('earn100xp')}>
                    CLAIM +50 XP
                  </button>
                ) : (
                  <span className="reward-badge">+50 XP</span>
                )}
              </div>
            </div>
            <div className="box">
              <img src="https://d35aaqx5ub95lt.cloudfront.net/images/goals/2b5a211d830a24fab92e291d50f65d1d.svg" alt="" className='star' />
              <div className="box-content">
                <h3><span>Solve 10 Questions Correctly</span> <span>{userData ? ((userData.userData.dailyChallenges.correctQuestions) <= 10 ? (userData.userData.dailyChallenges.correctQuestions) : 10) : 0}/10</span></h3>
                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${userData ? ((userData.userData.dailyChallenges.correctQuestions) * 100 / 10 <= 100 ? (userData.userData.dailyChallenges.correctQuestions) * 100 / 10 : 100) : 0}%` }}
                  ></div>
                </div>
                <h3 className='second'>Ace the challenge: complete 10 questions perfectly</h3>
              </div>
              <div className="quest-action">
                {userData?.userData?.dailyChallenges?.claimedQuests?.includes('solve10ques') ? (
                  <span className="claimed-badge">CLAIMED ✓</span>
                ) : (userData?.userData?.dailyChallenges?.correctQuestions || 0) >= 10 ? (
                  <button className="claim-btn" onClick={() => handleClaimQuest('solve10ques')}>
                    CLAIM +50 XP
                  </button>
                ) : (
                  <span className="reward-badge">+50 XP</span>
                )}
              </div>
            </div>
            <div className="box last">
              <img src={getAssetUrl('target.png', target)} alt="" />
              <div className="box-content">
                <h3><span>Score 100% in 3 lessons </span> <span>{userData ? ((userData.userData.dailyChallenges.lessonsNumber) <= 3 ? (userData.userData.dailyChallenges.lessonsNumber) : 3) : 0}/3</span></h3>
                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${userData ? ((userData.userData.dailyChallenges.lessonsNumber) * 100 / 3 <= 100 ? (userData.userData.dailyChallenges.lessonsNumber) * 100 / 3 : 100) : 0}%` }}
                  ></div>
                </div>
                <h3 className='second'>Strive for excellence: get 100% in 3 lessons</h3>
              </div>
              <div className="quest-action">
                {userData?.userData?.dailyChallenges?.claimedQuests?.includes('score3lessons') ? (
                  <span className="claimed-badge">CLAIMED ✓</span>
                ) : (userData?.userData?.dailyChallenges?.lessonsNumber || 0) >= 3 ? (
                  <button className="claim-btn" onClick={() => handleClaimQuest('score3lessons')}>
                    CLAIM +50 XP
                  </button>
                ) : (
                  <span className="reward-badge">+50 XP</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="right">
        <Rightnavbar />
        <div className="leaderboard">
          <div className="head">
            <span>Rankings</span>
            <Link to='/leaderboards'>VIEW LEADERBOARD</Link>
          </div>
          <div className="content">
            <img src={getAssetUrl('coins12.png', leaderboard)} alt="" />
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
width: 100%;
box-sizing: border-box;
@media (max-width: 1024px) {
  padding: 0 12px 20px;
  margin-top: 10px;
  gap: 15px;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
}
.left{
  margin-top: 15px;
  width: 100%;
  @media (max-width: 1024px) {
    margin-top: 0;
  }
}
.right{
  display: flex;
  padding-left:15px;
  flex-direction: column;
  align-items: center;
  gap:20px;
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
}

@media (min-width: 1025px) {
  max-width: 1080px;
  .left{
    flex: 1;
  }
  .right{
    flex: 0 0 auto; 
    width: 380px; 
  }
}
@media (max-width: 1024px) {
  .right {
    display: none !important;
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
  @media (max-width: 600px) {
    height: auto;
    min-height: 180px;
    padding: 15px;
    flex-direction: column-reverse;
    align-items: center;
    text-align: center;
    gap: 15px;
  }
  .text{
    align-self: center;
    padding: 30px;
    padding-right: 0;
    font-size: 1.25rem;
    line-height: 1.5;
    @media (max-width: 600px) {
      padding: 0;
      font-size: 1rem;
    }
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
  img {
    @media (max-width: 600px) {
      width: 120px;
      height: auto;
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
    @media (max-width: 480px) {
      font-size: 1.1rem;
    }
    span{
    font-family:"Bricolage Grotesque";
    svg{
      margin-right:7px;
    }
    }
    .time{
      color: #ff9600;
      font-size: 1.05rem;
      @media (max-width: 480px) {
        font-size: 0.9rem;
      }
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
      gap:24px;
      border-bottom:1.5px solid #333;
      @media (max-width: 550px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
        padding: 16px 14px;
      }
      .star{
          width: 70px;
        }
      .box-content{
        display: flex;
        flex-direction: column;
        flex: 1;
        gap:15px;
        width: 100%;
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
      .quest-action {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        min-width: 110px;
        @media (max-width: 550px) {
          width: 100%;
          justify-content: flex-start;
          min-width: unset;
        }

        .claim-btn {
          background: #58cc02;
          color: #fff;
          border: none;
          padding: 10px 18px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.85rem;
          font-family: "Bricolage Grotesque", sans-serif;
          cursor: pointer;
          box-shadow: 0 4px 0 #46a302;
          transition: all 0.15s ease;
          white-space: nowrap;

          &:hover {
            background: #61df02;
          }
          &:active {
            transform: translateY(2px);
            box-shadow: 0 2px 0 #46a302;
          }
        }

        .claimed-badge {
          background: rgba(88, 204, 2, 0.15);
          color: #58cc02;
          border: 1.5px solid rgba(88, 204, 2, 0.4);
          padding: 8px 14px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.85rem;
          font-family: "Bricolage Grotesque", sans-serif;
          white-space: nowrap;
        }

        .reward-badge {
          background: rgba(255, 150, 0, 0.15);
          color: #ff9600;
          border: 1.5px solid rgba(255, 150, 0, 0.3);
          padding: 8px 14px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.85rem;
          font-family: "Bricolage Grotesque", sans-serif;
          white-space: nowrap;
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
`;

export default Quests