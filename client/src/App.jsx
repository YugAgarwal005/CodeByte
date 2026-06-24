import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Login/Register';
import Login from './pages/Login/Login';
import SetAvatar from './pages/Dashboard/SetAvatar';
import CodeByte from './pages/Dashboard/CodeByte';
const err = "https://d35aaqx5ub95lt.cloudfront.net/images/4af31393cf9dee6fd35c07fc7155d404.svg";
import Learn from './pages/Home/Learn';
import Leaderboard from './pages/Dashboard/Leaderboard';
import Profile from './pages/Dashboard/Profile';
import Quests from './pages/Dashboard/Quests';
import Quiz from './pages/Dashboard/Quiz';
import FriendProfile from './pages/Dashboard/FriendProfile';
import CreateUnit from './pages/Dashboard/CreateUnit';
import CreateQues from './pages/Dashboard/CreateQues';
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