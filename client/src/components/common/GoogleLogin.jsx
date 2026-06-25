import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { googleRoute } from '../../utils/Apiroutes';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';

function GoogleLogin(props) {
  const navigate = useNavigate();
  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          }
        );
        const { name, picture, email } = res.data;
        // Standard, browser-safe base64 encoding of the profile picture URL
        const buffer = btoa(unescape(encodeURIComponent(picture)));

        const username = _.toLower(_.replace(name, / /g, ''));
        const { data } = await axios.post(googleRoute, {
          username,
          buffer,
          email
        });
        if (data.status === false) {
          props.toast.error(data.msg, props.options);
        }
        if (data.status === true) {
          localStorage.setItem('codebyte-user', JSON.stringify(data.user));
          navigate("/");
        }

      } catch (err) {
        console.log(err);
        props.toast.error("Failed to fetch user details from Google. Please try again.", props.options);
      }
    },
    onError: (error) => {
      console.log("Google login failed", error);
      props.toast.error("Google authentication failed. Please check your credentials.", props.options);
    }
  });

  const handleClick = (e) => {
    if (e) {
      e.stopPropagation();
    }
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const isDummy = !googleClientId || googleClientId === "dummy-google-client-id" || googleClientId.trim() === "";
    if (isDummy) {
      props.toast.warning("Google Login is not configured. Please set your VITE_GOOGLE_CLIENT_ID environment variable in the Secrets panel to enable Google Login.", {
        ...props.options,
        autoClose: 8000
      });
      return;
    }
    login();
  };

  return (
    <div ref={props.reference} onClick={handleClick}>
      Sign {props.txt} with Google
    </div>
  )
}

export default GoogleLogin