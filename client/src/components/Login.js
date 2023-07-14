import { useState } from 'react';
import { Redirect } from 'react-router-dom';

function Login({ attemptLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirectToSignup, setRedirectToSignup] = useState(false);

  const handleChangeUsername = (e) => setUsername(e.target.value);
  const handleChangePassword = (e) => setPassword(e.target.value);

  function handleSubmit(e) {
    e.preventDefault();
    attemptLogin({ username, password });
  }

  if (redirectToSignup) {
    return <Redirect to="/signup" />;
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            onChange={handleChangeUsername}
            value={username}
            placeholder="username"
          />

          <input
            type="password"
            onChange={handleChangePassword}
            value={password}
            placeholder="password"
          />

          <input type="submit" value="Login" />
        </form>

        <button onClick={() => setRedirectToSignup(true)}>
          Don't have an account? Signup here
        </button>
      </div>
    </div>
  );
}

export default Login;