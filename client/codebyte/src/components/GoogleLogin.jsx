import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { googleRoute } from '../utils/Apiroutes';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import { Buffer } from 'buffer';

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
        const buffer = Buffer.from(picture).toString("base64");

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
      }
    },
  });
  return (
    <div ref={props.reference} onClick={() => login()}>
      Sign {props.txt} with Google
    </div>
  )
}

export default GoogleLogin