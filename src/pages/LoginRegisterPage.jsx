import { useState } from 'react';

function LoginRegisterPage({
  isLoginPage,
  setIsLoginPage,
  setUser,
  signUpNewUser,
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function handleLoginRegisterToggle() {
    setIsLoginPage(!isLoginPage);
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    console.log('login submit');

    const userInfo = {
      email,
      password,
    };
  }

  function handleRegisterSubmit(e) {
    e.preventDefault();
    console.log('register submit');

    const newUser = {
      email,
      password,
      confirmPassword,
    };
    signUpNewUser(newUser);
  }

  return (
    <div className="loginRegisterContainer">
      <h1 className="loginRegisterTitle">
        {isLoginPage
          ? 'Login to your account'
          : 'Create an account to get started'}
      </h1>
      <div className="loginRegisterContent">
        <button onClick={handleLoginRegisterToggle}>
          {isLoginPage ? 'Register' : 'Login'}
        </button>
        {isLoginPage ? (
          <form onSubmit={handleLoginSubmit}>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Submit</button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="password">Confirm Password</label>
            <input
              type="password"
              id="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="submit">Submit</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginRegisterPage;
