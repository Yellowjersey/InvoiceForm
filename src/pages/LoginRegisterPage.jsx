import { useState } from 'react';

function LoginRegisterPage({
  isLoginPage,
  setIsLoginPage,
  setUser,
  signUpNewUser,
  signInWithEmail,
  showToastMessage,
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function handleLoginRegisterToggle() {
    setIsLoginPage(!isLoginPage);
  }

  function handleLoginSubmit(e) {
    e.preventDefault();

    const userInfo = {
      email,
      password,
    };

    signInWithEmail(userInfo);
    setEmail('');
    setPassword('');
  }

  function handleRegisterSubmit(e) {
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
        {isLoginPage
          ? 'Login to your account'
          : 'Create an account to get started'}
      </h1>
      <div className="loginRegisterContent">
        {isLoginPage ? (
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
          {isLoginPage ? 'Register instead?' : 'Login instead?'}
        </button>
      </div>
    </div>
  );
}

export default LoginRegisterPage;
