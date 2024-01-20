import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../supabase/supabase';
import { Navigate, useNavigate } from 'react-router-dom';

function LoginRegisterPage({
  isLoginPage,
  setIsLoginPage,
  setUser,
  signUpNewUser,
  signInWithEmail,
  showToastMessage,
  setIsLoggingOutandIn,
  setUUID,
}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerPage, setRegisterPage] = useState(true);

  async function signInWithEmail(user) {
    setIsLoggingOutandIn(true);
    if (
      user !== null &&
      user !== undefined &&
      user.email !== '' &&
      user.password !== ''
    ) {
      // const { user: session, error: signInError } =
      //   await supabase.auth.signInWithPassword({
      //     email: user.email,
      //     password: user.password,
      //   });

      const response = await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password,
      });

      const { user: session_user, error: signInError } = response.data;

      if (signInError) {
        console.error('Error signing in:', signInError);
        setIsLoggingOutandIn(false);
        return;
      }

      if (session_user) {
        setUser(session_user);
        setUUID(session_user?.id);
        navigate(`/${session_user.id}/home`, { replace: true });
        showToastMessage('signIn');
      }

      setIsLoggingOutandIn(false);

      if (signInError && signInError.message === 'Invalid login credentials.') {
        showToastMessage('invalidcreditials');
        return;
      } else if (user.email === '') {
        showToastMessage('emailEmpty');
        return;
      } else if (user.password === '') {
        showToastMessage('passwordEmpty');
        return;
      } else if (signInError && signInError.message === 'Email not confirmed') {
        showToastMessage('signUp');
        return;
      }

      if (signInError) {
        showToastMessage();
      }
    }
  }

  function handleLoginRegisterToggle() {
    setRegisterPage(!registerPage);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }

  function handleLoginSubmit(e) {
    e.preventDefault();

    const userInfo = {
      email,
      password,
    };

    signInWithEmail(userInfo);
    setIsLoginPage(false);

    setEmail('');
    setPassword('');
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToastMessage('invalidEmail');
      return;
    }

    const newUser = {
      email,
      password,
      confirmPassword,
    };
    signUpNewUser(newUser);

    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }

  return (
    <div className="loginRegisterContainer">
      <img
        src="./YardManager.png"
        alt="YardManager"
        className="YardManagerLogo"
      />
      <h1 className="loginRegisterTitle">
        {registerPage
          ? 'Login to your account'
          : 'Create an account to get started'}
      </h1>
      <div className="loginRegisterContent">
        {registerPage ? (
          <form onSubmit={handleLoginSubmit} className="loginform">
            <div className="emailcontainer">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="passwordcontainer">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="signInRegisterSubmitButton">
              Submit
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="registerform">
            <div className="emailcontainer">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="passwordcontainer">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="confirmpasswordcontainer">
              <label htmlFor="confirmpassword">Confirm Password</label>
              <input
                type="password"
                id="confirmpassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="signInRegisterSubmitButton">
              Submit
            </button>
          </form>
        )}

        <button
          onClick={handleLoginRegisterToggle}
          className="toggleRegisterLoginButton"
        >
          {registerPage ? 'Register instead?' : 'Login instead?'}
        </button>
      </div>
    </div>
  );
}

export default LoginRegisterPage;
