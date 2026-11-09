import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import '../../assets/css/bootstrap-social.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { registerRoute } from '../../utils/Apiroutes';
import GoogleLogin from '../../components/common/GoogleLogin';
import validator from "validator";

function Register() {
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

  const childref = useRef();

  useEffect(() => {
    if (localStorage.getItem('codebyte-user')) {
      navigate('/');
    }
  }, []);

  const [values, setValues] = useState({
    username: "",
    password: "",
    cnfpassword: "",
    email: ""
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleValidation = () => {
    const { password, username, cnfpassword, email } = values;
    if (password === "" || username === "") {
      toast.error("Username and Password are required fields", options);
      return false;
    }
    else if (password !== cnfpassword) {
      toast.error("Password And confirmed password doesn't match", options);
      return false;
    }
    else if (username.length <= 3) {
      toast.error("Username should be greater than 3 characters", options);
      return false;
    }
    else if (password.length <= 3) {
      toast.error("Password should be greater than 3 characters", options);
      return false;
    }
    else if (!validator.isEmail(email) || email === "") {
      toast.error("Please enter a valid Email address", options);
      return false;
    }
    return true;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLoading) return;
    if (handleValidation()) {
      setIsLoading(true);
      try {
        const { password, username, email } = values;
        const { data } = await axios.post(registerRoute, {
          username: username.trim(),
          password,
          email: email.trim(),
          rememberMe
        });
        if (data.status === false) {
          toast.error(data.msg, options);
        } else if (data.status === true) {
          localStorage.setItem('codebyte-user', JSON.stringify(data.user));
          navigate("/");
        }
      } catch (err) {
        console.error("Registration error:", err);
        const errMsg = err.response?.data?.message || err.response?.data?.msg || "Registration failed. Please check your network or try again.";
        toast.error(errMsg, options);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (event) => {
    setValues(
      { ...values, [event.target.name]: event.target.value }
    )
  }

  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)} noValidate>
          <h1>Code-Byte</h1>
          <input type="text" placeholder='Username' name="username" onChange={handleChange} autoComplete='off' />
          <input type="email" name="email" id="email" placeholder='Email' onChange={handleChange} autoComplete='off' spellCheck='false'/>
          <input type="password" name="password" id="pass" placeholder='Password' onChange={handleChange} />
          <input type="password" name="cnfpassword" id="cnfpass" placeholder='Confirm Password' onChange={handleChange} />
          
          <div className="remember-container">
            <label className="remember-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Keep me logged in for 1 month</span>
            </label>
          </div>

          <button type="submit" disabled={isLoading}>{isLoading ? "Creating account..." : "Sign Up"}</button>
          <span>Already Have An Account ? <Link to='/login'>Login</Link></span>
          <div className='line'></div>
          <a className="btn btn-block btn-social btn-lg btn-google" onClick={()=>{childref.current.click()}}>
            <span className="fab fa-google"></span><GoogleLogin reference={childref} txt='Up' toast={toast} options={options}/>
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
  gap:1.2rem;
  max-width: 450px;
  width: 90%;
  box-sizing: border-box;
  @media (max-width: 480px) {
    padding: 1.5rem 1.2rem;
    width: 95%;
  }

  h1{
    color:white;
    text-transform:uppercase;
    font-size:bold;
    margin-bottom:10px;
    font-family:"Bricolage Grotesque"
  }
  input[type="text"], input[type="password"], input[type="email"]{
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

  .remember-container {
    width: 100%;
    display: flex;
    align-items: center;

    .remember-label {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #ccc;
      font-size: 0.85rem;
      cursor: pointer;
      user-select: none;

      input[type="checkbox"] {
        accent-color: #eb2632;
        width: 16px;
        height: 16px;
        cursor: pointer;
      }

      span {
        color: #ddd;
        text-transform: none;
        font-weight: normal;
      }
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

export default Register;
