import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components';
import About from '../components/About';
import Rightnavbar from '../components/Rightnavbar';
import leaderboard from '../assets/images/coins12.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getuserRoute, shopRoute } from '../utils/Apiroutes';
import axios from 'axios';
import gem from '../assets/images/icons8-emeralddd.png'

function Shop() {
  const [userData, setUserData] = useState(null);
  const [user, setUser] = useState(null);
  const [showStreak, setShowStreak] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    (async () => {
      if (!localStorage.getItem('course')) {
        localStorage.setItem('course', 'c&c++')
      }
      if (localStorage.getItem('codebyte-user')) {
        const userData = await JSON.parse(localStorage.getItem('codebyte-user'));
        setUser(userData);
      }
      else {
        navigate('/login')
      }
    })();
  }, [])

  useEffect(() => {
    (async () => {
      if (user) {
        const { data } = await axios.get(`${getuserRoute}/${user._id}`);
        setUserData(data);
        if(location.state?.setShowstreak){
          setShowStreak(true);
      }
      }
    })()
  }, [user,location.state]);

  const handleShowStreakChange = (newValue) => {
    setShowStreak(newValue);
  };

  const GemsShop = async() => {
    if (user) {
      const { data } = await axios.post(`${shopRoute}/${user._id}`);
      if(data.status==true)
      {
        navigate("/shop",{ state: { setShowstreak: true } })
      }
      else{
        navigate("/shop",{ state: { setShowstreak: false } })
      }
    }
  }

  return (
    <Container>
      <div className="left">
        <div className="shopbox">
          <h3>Hearts</h3>
          <div className="main">
            <div className="box">
              <img src='https://d35aaqx5ub95lt.cloudfront.net/images/hearts/547ffcf0e6256af421ad1a32c26b8f1a.svg' alt="" />
              <div>
                <h3>Refill Hearts</h3>
                <h3 className='second'>Get full hearts so you can worry less about making mistakes in a lesson</h3>
              </div>
            </div>
            <div className="button disabled">
              FULL
            </div>
          </div>
          <div className="main">
            <div className="box box2">
              <img src='https://d35aaqx5ub95lt.cloudfront.net/images/hearts/4f3842c690acf9bf0d4b06e6ab2fffcf.svg' alt="" />
              <div>
                <h3>Unlimited Hearts</h3>
                <h3 className='second'>Never run out of hearts with us !</h3>
              </div>
            </div>
            <div className="button two">
              FREE TRIAL
            </div>
          </div>
          <div className="shopbox">
            <h3>Power-Ups</h3>
            <div className="main">
              <div className="box">
                <img src='https://d35aaqx5ub95lt.cloudfront.net/images/icons/216ddc11afcbb98f44e53d565ccf479e.svg' alt="" />
                <div>
                  <h3>Streak Freeze</h3>
                  <h3 className='second'>Streak Freeze allows your streak to remain in place for inactivity.</h3>
                </div>
              </div>
              <div className="button three" onClick={() => GemsShop()}  onMouseLeave={()=>{setTimeout(()=>{setShowStreak(false)},1000)}}>
                GET FOR : <img src={gem} alt="" /> 200
              </div>
            </div>
            <div className="main">
              <div className="box">
                <img src='https://d35aaqx5ub95lt.cloudfront.net/images/icons/47112600732328e46768927036578c8b.svg' alt="" />
                <div>
                  <h3>Double or Nothing</h3>
                  <h3 className='second'>Double your 50 gem wager by maintaining a 7 day streak.</h3>
                </div>
              </div>
              <div className="button disabled">
                DAY {userData?.userData.streak.days} OF 7
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className="right">
        <Rightnavbar showStreak={showStreak} onShowStreakChange={handleShowStreakChange} />
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
  padding-bottom:45px;
  .shopbox{
    h3{
    font-size:1.3rem;
    color:#fff;
    margin-bottom: 25px;
    font-weight:500;
    font-family:"Bricolage Grotesque";
  }
  .main{
    display: flex;
    flex-direction:row;
    border-top:1.5px solid #333;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 20px 15px;
    .button{
      padding: 13px;
      border: 1.5px solid #333;
      border-radius: 16px;
      background-color: #0f0f0f;
      min-width: 165px;
      min-height: 44px;
      font-size: 0.9375rem;
      box-shadow: 0px 3px 0px 0px #222;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #1cb0f6;
      display: flex;
      img{
        width: 25px;
        height: 17px;
        padding: 0.1px 4px;
        transform: translateY(-1px);
      }
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
    .disabled{
    background-color: #e5e5e580;
    box-shadow: 0px 4px 0px 0px #444;
    border: 1.5px solid #777;
    color: #22222280;
    font-weight: 600;
    &:hover{
     opacity: 1;
     background: #e5e5e580;
     }
    }
    .two{
      color: #cf17c8;
    }
    .box{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      h3{
        font-size: 1.2rem;
        margin-bottom: 15px;
        margin-top:0;
      }
      .second{
          opacity: 30%;
          font-weight: 400;
          line-height: 1.5;
          font-size: 1rem;
          margin:0;
        }
      img{
        width: 100px;
        height: 100px;
      }
    }
    .box2{
      img{
        padding: 6px;
      }
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

export default Shop