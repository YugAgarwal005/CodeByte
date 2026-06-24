import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import '../assets/css/bootstrap-social.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { loginRoute } from '../utils/Apiroutes';
import GoogleLogin from '../components/GoogleLogin';
import { useRef } from 'react';
import FacebookSignIn from '../components/FacebookSignIn';

function Login() {
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
    if (localStorage.getItem('codebyte-user')) {
      navigate('/');
    }
  }, []);

  const childref=useRef();
  const childrefFb=useRef();

  const [values, setValues] = useState({
    username: "",
    password: "",
  })

  const handleValidation = () => {
    const { password, username } = values;
    if (password === "" || username === "") {
      toast.error("Username or Email and Password are required fields", options);
      return false;
    }
    return true;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { password, username } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password
      });
      if (data.status === false) {
        toast.error(data.msg, options);
      }
      if (data.status === true) {
        localStorage.setItem('codebyte-user', JSON.stringify(data.user));
        navigate("/");
      }
    };
  }

  const handleChange = (event) => {
    setValues(
      { ...values, [event.target.name]: event.target.value }
    )
  }

  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <h1>Code-Byte</h1>
          <input type="text" placeholder='Username or Email' name="username" onChange={handleChange} autoComplete='off' min='3' />
          <input type="password" name="password" id="pass" placeholder='Password' onChange={handleChange} />
          <button type="submit">Login</button>
          <span>Don't Have An Account ? <Link to='/register'>Register</Link></span>
          <div className='line'></div>
          <a className="btn btn-block btn-social btn-lg btn-google" onClick={()=>{childref.current.click()}}>
            <span className="fa fa-google"></span><GoogleLogin reference={childref} txt='In' toast={toast} options={options}/>
          </a>
          <a className="btn btn-block btn-social btn-lg btn-facebook" onClick={()=>{childrefFb.current.click()}}>
            <span className="fa fa-facebook"></span> <FacebookSignIn reference={childrefFb} txt='In' toast={toast} options={options} navigate={navigate}/>
          </a>
        </form>
      </FormContainer>
      <ToastContainer />
    </>

  )
}

const FormContainer = styled.div`

display:flex;
width:100vw;
height:100vh;
justify-content:center;
align-items:center;
background: radial-gradient(circle at 24.1% 68.8%, rgb(50, 50, 50) 0%, rgb(0, 0, 0) 99.4%);


form{
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  padding:2rem 3rem;
  gap:1.5rem;
  h1{
    color:white;
    text-transform:uppercase;
    font-size:bold;
    margin-bottom:10px;
    font-family:"Bricolage Grotesque"
  }
  input{
    background-color:transparent;
    padding:0.8rem; 
    border:0.1rem solid #f57b51;
    border-radius:0.4rem;
    color:white;
    font-size:1rem;
    width:100%;
    &:focus{
      outline:none;
    }
  }
  button{
    width:100%;
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
  span{
    color:white;
    text-transform:uppercase;
    font-weight:bold;
    line-height:1.3;
    a
    {
      text-decoration:none;
      color:#eb2632;
    }
  }
  .line
  {
    position: relative;
    height: 1px;
    width: 100%;
    margin: 5px 0;
    background-color: #d4d4d4;
     &::before{
        content: 'OR';
        position: absolute;
        top: 50%;
        left: 50%;
        font-weight:bold;
        transform: translate(-50%, -50%);
        color: white;
        padding: 0 15px;
        z-index:1;
    }
 }
 .btn{
  padding: 0.8rem 2rem;
  font-weight:bold;
  border-radius:0.4rem;
  width:100%;
  display:flex;
  cursor: pointer;
  justify-content:center;
 }
 @media only screen and (max-width: 500px) {
  .btn{
    .fa{
      border:none;
    }
  }
}
}
`;

export default Login;