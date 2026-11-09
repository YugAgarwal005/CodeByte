import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Login/Register';
import Login from './pages/Login/Login';
import SetAvatar from './pages/Dashboard/SetAvatar';
import CodeByte from './pages/Dashboard/CodeByte';
import err from './assets/images/4044.png'
import Learn from './pages/Home/Learn';
import { getAssetUrl } from './utils/assets';
import Leaderboard from './pages/Dashboard/Leaderboard';
import Profile from './pages/Dashboard/Profile';
import Quests from './pages/Dashboard/Quests';
import Quiz from './pages/Dashboard/Quiz';
import FriendProfile from './pages/Dashboard/FriendProfile';
import CreateUnit from './pages/Dashboard/CreateUnit';
import CreateQues from './pages/Dashboard/CreateQues';
import ProblemPage from './pages/Judge/ProblemPage';

import { styled } from 'styled-components';
import axios from 'axios';
import { getuserRoute } from './utils/Apiroutes';
import { setupAxiosInterceptors, startTokenRefreshTimer, refreshAuthToken, getStoredUser } from './utils/tokenManager';

// Setup global axios interceptors for Bearer token & auto retry on 401
setupAxiosInterceptors();

function App() {

  const [user, setUser] = useState(null);
  const [userData, setuserData] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const stored = getStoredUser();
      if (stored) {
        if (stored.refreshToken) {
          const newAccessToken = await refreshAuthToken();
          if (newAccessToken) {
            setUser(getStoredUser());
            startTokenRefreshTimer();
          } else {
            setUser(null);
          }
        } else {
          setUser(stored);
          startTokenRefreshTimer();
        }
      }
    };
    initAuth();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (user && user._id) {
        try {
          const { data } = await axios.get(`${getuserRoute}/${user._id}`);
          setuserData(data);
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
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
        {/* ProblemPage is full-screen (no sidebar) — same pattern as Quiz */}
        <Route path='/problems/:slug' element={<ProblemPage />} />
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
          {/* Problem list page — inside CodeByte layout so sidebar is visible */}
          <Route path='problems' element={<Navigate to='/' replace />} />
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
      <img src={getAssetUrl('4044.png', err)} alt="error" className='errorr' />
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
