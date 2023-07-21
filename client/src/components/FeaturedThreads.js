import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function FeaturedThreads({ universities }) {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    fetch(`/threads?sort=-thread_vote_count&limit=5`)
      .then(response => response.json())
      .then(data => {
        setThreads(data);
      })
      .catch(error => console.log(error));
  }, []);

  const sortedThreads = threads.sort((a, b) => b.thread_vote_count - a.thread_vote_count).slice(0, 5);

  const getSchoolname = (universityId) => {
    const university = universities.find(uni => uni.id === universityId);
    return university ? university.university_name : '';
  };

  const getThreadURL = (schoolname, threadId) => {
    return `/${schoolname}/threads/${threadId}/posts`;
  };

  return (
    <div className="featured-schoolname-container">
      <div className="featured-threads-container">
        <ul>
        {sortedThreads.map(thread => {
            const university = universities.find(uni => uni.id === thread.thread_university_id);
            const backgroundColor = university ? university.university_color : 'white';

            return (
              <li key={thread.id} className="thread" style={{ backgroundColor }}>
                <Link to={getThreadURL(getSchoolname(thread.thread_university_id), thread.id)}>
                  / {getSchoolname(thread.thread_university_id)} / {thread.thread_title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="button-container">
        <Link to="/threads" className="explore-button">Explore More Threads</Link>
        </div>
    </div>
  );
}

export default FeaturedThreads;
