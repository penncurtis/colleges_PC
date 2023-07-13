import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function Threads({ universities }) {
  const { schoolname } = useParams();
  const [threads, setThreads] = useState([]);
  const universityColor = universities.find(uni => uni.university_name === schoolname)?.university_color;

  useEffect(() => {
    fetch(`/${schoolname}/threads?sort=vote_count`)
      .then(response => response.json())
      .then(data => {
        setThreads(data);
      })
      .catch(error => console.log(error));
  }, [schoolname]);

  const handleVote = (threadId, voteType) => {
    const voteValue = voteType === 'up' ? 1 : -1;
  
    fetch(`/${schoolname}/threads/${threadId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ thread_vote_count: voteValue }),
    })
      .then(response => response.json())
      .then(updatedThread => {
        const updatedThreads = threads.map(thread =>
            thread.id === updatedThread.id
              ? { ...thread, thread_vote_count: thread.thread_vote_count + parseInt(voteValue) } : thread
        );
        setThreads(updatedThreads);
      })
      .catch(error => console.log(error));
  };

  return (
    <div className="schoolname-container">
      <div className="threads-container" style={{ backgroundColor: universityColor }}>
        <h1>Threads for {schoolname}</h1>
        <ul>
          {threads.map(thread => (
            <li key={thread.id} className={`thread university-color ${schoolname}`}>
              <Link to={`/${schoolname}/threads/${thread.id}/posts`}>
                /{thread.thread_title}
              </Link>
              <div className='votes'>
                <span>{thread.thread_vote_count}</span>
                <button onClick={() => handleVote(thread.id, 'up')}>&#x1F44D;</button>
                <button onClick={() => handleVote(thread.id, 'down')}>&#x1F44E;</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Threads;

