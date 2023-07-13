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
        // Update the vote counts in the data itself
        const updatedThreads = data.map(thread => ({
          ...thread,
          initial_vote_count: thread.thread_vote_count // Store the initial vote count separately
        }));
        setThreads(updatedThreads);
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
      body: JSON.stringify({ thread_vote_count: voteValue })
    })
      .then(response => {
        if (response.ok) {
          // Update the vote count in the state
          setThreads(prevThreads =>
            prevThreads.map(thread =>
              thread.id === threadId
                ? { ...thread, thread_vote_count: thread.thread_vote_count + voteValue }
                : thread
            )
          );
        } else {
          console.log('Failed to update thread');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div className="schoolname-container">
      <div className="threads-container" style={{ backgroundColor: universityColor }}>
        <h1>Threads for {schoolname}</h1>
        <ul>
          {threads.map(thread => (
            <li key={thread.id} className={`thread university-color ${schoolname}`}>
              <div className="votes">
                <button onClick={() => handleVote(thread.id, 'up')}>&#8593;</button>
                <span>{thread.thread_vote_count}</span>
                <button onClick={() => handleVote(thread.id, 'down')}>&#8595;</button>
              </div>
              <Link to={`/${schoolname}/threads/${thread.id}/posts`}>
                /{thread.thread_title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Threads;