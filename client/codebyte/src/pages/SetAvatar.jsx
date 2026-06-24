import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { setAvatarRoute } from '../utils/Apiroutes';
import { Buffer } from 'buffer';
import loader from '../assets/images/loader.gif';

function SetAvatar() {
  const avatarApi = 'https://api.multiavatar.com/';
  const navigate = useNavigate();

  const [avatars, setAvatars] = useState([]);
  const [isLoading, SetisLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

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
    if(!localStorage.getItem("codebyte-user")){
      navigate("/login");
    }
    const data = [];
    const asyncFunction = async () => {
      for (let i = 0; i < 4; i++) {
        const randomNumber = Math.floor(Math.random() * 100000000000);
        const image = await axios.get(avatarApi + randomNumber + `?apikey=${process.env.REACT_APP_API_KEY}`, {
          withCredentials: false,
        }
        );
        const buffer = Buffer.from(image.data).toString("base64");
        data.push(buffer);
      }
      setAvatars(data);
      SetisLoading(false);
    };
    asyncFunction();
  }, [])

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please Select An Avatar", options);
    }
    else{
      const user=await JSON.parse(localStorage.getItem('codebyte-user'));
      const {data}=await axios.post(`${setAvatarRoute}/${user._id}`,{
        image:avatars[selectedAvatar]
      })
      let profileRoute=false;
      if(user.IsAvatarImageSet)
      {profileRoute=true}
      if(data.isSet){
        user.IsAvatarImageSet=true;
        user.AvatarImage=data.setimage;
        localStorage.setItem("codebyte-user",JSON.stringify(user));
        if(profileRoute){
          profileRoute=false;
          navigate("/profile")
        }
        else{
        navigate("/");
        }
      }
      else{
        toast.error("Error Setting Avatar. Please Try Again",options);
      }
    }
  }

  return (
    <>
      {isLoading ? 
      
       <Container>
         <img src={loader} alt="loader" className='loader' />
       </Container> :

        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {
              avatars.map((avatar, index) =>
                <div key={index} className={`avatar ${selectedAvatar === index ? "selected" : ""}`}>
                  <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar"
                    onClick={() => setSelectedAvatar(index)} />
                </div> 
              )
            }
          </div>
          <div className='btns'>
            <button type="submit" className='more' onClick={()=>window.location.reload(false)}>VIEW MORE</button>
            <button type="submit" onClick={() => setProfilePicture()}>SET AS PROFILE PICTURE</button>
          </div>
        </Container>
      }
      <ToastContainer />
    </>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: safe center ;
  align-items: safe center ;
  flex-direction:column;
  padding:2rem 3rem;
  overflow-y:scroll;
  gap:3rem;
  height:100vh;
  width: 100vw;
  background: radial-gradient(circle at 24.1% 68.8%, rgb(50, 50, 50) 0%, rgb(0, 0, 0) 99.4%);
  .title-container{
    h1{
      color: white;
      font-size:2.3rem;
      text-align:center;
    }
  }
  .avatars{
    display: flex;
    gap:2.5rem;
    align-items:center;
    flex-wrap:wrap;
    justify-content:center;
    padding-bottom:20px;
    .avatar{
      border:0.4rem solid transparent;
      padding:0.4rem;
      border-radius: 5rem;
    }
    img{
      height:8rem; 
    }
    .selected{
      border:0.4rem solid #f07810;
    }
  }
  .btns{
    display:flex;
    gap:1.2rem;
    flex-wrap:wrap;
    justify-content:safe center;
    text-align:safe center;
    button{
     width:fit-content;
     color:white;
     padding: 0.8rem 2rem;
     border-radius:0.4rem;
     text-transform:uppercase;
     font-size:1rem;
     cursor: pointer;
     border: none;
     font-weight:bold;
     background-color:#eb2632;
     transition:0s ease-in-out;
     &:hover{
      opacity: 0.8;
     }
   }
   .more{
    background-color:white;
    color:black;
    &:hover{
      opacity: 0.8;
     }
   }
 }
  @media only screen and (max-width: 500px) {
    .loader{
      width:100%;
    }
   .title-container{
    h1{
      font-size:1.7rem;
    }
  }
  .btns{
    button{
     font-size:0.9rem;
   } 
  }
  .avatars{
      padding-bottom:0px;
    }
}
  @media only screen and (max-width: 360px) {
    .title-container{
    h1{
      font-size:1.5rem;
    }
  }
}
`;

export default SetAvatar;