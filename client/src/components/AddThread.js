import { useState } from 'react';
import { useParams } from 'react-router-dom';

function AddThread({ universityId, addThread }) {


  const [newThreadMade, setNewThreadMade] = useState(false);
  const [threadFormData, setThreadFormData] = useState({
    thread_title: ''
  });
  const { schoolname } = useParams();

  const handleSubmit = (event) => {
    event.preventDefault();

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
