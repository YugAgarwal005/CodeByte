import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { fbRoute } from '../utils/Apiroutes';
import axios from 'axios';
import _ from 'lodash';
import { Buffer } from 'buffer';


function FacebookSignIn(props) {
  const responseFacebook = async (response) => {
    try {
      const { name, email } = response;
      const picture = response.picture.data.url;

      const buffer = Buffer.from(picture).toString("base64");
      const username = _.toLower(_.replace(name, / /g, ''));

      const { data } = await axios.post(fbRoute, {
        username,
        buffer,
        email
      });

      if (data.status === false) {
        props.toast.error(data.msg, props.options);
      }
      if (data.status === true) {
        localStorage.setItem('codebyte-user', JSON.stringify(data.user));
        props.navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <FacebookLogin
      appId={process.env.REACT_APP_FB_APP_ID}
      autoLoad={false}
      fields="name,email,picture"
      callback={responseFacebook}
      render={renderProps => (
        <div ref={props.reference} onClick={renderProps.onClick}>Sign {props.txt} with Facebook</div>
      )}
    />
  )
}

export default FacebookSignIn