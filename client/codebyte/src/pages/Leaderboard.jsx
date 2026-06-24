import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components';
import About from '../components/About';
import Rightnavbar from '../components/Rightnavbar';
import { Link, useNavigate } from 'react-router-dom';
import { getuserRoute, getleaderboardRoute } from '../utils/Apiroutes';
import axios from 'axios';

function Leaderboard() {

  const [userData, setUserData] = useState(null);
  const [user, setUser] = useState(null);
  const [leaderboard, setleaderboard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (user) {
        const { data } = await axios.get(`${getuserRoute}/${user._id}`);
        setUserData(data);
      }
    })()
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${getleaderboardRoute}`);
        setleaderboard(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (user) {
      fetchData();
    }
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
        <div className="fix">
          <img src="https://d35aaqx5ub95lt.cloudfront.net/images/leagues/74d6ab6e5b6f92e7d16a4a6664d1fafd.svg" alt="" />
          <h3 className='header head'>Ruby League</h3>
          <h3 className="header">More leagues coming soon ...</h3>
        </div>
        <div className="leaderbd">
          {leaderboard != null ?
            leaderboard.map((user, index) => (
              <div className={user._id == userData?._id ? 'rank crect' : 'rank'} key={index} onClick={() => navigate(user._id != userData._id ? `/profile/u/${user._id}` : `/profile`)}>
                {index === 0 ?
                  <span className='num'><img src="https://d35aaqx5ub95lt.cloudfront.net/images/leagues/9e4f18c0bc42c7508d5fa5b18346af11.svg" alt="" /></span> :
                  index === 1 ?
                    <span className="num"><img src="https://d35aaqx5ub95lt.cloudfront.net/images/leagues/cc7b8f8582e9cfb88408ab851ec2e9bd.svg" alt="" /></span> :
                    index === 2 ?
                      <span className="num"><img src="https://d35aaqx5ub95lt.cloudfront.net/images/leagues/eef523c872b71178ef5acb2442d453a2.svg" alt="" /></span> :
                      <span className="num">{index + 1}</span>
                }
                <img src={`data:image/svg+xml;base64,${user.AvatarImage}`} alt="" />
                <span className='name'>{user.username}</span>
                <span className='xp'>{user.userData.xp} XP</span>
              </div>
            ))
            : null}
        </div>
      </div>
      <div className="right">
        <Rightnavbar />
        <div className="leaderboard">
          <div className="head">
            <span>Daily quests</span>
            <Link to='/quests'>VIEW ALL</Link>
          </div>
          <div className="content">
            <img src='https://d35aaqx5ub95lt.cloudfront.net/images/goals/2b5a211d830a24fab92e291d50f65d1d.svg' alt="" />
            <div className='xp'>
              <h3>Earn 100 XP</h3>
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{ width: `${userData ? ((userData.userData.dailyChallenges.xp) * 100 / 100 <= 100 ? (userData.userData.dailyChallenges.xp) * 100 / 100 : 100) : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="content two">
            <img src='https://d35aaqx5ub95lt.cloudfront.net/images/goals/2b5a211d830a24fab92e291d50f65d1d.svg' alt="" />
            <div className='xp'>
              <h3>Solve 10 Questions Correctly</h3>
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{ width: `${userData ? ((userData.userData.dailyChallenges.correctQuestions) * 100 / 10 <= 100 ? (userData.userData.dailyChallenges.correctQuestions) * 100 / 10 : 100) : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="content two">
            <img src='https://d35aaqx5ub95lt.cloudfront.net/images/goals/2b5a211d830a24fab92e291d50f65d1d.svg' alt="" />
            <div className='xp'>
              <h3>Score 100% in 3 lessons</h3>
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{ width: `${userData ? ((userData.userData.dailyChallenges.lessonsNumber) * 100 / 3 <= 100 ? (userData.userData.dailyChallenges.lessonsNumber) * 100 / 3 : 100) : 0}%` }}
                ></div>
              </div>
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
  overflow-y: scroll;
  height: 97vh;
  .fix{
    display: flex;
    flex-direction: column;
    align-items: center;
    border-bottom: 1.5px solid #333;
  img{
    width: 80px;
  }
  .header{
    padding: 18px;
    color: #777;
    padding-top: 0px;
    font-weight: normal;
    margin-top: 15px;
  }
  .head{
    padding-bottom: 0px;
    font-size: 1.5rem;
    border: none;
    color: #fff;
    margin-bottom:0px;
    font-weight: 600;
  }
}
  padding-top: 6px;
  padding-bottom: 20px;
  &::-webkit-scrollbar{
    width: 0;
  }
  .leaderbd{
    display: flex;
    flex-direction: column;
    padding: 20px 5px;
    padding-top: 10px;
    margin-bottom:25px;
    .rank{
      display: grid;
      grid-template-columns:0.9fr 1.3fr 2fr 4.2fr;
      align-items: center;
      padding: 8px 10px;
      gap: 10px;
      margin-bottom:1px;
      border-radius: 16px;
      cursor: pointer;
      .num{
        font-size: 1.2rem;
        text-align: center;
        img{
          padding: 2px;
        }
      }
      &:hover{
          background-color:hsla(0, 0%, 100%, 0.02);
      }
      .name{
        color: #fff;
        font-size: 1.1rem;
      }
      .xp{
        justify-self:flex-end;
        color: #777777cc;
        padding-right:20px;
      }
      img{
        width: 48px;
        height: 48px;
      }
    }
    .crect{
        border: 1.5px solid #58a700;
        color: green;
        background: #d7ffb8cc;
        .name{
        color: green;
        }
        .xp{
          color: green;
        }
        &:hover{
          background: #d7ffb8cc;
        }
      }
  }
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
      .xp{
        width: 100%;
        transform: translateY(-12%);
        h3{
          font-weight: normal;
          font-size: 1rem;
          color: white;
        }
      }
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
      span{
        color: #eb2632;
      }
      img{
        width:73px ;
      }
    }
  }
  }`;

export default Leaderboard