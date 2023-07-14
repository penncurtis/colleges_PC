import { useState } from 'react';

function Signup({ attemptSignup, universities }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState('');

  const handleChangeUsername = (e) => setUsername(e.target.value);
  const handleChangePassword = (e) => setPassword(e.target.value);
  const handleChangeConfirmPassword = (e) => setConfirmPassword(e.target.value);
  const handleUniversityChange = (e) => setSelectedUniversity(e.target.value);

  function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMatchError(true);
      return;
    }

    attemptSignup({ username, password, universityId: selectedUniversity });
  }

  return (
    <div className="signup-container">
      <div className="signup-box">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            onChange={handleChangeUsername}
            value={username}
            placeholder="username"
            required
          />

          <input
            type="password"
            onChange={handleChangePassword}
            value={password}
            placeholder="password"
            required
          />

          <input
            type="password"
            onChange={handleChangeConfirmPassword}
            value={confirmPassword}
            placeholder="confirm password"
            required
          />

          {passwordMatchError && <p>Passwords do not match!</p>}

          <select value={selectedUniversity} onChange={handleUniversityChange} required>
            <option value="" disabled>
              Select your university
            </option>
            {universities.map((university) => (
              <option key={university.id} value={university.id}>
                {university.university_name}
              </option>
            ))}
          </select>

          <input type="submit" value="Signup" />
        </form>
      </div>
    </div>
  );
}

export default Signup;
