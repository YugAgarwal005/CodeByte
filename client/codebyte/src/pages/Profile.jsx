import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import follow from '../assets/images/follow.png'
import clock from '../assets/images/clock.png'
import upload from '../assets/images/upload.png'
import fire from '../assets/images/icons8-firee.png'
import firee from '../assets/images/fireee.png'
import medal from '../assets/images/medal.png'
import right from '../assets/images/right.png'
import xp from '../assets/images/xp.png'
import followuser from '../assets/images/followuser.png'
import xpe from '../assets/images/xpe.png'
import league from '../assets/images/league.png'
import flow from '../assets/images/flow.png'
import target from '../assets/images/target.png'
import { useNavigate } from 'react-router-dom'
import error from '../assets/images/404.png'
import Rightnavbar from '../components/Rightnavbar'
import { allUsersRoute, matchingUsersRoute, followRoute, getuserRoute } from '../utils/Apiroutes'
import axios from 'axios';
import About from '../components/About'
import { ToastContainer,toast } from 'react-toastify'

function Profile() {
  const [searchQuery, setSearchQuery] = useState('');
  const [forceRerender, setForceRerender] = useState(false);
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [chats2, setChats2] = useState([]);
  const [selectedTab, setSelectedTab] = useState('following');
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();
  const options = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await JSON.parse(localStorage.getItem('codebyte-user'));
      setUser(userData);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    (async () => {
      if(user){
      const { data } = await axios.get(`${getuserRoute}/${user._id}`);
      setUserData(data);
      }
    })()
  }, [user, forceRerender]);

  useEffect(() => {
    (async () => {
      if (user) {
        if (!user.IsAvatarImageSet) {
          navigate("/setavatar");
        }
        else {
          const { data } = await axios.get(`${allUsersRoute}/${user._id}`, {
            params: { selectedTab }
          });
          setChats(data);
        }
      };
    })();
  }, [user, selectedTab, forceRerender]);

  useEffect(() => {
    (async () => {
      if (user) {
        if (!user.IsAvatarImageSet) {
          navigate("/setavatar");
        }
        else {
          const { data } = await axios.get(`${matchingUsersRoute}/${user._id}`, {
            params: { searchQuery }
          });
          setChats2(data);
        }
      };
    })();
  }, [searchQuery, user, forceRerender]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  }

  const handleFollowChange = (tab) => {
    setSelectedTab(tab);
  };

  const handleFollowRequest = async (id) => {
    const { data } = await axios.post(`${followRoute}/${user._id}`, {
      id
    });
    toast.success(data.msg, options);
    setForceRerender(prev => !prev);
  }

  return (
    <>
    <Container>
      <div className='left'>
        {user ?
          <div className="profilebox">
            <div>
              <h3 className='username'>{user.username}</h3>
              <h5>{user.email}</h5>
              <h4><img src={clock} />Joined November 2023</h4>
              <h4><img src={follow} />{userData ? userData.following.length : 0} Following / {userData ? userData.followers.length : 0} Followers</h4>
              <h1></h1>
              <br />
            </div>
            <div className="avatar">
              <img src={`data:image/svg+xml;base64,${user.AvatarImage}`} alt="avatar" />
              <img src={upload} onClick={() => navigate("/setavatar")} />
            </div>
          </div>
          : <div></div>}
        <div className="statistics">
          <h3>Statistics</h3>
          <div>
            <div className="boxes">
              <img src={fire} alt="" />
              <div>
                <h3>{userData ? userData.userData.streak.days : 0}</h3>
                <h3 className='second'>Day Streak</h3>
              </div>
            </div>
            <div className="boxes">
              <img src={xp} alt="" />
              <div>
                <h3>{userData ? userData.userData.xp : 0}</h3>
                <h3 className='second'>Total XP</h3>
              </div>
            </div>
            <div className="boxes">
           <img src="https://d35aaqx5ub95lt.cloudfront.net/images/leagues/74d6ab6e5b6f92e7d16a4a6664d1fafd.svg" alt="" /> 
              <div>
                <h3>Ruby</h3>
                <h3 className='second'>Current League</h3>
              </div>
            </div>
            <div className="boxes">
              <img src={medal} alt="" />
              <div>
                <h3>{userData?.rank <=3 ? userData?.rank : 0}</h3>
                <h3 className='second'>Top 3 Finishes</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="achievements">
          <h3>Achievements</h3>
          <div className='main'>
            <div className="box">
              <img src={firee} alt="" />
              <div>
                <h3><span>Wildfire </span> <span>{userData ? ((userData.userData.streak.days) <=7 ? (userData.userData.streak.days) :7) : 0}/7</span></h3>
                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${
                      userData ? ((userData.userData.streak.days)*100/7 <=100 ? (userData.userData.streak.days)*100/7 :100) : 0}%` }}
                  ></div>
                </div>
                <h3 className='second'>Reach a 7 day streak</h3>
              </div>
            </div>
            <div className="box">
              <img src={xpe} alt="" />
              <div>
                <h3><span>Sage </span> <span>{userData ? ((userData.userData.xp) <=750 ? (userData.userData.xp) :750) : 0}/750</span></h3>
                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${userData ? ((userData.userData.xp)*100/750 <=100 ? (userData.userData.xp)*100/750 :100) : 0}%` }}
                  ></div>
                </div>
                <h3 className='second'>Earn 750 XP</h3>
              </div>
            </div>
            <div className="box last">
              <img src={target} alt="" />
              <div>
                <h3><span>Scholar </span> <span>{userData ? ((userData.userData.correctQues) <=50 ? (userData.userData.correctQues) :50) : 0}/50</span></h3>
                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${userData ? ((userData.userData.correctQues)*100/50 <=100 ? (userData.userData.correctQues)*100/50 :100) : 0}%` }}
                  ></div>
                </div>
                <h3 className='second'>Answer 50 questions with precision</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='right'>
        <Rightnavbar />
        <div className="followers">
          <div className="header">
            <span onClick={() => handleFollowChange('following')} className={selectedTab === 'following' ? 'selected' : ''} >FOLLOWING</span>
            <span onClick={() => handleFollowChange('followers')} className={selectedTab === 'followers' ? 'selected' : ''}>FOLLOWERS</span>
          </div>
          <div className='scroll'>
            {
              chats.map((chat, index) => {
                return (
                  <div className='friend' key={index} onClick={()=>{navigate(`/profile/u/${chat._id}`)}}><img src={`data:image/svg+xml;base64,${chat.AvatarImage}`} alt="avatar" /><div><h3>{chat.username}</h3><span>{chat.userData.xp} XP</span></div></div>
                )
              })}
            <div className="boxx">
              <img src="https://d35aaqx5ub95lt.cloudfront.net/images/profile/a925a18c6be921a81bf0e13102983168.svg" alt="" />
            </div>  
            <div className='txt'>Take the first step! Learning together is fun and effective </div>
          </div>

        </div>
        <div className="addfriends">
          <div className="header">Add friends</div>
          <div className="find"><img src="https://d35aaqx5ub95lt.cloudfront.net/images/profile/48b8884ac9d7513e65f3a2b54984c5c4.svg" alt="" /><span>Find Friends</span></div>
          <div className='input'><input type="text" name="username" placeholder='Enter Username' autoComplete='off' spellCheck='false' value={searchQuery} onChange={handleSearch} /></div>
          {chats2.length !== 0 ?
            <div className='scroll'>
              {
                chats2.map((chat, index) => {
                  return (
                    <div className='friend' key={index} onClick={()=>{navigate(`/profile/u/${chat._id}`)}}><img src={`data:image/svg+xml;base64,${chat.AvatarImage}`} alt="avatar" /><div><h3>{chat.username}</h3><span>{chat.userData.xp} XP</span></div><img src={(chat.isFollowing) ? right : followuser}
                      className={(chat.isFollowing) ? "end rightt" : "end"}
                      onClick={(event) => {
                        if (!chat.isFollowing){
                          event.stopPropagation();
                          handleFollowRequest(chat._id)
                        }
                      }} /></div>
                  )
                })}
            </div>
            : <div className='error'>
              <img src={error} alt="" />
              <span>Sorry ! we didn’t find any matching learners. Try searching again.</span>
            </div>}
        </div>
        <About />
      </div>
    </Container>
    <ToastContainer />
    </>
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
.profilebox{
  display: flex;
  div{
    flex: 1;
  .username{
    line-height:0;
    font-size:1.3rem;
    color:#fff;
    font-family:"Bricolage Grotesque";
  }
  h4{
    font-weight: normal;
    opacity: 80%;
    color: #ffffff;
    font-size: 1.05rem;
    margin:10px 0;
    img{
      margin-right:10px;
      transform: translateY(3px);
    }
  }
  h5{
    font-size: 0.85rem;
  }
}   
  .avatar{
    max-width: 140px;
    position: relative;
    flex: 0 0 auto;
    img:nth-child(1){
      width: 128px;
      border:1px solid #fff;
      border-radius: 50%;
    }
    img:nth-child(2){
      width: 28px;
      position:absolute;
      right:9px;
      top:7px;
      border:2px solid #fff;
      border-radius: 50%;
      cursor: pointer;
    }
  }
} 
.statistics{
  h3{
    font-size:1.3rem;
    color:#fff;
    font-weight:500;
    font-family:"Bricolage Grotesque";
  }
  div{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    .boxes{
      display: flex;
      align-items: center;
      border:1.5px solid #333;
      border-radius:16px;
      gap:16px;
      padding: 15px 25px;
      img{
        width:24px;
        height:24px;
        transform:translateY(-45%);
      }
      div{
        display: flex;
        flex-direction:column;
        h3{
          margin:0;
          font-size: 1rem;
        }
        .second{
          opacity: 30%;
          font-weight: 400;
        }
      }
    }
  }
}
.achievements{
  margin-bottom: 30px;
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
  .profilebox{
    border-bottom: 1.5px solid #333;
  }
}
.right{
  display: flex;
  padding-left:15px;
  flex-direction: column;
  align-items: center;
  gap:20px;
  .followers{
    border:1.5px solid #333;
    width: 368px;
    height: 400px;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    padding-bottom: 6px;
    .scroll{
     overflow-y: scroll;
     &::-webkit-scrollbar{
      width: 5px;
      background-color: #0f0f0f;
     }
     &::-webkit-scrollbar-thumb {
      background: #333333CC;
      border-radius: 12px;
      opacity: 0.5;
     }
     &::-webkit-scrollbar-track {
      background: #3333334D;
      border-radius: 12px;
     }
     &::-webkit-scrollbar-button {
     display: none;
  }
    .boxx{
      display: flex;
      padding: 15px 0;
      justify-content:center;
      img{
        width: 270px;
      }
    }
    .txt{
      text-align: center;
      padding: 10px 30px 20px;
      color: #1cb0f6;
    }
  }
    .friend{
      display: flex;
      padding: 20px;
      &:hover{
        background-color:hsla(0, 0%, 100%, 0.02);
        cursor: pointer;
        /* transition: 0.5s ease-out; */
      }
      gap: 15px;
      img{
        width: 48px;
      }
      div{
        display: flex;
        flex-direction: column;
        gap: 5px;
         h3{
          margin: 4px auto;
          font-weight: 600;
          color: #fff;
         }
         span{
          font-size: 0.9rem;
          transform: translateX(2px);
          color: #ffffff4D;
          z-index: -1;
         }
      }
    }
    .header{
      display: flex;
      padding-bottom: 5px;
      border-width: 50%;
      .selected{
       color: #1cb0f6;
       border-bottom:1px solid #1cb0f6;
      }
      span{
        color: #ffffff80;
        padding-top: 20px;
        padding-bottom: 15px;
        width: 50%;
        font-size:0.95rem;
        text-align: center;
        cursor: pointer;
        border-bottom:1px solid #333;
        &:hover{
          color: #1cb0f6;
          border-bottom:1px solid #1cb0f6;
        }
      }
    }
  }
  .addfriends{
    border:1.5px solid #333;
    border-radius: 16px;
    width: 368px;
    height: 340px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding-bottom: 6px;
    .error{
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      color: goldenrod;
      line-height: 1.3;
      opacity: 0.95;
      padding: 0 20px;
      img{
        width: 130px;
      }
    }
    .scroll{
     overflow-y: scroll;
     &::-webkit-scrollbar{
      width: 5px;
      background-color: #0f0f0f;
     }
     &::-webkit-scrollbar-thumb {
      background: #333333CC;
      border-radius: 12px;
      opacity: 0.5;
     }
     &::-webkit-scrollbar-track {
      background: #3333334D;
      border-radius: 12px;
     }
     &::-webkit-scrollbar-button {
     display: none;
  }
    }
    .friend{
      display: flex;
      padding: 20px;
      gap: 15px;
      &:hover{
        background-color:hsla(0, 0%, 100%, 0.02);
        cursor: pointer;
        /* transition: 0.5s ease-out; */
      }
      img{
        width: 48px;
      }
      .end{
        margin-left: auto;
        align-self: center;
        margin-right: 40px;
        cursor: pointer;
        width: 25px;
        height: 25px;
        &:hover{
          opacity: 0.7;
        }
      }
      .rightt{
        pointer-events: none;
      }
      div{
        display: flex;
        flex-direction: column;
        gap: 5px;
         h3{
          margin: 4px auto;
          font-weight: 600;
          color: #fff;
         }
         span{
          font-size: 0.9rem;
          transform: translateX(2px);
          color: #ffffff4D;
          z-index: -1;
         }
      }
    }
    .header{
      font-size: 1.2rem;
      color: #fff;
      padding: 23px;
      padding-top:26px;
      padding-bottom: 0;
    }
    .find{
      padding-top: 10px;
      padding-left: 15px;
      z-index: -1;
      img{
      width: 52px;
      }
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.2rem;
      color: #fff;
      opacity: 0.95;
    }

    .input{
      padding-bottom:5px;
      border-bottom: 1.5px solid #333;
    }

    div{
      input{
        margin-left: 73px;
        color: #1cb0f6;
        background-color:transparent;
        width: 190px;
        border: none;
        transform: translateY(-10px);
        font-size: 1rem;
        padding:5px;
        &::placeholder{
          opacity: 0.9;
          color: #1cb0f6;
        }
        border-bottom: 1px solid #ffffff80;
        &:focus{
          outline: none;
        }
      }
    }
  }
}
`

export default Profile