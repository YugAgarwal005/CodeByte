import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import multiavatar from '@multiavatar/multiavatar';
import { setAvatarRoute } from '../../utils/Apiroutes';
import loader from '../../assets/images/loader.gif';
import { getAssetUrl, getAvatarSrc } from '../../utils/assets';
import { Upload } from 'lucide-react';

function SetAvatar() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [avatars, setAvatars] = useState([]);
  const [isLoading, SetisLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const [customImage, setCustomImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const loadPresetAvatars = () => {
    SetisLoading(true);
    const presets = [];
    for (let i = 0; i < 4; i++) {
      const seed = Math.floor(Math.random() * 10000000).toString();
      let svg = multiavatar(seed);
      if (!svg.includes('xmlns=')) {
        svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      try {
        const bytes = new TextEncoder().encode(svg);
        const binString = Array.from(bytes, (b) => String.fromCharCode(b)).join("");
        presets.push(`data:image/svg+xml;base64,${btoa(binString)}`);
      } catch (e) {
        presets.push(`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`);
      }
    }
    setAvatars(presets);
    SetisLoading(false);
  };

  useEffect(() => {
    if (!localStorage.getItem("codebyte-user")) {
      navigate("/login");
    }
    loadPresetAvatars();
  }, []);

  const handleCustomImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size should be less than 10MB", options);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setCustomImage(reader.result);
      setSelectedAvatar('custom');
    };
  };

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please Select An Avatar Or Upload Your Own Image", options);
      return;
    }

    const imageToSend = selectedAvatar === 'custom' ? customImage : avatars[selectedAvatar];
    if (!imageToSend) {
      toast.error("Please select a valid avatar or image", options);
      return;
    }

    setIsUploading(true);
    try {
      const user = await JSON.parse(localStorage.getItem('codebyte-user'));
      const userId = user._id || user.id;
      const { data } = await axios.post(`${setAvatarRoute}/${userId}`, {
        image: imageToSend
      });

      if (data.isSet) {
        user.IsAvatarImageSet = true;
        user.AvatarImage = data.setimage;
        localStorage.setItem("codebyte-user", JSON.stringify(user));
        toast.success("Profile picture updated!", options);
        navigate("/profile");
      } else {
        toast.error("Error Setting Avatar. Please Try Again", options);
      }
    } catch (err) {
      console.error("Error setting avatar:", err);
      toast.error("Error setting avatar. Please try again.", options);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={getAssetUrl('loader.gif', loader)} alt="loader" className='loader' />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
            <p className="subtitle">Select one of the 4 avatar options or choose your own custom image</p>
          </div>

          <div className="avatar-options">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`avatar ${selectedAvatar === index ? "selected" : ""}`}
                onClick={() => setSelectedAvatar(index)}
              >
                <img src={getAvatarSrc(avatar)} alt={`avatar-${index}`} />
              </div>
            ))}

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleCustomImageSelect}
            />

            <div
              className={`avatar custom-upload-option ${selectedAvatar === 'custom' ? "selected" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              title="Upload your own custom image"
            >
              {customImage ? (
                <img src={customImage} alt="custom avatar" />
              ) : (
                <div className="upload-placeholder">
                  <Upload size={28} color="#f07810" />
                  <span>Upload Own</span>
                </div>
              )}
            </div>
          </div>

          <div className='btns'>
            <button
              type="submit"
              disabled={isUploading}
              onClick={() => setProfilePicture()}
            >
              {isUploading ? "UPLOADING..." : "SET AS PROFILE PICTURE"}
            </button>
            <button
              type="button"
              className="more"
              onClick={() => loadPresetAvatars()}
            >
              REFRESH PRESETS
            </button>
          </div>
        </Container>
      )}
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: safe center;
  align-items: safe center;
  flex-direction: column;
  padding: 2rem 3rem;
  overflow-y: auto;
  gap: 2.5rem;
  min-height: 100vh;
  width: 100vw;
  background: radial-gradient(circle at 24.1% 68.8%, rgb(50, 50, 50) 0%, rgb(0, 0, 0) 99.4%);
  
  .title-container {
    text-align: center;
    h1 {
      color: white;
      font-size: 2.2rem;
    }
    .subtitle {
      color: #aaa;
      font-size: 0.95rem;
      margin-top: 0.5rem;
    }
  }

  .avatar-options {
    display: flex;
    gap: 1.8rem;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;

    .avatar {
      border: 0.35rem solid transparent;
      padding: 0.3rem;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 7.2rem;
      height: 7.2rem;
      box-sizing: border-box;

      &:hover {
        transform: scale(1.06);
      }
      &.selected {
        border-color: #f07810;
        box-shadow: 0 0 15px rgba(240, 120, 16, 0.4);
      }
      img {
        height: 6rem;
        width: 6rem;
        border-radius: 50%;
        object-fit: cover;
      }
    }

    .custom-upload-option {
      background-color: rgba(255, 255, 255, 0.05);
      border: 2px dashed #666;
      border-radius: 50%;

      &.selected {
        border: 0.35rem solid #f07810;
        background-color: rgba(240, 120, 16, 0.1);
      }
      &:hover {
        border-color: #f07810;
      }
      .upload-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.3rem;
        color: white;
        span {
          font-size: 0.8rem;
          font-weight: 600;
          color: #ddd;
        }
      }
    }
  }

  .btns {
    display: flex;
    gap: 1.2rem;
    flex-wrap: wrap;
    justify-content: center;
    button {
      width: fit-content;
      color: white;
      padding: 0.8rem 2rem;
      border-radius: 0.4rem;
      text-transform: uppercase;
      font-size: 0.95rem;
      cursor: pointer;
      border: none;
      font-weight: bold;
      background-color: #eb2632;
      transition: opacity 0.2s ease-in-out;
      &:hover {
        opacity: 0.85;
      }
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
    .more {
      background-color: white;
      color: black;
    }
  }

  @media only screen and (max-width: 500px) {
    padding: 1.5rem;
    .title-container h1 {
      font-size: 1.6rem;
    }
    .avatar-options .avatar {
      width: 5.5rem;
      height: 5.5rem;
      img {
        height: 4.5rem;
        width: 4.5rem;
      }
    }
  }
`;

export default SetAvatar;