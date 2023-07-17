import { useState, useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';

function AddThread({ universityId, addThread }) {


  const [newThreadMade, setNewThreadMade] = useState(false);
  const [threadFormData, setThreadFormData] = useState({
    thread_title: ''
  });
  const { schoolname } = useParams();
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    fetch(`/current_session`)
      .then(response => response.json())
      .then(data => {
        setLoggedInUser(data);
        if (!data) {
          setRedirectToLogin(true);
        }
      })
      .catch(error => console.log(error));
    }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!loggedInUser) {
        setRedirectToLogin(true);
        return;
    }

    const newThread = {
      ...threadFormData,
      thread_university_id: universityId,
    };

    addThread(newThread, schoolname);
    setNewThreadMade(true)
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setThreadFormData({ ...threadFormData, [name]: value });
  };

  if (redirectToLogin) {
    return <Redirect to="/login" />;
  }

  return (
    <div className='add-thread-container'>
      <h2>Add Thread</h2>
      {newThreadMade ? (
        <h1>thanks for adding a new thread!</h1>
        ) : (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="thread_title"
          value={threadFormData.thread_title}
          onChange={handleInputChange}
          placeholder="Thread Headline"
          required
        />
        <button type="submit">Add</button>
      </form>
      )}
    </div>
  );
}

export default AddThread;
