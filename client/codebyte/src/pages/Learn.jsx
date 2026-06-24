import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components';
import About from '../components/About';
import Rightnavbar from '../components/Rightnavbar';
import leaderboard from '../assets/images/coins12.png';
import trophy from '../assets/images/trophy.png'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getcourseRoute ,getuserRoute } from '../utils/Apiroutes';
import axios from 'axios';
import err from '../assets/images/4044.png'

function Learn() {

  const [course, setCourse] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const [showStreak,setShowStreak]=useState(false);

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
  }, []);

  useEffect(() => {
    (async () => {
      if(user){
      const { data } = await axios.get(`${getuserRoute}/${user._id}`);
      setUserData(data);
      }
    })()
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const { data } = await axios.get(`${getcourseRoute}/${localStorage.getItem('course')}/${user._id}`);
          setCourse(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
    if(location.state?.setShowStreak){
        setShowStreak(true)
    }
  }, [user,location.state]);

  const handleShowStreakChange = (newValue) => {
    setShowStreak(newValue);
  };

  return (
    <>
      {
        !course ?
          (
            !user ?
              <Containererror>
                <img src={err} alt="error" className='errorr' />
              </Containererror>
              :
              <Container>
              </Container>
          )
          :
          <Container onMouseEnter={()=>{setTimeout(()=>{setShowStreak(false)},1000)}}>
            <div className="left">
              <h3 className='header'>Section 1 : {course.name === 'java' ? "Java Concepts" : "C & C++ Basics"}</h3>
              {course.units.map((unit, outerindex) => (
                <div className={`unit ${outerindex% 3 == 0 ? 'unit3' : outerindex% 3 == 1 ? 'unit2' : 'unit1'}`} key={outerindex}>
                  <div className="rectangle">
                    <div className="one">
                      <h3>Unit {unit.unitNumber}</h3>
                      <h4>{unit.heading}</h4>
                    </div>
                    <div className="two">
                      <img src="https://d35aaqx5ub95lt.cloudfront.net/images/path/5b531828e59ae83aadb3d88e6b3a98a8.svg" /><span>GUIDEBOOK</span>
                      <div className="guidebook">{unit.guideBook}</div>
                    </div>
                  </div>
                  <div className={`circles ${unit.level > 0 ? "circlesstarted" : null}`}>
                    {unit.lessons.map((lesson, innerindex) => (
                      <button
                        className={`circle ${unit.unitNumber % 2 === 0 ? 'd' : 'c'}${innerindex + 1} ${unit.level < innerindex ? null : 'solved'}`}
                        key={innerindex} onClick={() => {
                          if (!(unit.level < innerindex) || innerindex === 0)
                            setTimeout(() => {
                              navigate(`/quiz/unit/${unit.unitNumber}/level/${lesson.lessonNumber}`);
                            }, 700);
                        }}
                      >
                        {innerindex === 0 && unit.level < innerindex + 1 ? <div className="float">JUMP HERE ?</div> : null}
                        {innerindex != 0 && unit.level === innerindex ? <div className="float strt">START</div> : null}
                        {unit.level < innerindex ? <div className="float locked">
                          <h3>Complete all levels above to unlock this !</h3> <div>locked</div>
                        </div> : null}
                        {innerindex + 1 === unit.lessons.length ? <img src={trophy} alt="" /> :
                          unit.level === 0 && innerindex === 0 ? <img src="https://d35aaqx5ub95lt.cloudfront.net/images/path/icons/5e4203031e39fc43d94371565fd0d369.svg" alt="" /> :
                            unit.level === innerindex ? <img src="https://d35aaqx5ub95lt.cloudfront.net/images/path/icons/ef9c771afdb674f0ff82fae25c6a7b0a.svg" alt="" />
                              : unit.level < innerindex + 1 ?
                                <img src="https://d35aaqx5ub95lt.cloudfront.net/images/path/icons/261caf5e7127c22944a432ef5c191cfa.svg" alt="" />
                                : <img src="https://d35aaqx5ub95lt.cloudfront.net/images/path/icons/bfa591f6854b4de08e1656b3e8ca084f.svg" alt="" />
                        }
                      </button>
                    ))}
                  </div>
                </div>
              ))}

            </div>
            <div className="right">
              <Rightnavbar showStreak={showStreak} onShowStreakChange={handleShowStreakChange}/>
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
                        style={{ width: `${userData ? ((userData.userData.dailyChallenges.xp)*100/100 <=100 ? (userData.userData.dailyChallenges.xp)*100/100 :100) : 0}%` }}
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
                        style={{ width: `${userData ? ((userData.userData.dailyChallenges.correctQuestions)*100/10 <=100 ? (userData.userData.dailyChallenges.correctQuestions)*100/10 :100) : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <About />
            </div>
          </Container>
      }
    </>
  )
}

const Containererror = styled.div`
display: flex;
justify-content: center;
height: 100vh;
align-items: center;
overflow: hidden;
.errorr{
    /* width: 512px; */
    width: 80%;
    z-index: -1;
    transform: translateY(-3%);
}`;

const Container = styled.div`
display:flex;
color: #AFAFAF;
margin:0px auto 0;
padding:25px 25px 0;
gap:25px;
.left{
  overflow-y: scroll;
  height: 97vh;
  .header{
    text-align: center;
    border-bottom: 1.5px solid #333;
    padding: 18px;
    color: #777;
  }
  padding-top: 6px;
  padding-bottom: 20px;
  &::-webkit-scrollbar{
    width: 0;
  }
  .unit{
    margin: 22px 0 45px;
    .rectangle{
      color: #fff;
      display: flex;
      justify-content: space-between;
      padding: 4px 20px;
      align-items: center;
      text-transform: capitalize;
      h3{
        font-size:1.3rem;
      }
      h4{
          font-weight: 600;
        }
      border-radius: 13px;
      .two{
        display: flex;
        align-items: center;
        gap: 12px;
        position: relative;
        padding: 14px 18px;
        border-radius: 16px;
        box-shadow: rgba(0, 0, 0, 0.3) 0 2px 0;
        border: 2px solid rgba(0,0,0, 0.2);
        span{
        font-family:"Bricolage Grotesque";
        } 
          cursor: pointer;
          &:hover{
            .guidebook{
              display: flex;
            }
          }
        .guidebook{
          position: absolute;
          display: none;
          padding: 15px;
          /* color:goldenrod; */
          color: #fff;
          text-transform: capitalize;
          line-height: 1.15;
          top: 67px;
          left: 40%;
          background: #0f0f0f;
          transform: translateX(-50%);
          width: 220px;
          height: 120px;
          border: 1.5px solid #333;
          border-radius: 12px;
          &::before,&::after {
         content: '';
         position: absolute;
         top: -17.5%;
         left: 70%;
         transform: translateX(-50%);
         border: 11px solid transparent;
         border-bottom-color: #333; 
        }
         &::after {
         border-bottom: 11px solid #0f0f0f;
         top: calc(-17.5% + 2.4px); 
        }
      }  
        img{
          transform: translateY(0px);
          width: 20px;
        }
      }
    }
  }
  .circles{
    display: flex;
    flex-direction:column;
    align-items: center;
    padding-top: 67px;
    gap: 16px;
    .circle{
      width: 70px;
      height: 57px;
      border-radius: 50%;
      position: relative;
      border: 1px solid #333333;
      cursor: pointer;
      background-color: #0f0f0f;
      box-shadow: 0px 6px 0px 0px rgba(255,255,255,0.1);
      &:active{
        box-shadow: none;
        transform: translateY(10%);
        border: 1px solid #33333380;
      }
      &:hover{
        .locked{
          display: flex;
        }
      }
      &:active{
        .locked{
          display: none;
        }
      }
      img{
        opacity: 0.2;
      }
      .float{
        position: absolute;
        color: #1cb0f6;
        font-weight: bold;
        width: 128px;
        top: -56px;
        left: 50%;
        padding: 15px;
        background: #0f0f0f;
        transform: translateX(-50%);
        border: 1.5px #333 solid;
        animation: moveUpDown 1.3s infinite alternate;
        @keyframes moveUpDown {
         to {
          top: -43px;
         }
        }
        border-radius: 10px;
        &::before,&::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 10px solid transparent;
        border-top-color: #333; 
       }
       &::after {
        border-top: 10px solid #0f0f0f;
        top: calc(100% - 2.4px); 
       }
      }
      .strt{
        width: 88px;
        font-size: 1rem;
        padding: 13px;
      }
      .locked{
        width: 230px;
        height: 140px;
        z-index: 2;
        animation: none;
        top: 80px;
        background: #0f0f0f;
        display: none;
        border-radius: 14px;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        h3{
          text-align: left;
          margin-top: 0;
          margin-bottom: 10px;
          line-height: 1.5;
          text-transform: capitalize;
          font-size: 1.1rem;
          color: #333333;
        }
        div{
          padding: 14px;
          color: #afafaf80;
          width:100%;
          text-transform: uppercase;
          border-radius: 10px;
          background-color: #33333380;
        }
        &::before,&::after {
        content: '';
        position: absolute;
        top: -16.8%;
        left: 50%;
        transform: translateX(-50%);
        border: 12px solid transparent;
        border-bottom-color: #333; 
       }
       &::after {
        border-bottom: 12px solid #0f0f0f;
        top: calc(-16.8% + 2.4px); 
       }
      }
    }
    .d1,.c1,.solved{
      background-color: #1cb0f6;
      border: 1px solid #1582b3;
      box-shadow: 0px 6px 0px 0px #0e6094;
      img{
      opacity: 0.9;
      }
      &:active{
        border: 1px solid #1582b3;
      }
    }
    .c2{
        right: 8%;
    }
    .c3{
        right: 15%;
    }
    .c4{
        right: 15%;
    }
    .c5{
        right: 8%;
    }
    .d2{
        right: -8%;
    }
    .d3{
        right: -15%;
    }
    .d4{
        right: -15%;
    }
    .d5{
        right: -8%;
    }

  }
  .circlesstarted{
  padding-top:24px;
}
.unit1{
  .rectangle{
    background: linear-gradient(to right, #ff7e5f, #feb47b);
  }
  .circles{
    .float{
      color:#ff7e5f ;
    }
    .d1,.c1,.solved{
      background: linear-gradient(to right, #ff7e5f, #feb47b);
      border: 1px solid #feb47b80;
      box-shadow: 0px 6px 0px 0px #feb47b8c;
      &:active{
        box-shadow: none;
      }
    }
   }
  }
  .unit2{
  .rectangle{
    background: linear-gradient(to right, #2ecc71, #3498db);
  }
  .circles{
    .float{
      color:#2ecc71;
    }
    .d1,.c1,.solved{
      background: linear-gradient(to right, #2ecc71, #3498db);
      border: 1px solid #3498db80;
      box-shadow: 0px 6px 0px 0px #3498db8c;
      &:active{
        box-shadow: none;
      }
    }
   }
  }
  .unit3{
  .rectangle{
    background: linear-gradient(to left, #ffd700, #ff8c00);
  }
  .circles{
    .float{
      color:#ffd700;
    }
    .d1,.c1,.solved{
      background: linear-gradient(to right, #ffd700, #ff8c00);
      border: 1px solid #ff8c0080;
      box-shadow: 0px 6px 0px 0px #ff8c008c;
      &:active{
        box-shadow: none;
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

export default Learn