import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function AllThreads({ universities }) {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    fetch(`/threads`)
      .then(response => response.json())
      .then(data => {
        setThreads(data);
      })
      .catch(error => console.log(error));
  }, []);

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
        {threads.map(thread => {
            const university = universities.find(uni => uni.id === thread.thread_university_id);
            const backgroundColor = university ? university.university_color : 'white';

            return (
              <li key={thread.id} className="thread" style={{ backgroundColor }}>
                <Link to={getThreadURL(getSchoolname(thread.thread_university_id), thread.id)}>
                  /{getSchoolname(thread.thread_university_id)}/{thread.thread_title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default AllThreads;
