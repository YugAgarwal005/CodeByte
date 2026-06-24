import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import SetAvatar from './pages/SetAvatar';
import CodeByte from './pages/CodeByte';
import err from './assets/images/4044.png'
import Learn from './pages/Learn';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Quests from './pages/Quests';
import Shop from './pages/Shop';
import Quiz from './pages/Quiz';
import FriendProfile from './pages/FriendProfile';
import CreateUnit from './pages/CreateUnit';
import CreateQues from './pages/CreateQues';
import { styled } from 'styled-components';
import axios from 'axios';
import { getuserRoute } from './utils/Apiroutes';

function App() {

  const [user, setUser] = useState(null);
  const [userData,setuserData]=useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await JSON.parse(localStorage.getItem('codebyte-user'));
      setUser(userData);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if(user){
        const { data } = await axios.get(`${getuserRoute}/${user._id}`);
        setuserData(data);
        }
    };
    fetchUser();
  }, [user]);

  return (
    <Router>
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/setavatar' element={<SetAvatar />} />
        <Route path='/quiz/unit/:unitnum/level/:levelnum' element={<Quiz />} />
        {
        userData?.isAdmin ? <>
          <Route path='/createunit' element={<CreateUnit />} />
          <Route path='/createques' element={<CreateQues />} />
        </> : null
        }
        <Route path='/*' element={<CodeByte />}>
          <Route index element={<Learn />} />
          <Route path='leaderboards' element={<Leaderboard />} />
          <Route path='quests' element={<Quests />} />
          <Route path='shop' element={<Shop />} />
          <Route path='profile' element={<Profile />} />
          <Route path='profile/u/:id' element={<FriendProfile />} />
          {/* Catch-all route for any other paths */}
          <Route path='*' element={<ErrorPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

const ErrorPage = () => {
  return (
    <Containererror>
      <img src={err} alt="error" className='errorr' />
    </Containererror>
  );
};

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

export default App