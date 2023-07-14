import { useEffect, useState } from 'react';
import { useParams, Redirect } from 'react-router-dom';

function Posts() {
  const { schoolname, threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyPostId, setReplyPostId] = useState(null);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  useEffect(() => {
    fetch(`/${schoolname}/threads/${threadId}`)
      .then(response => response.json())
      .then(data => setThread(data))
      .catch(error => console.log(error));

    fetch(`/${schoolname}/threads/${threadId}/posts?sort=vote_count`)
      .then(response => response.json())
      .then(data => setPosts(data))
      .catch(error => console.log(error));

    fetch(`/users`)
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.log(error));

    fetch(`/universities`)
      .then(response => response.json())
      .then(data => setUniversities(data))
      .catch(error => console.log(error));

    fetch(`/current_session`)
      .then(response => response.json())
      .then(data => {
        setLoggedInUser(data);
        if (!data) {
          setRedirectToLogin(true);
        }
      })
      .catch(error => console.log(error));
  }, [schoolname, threadId]);

  const handleVote = (postId, voteType) => {
    if (!loggedInUser) {
      setRedirectToLogin(true);
      return;
    }

    const voteValue = voteType === 'up' ? 1 : -1;

    fetch(`/${schoolname}/threads/${threadId}/posts/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ post_vote_count: voteValue }),
    })
      .then(response => response.json())
      .then(updatedPost => {
        const updatedPosts = posts.map(post =>
          post.id === updatedPost.id
            ? { ...post, post_vote_count: post.post_vote_count + parseInt(voteValue) }
            : post
        );
        setPosts(updatedPosts);
      })
      .catch(error => console.log(error));
  };

  const handleEdit = (postId) => {
    if (!loggedInUser) {
      setRedirectToLogin(true);
      return;
    }

    const updatedPosts = posts.map(post =>
      post.id === postId ? { ...post, isEditing: true } : { ...post, isEditing: false }
    );
    setPosts(updatedPosts);
  };

  const handleSave = (postId, newContent) => {
    if (!loggedInUser) {
      setRedirectToLogin(true);
      return;
    }

    const updatedPosts = [...posts];
    const postIndex = updatedPosts.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
      updatedPosts[postIndex] = {
        ...updatedPosts[postIndex],
        isEditing: false,
        post_content: newContent
      };
      setPosts(updatedPosts);

      const updatedPost = { post_content: newContent };
      fetch(`/${schoolname}/threads/${threadId}/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(updatedPost)
      })
        .then(response => {
          if (!response.ok) {
            console.log('Failed to update post');
          }
        })
        .catch(error => console.log(error));
    }
  };

  const handleDelete = (postId) => {
    if (!loggedInUser) {
      setRedirectToLogin(true);
      return;
    }

    fetch(`/${schoolname}/threads/${threadId}/posts/${postId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.status === 204) {
          const updatedPosts = posts.filter(post => post.id !== postId);
          setPosts(updatedPosts);
        } else {
          console.log('Failed to delete post');
        }
      })
      .catch(error => console.log(error));
  };

  const getUser = (userId) => {
    const user = users.find(user => user.id === userId);
    if (user) {
      const university = universities.find(uni => uni.id === user.user_university_id);
      return {
        ...user,
        university_name: university ? university.university_name : ''
      };
    }
    return null;
  };

  const handleReply = (postId) => {
    if (!loggedInUser) {
      setRedirectToLogin(true);
      return;
    }

    setReplyPostId(postId);
    setReplyContent('');
  };

  const handleReplySubmit = () => {
    if (!loggedInUser) {
      setRedirectToLogin(true);
      return;
    }

    const newPostData = {
      post_content: replyContent,
      reply_post_id: replyPostId,
    };

    fetch(`/${schoolname}/threads/${threadId}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(newPostData)
    })
      .then(response => {
        if (response.ok) {
          fetch(`/${schoolname}/threads/${threadId}/posts?sort=vote_count`)
            .then(response => response.json())
            .then(data => setPosts(data))
            .catch(error => console.log(error));
          setReplyPostId(null);
        } else {
          console.log('Failed to create post');
        }
      })
      .catch(error => console.log(error));
  };

  const renderPostWithReplies = (post) => {
    const user = getUser(post.post_user_id);
    const isCurrentUserPost = loggedInUser && user && loggedInUser.id === user.id;
  
    const handleVoteClick = (postId, voteType) => {
      if (loggedInUser) {
        handleVote(postId, voteType);
      } else {
        setRedirectToLogin(true);
      }
    };
  
    return (
      <li key={post.id}>
        <div className="user-info">
          <p>s/ {user ? user.username : ''}</p>
          <p>u/ {user ? user.university_name : ''}</p>
        </div>
        <div className="content">
          {post.isEditing ? (
            <textarea
              value={post.post_content}
              onChange={(e) => {
                const updatedPosts = [...posts];
                const postIndex = updatedPosts.findIndex((p) => p.id === post.id);
                if (postIndex !== -1) {
                  updatedPosts[postIndex].post_content = e.target.value;
                  setPosts(updatedPosts);
                }
              }}
            />
          ) : (
            <p>/{post.post_content}</p>
          )}
        </div>
        <div className="actions">
          <div className="votes">
            {loggedInUser && (
              <>
                <button onClick={() => handleVoteClick(post.id, 'up')}>&#8593;</button>
                <span>{post.post_vote_count}</span>
                <button onClick={() => handleVoteClick(post.id, 'down')}>&#8595;</button>
              </>
            )}
            {!loggedInUser && (
              <div className="vote-placeholder">
                <button onClick={() => setRedirectToLogin(true)}>&#8593;</button>
                <span>{post.post_vote_count}</span>
                <button onClick={() => setRedirectToLogin(true)}>&#8595;</button>
              </div>
            )}
          </div>
          <div className="buttons">
            {loggedInUser ? (
              <>
                {isCurrentUserPost && !post.isEditing && (
                  <button className="edit" onClick={() => handleEdit(post.id)}>
                    Edit
                  </button>
                )}
                {isCurrentUserPost && post.isEditing && (
                  <button className="save" onClick={() => handleSave(post.id, post.post_content)}>
                    Save
                  </button>
                )}
                {isCurrentUserPost && (
                  <button className="delete" onClick={() => handleDelete(post.id)}>
                    Delete
                  </button>
                )}
                {!isCurrentUserPost && (
                  <button className="reply" onClick={() => handleReply(post.id)}>
                    Reply
                  </button>
                )}
              </>
            ) : (
              <>
                <button className="reply login" onClick={() => setRedirectToLogin(true)}>
                  Reply
                </button>
              </>
            )}
          </div>
        </div>
        {/* Render replies */}
        {post.replies && post.replies.length > 0 && (
          <ul className="replies">
            {post.replies.map((reply) => (
              <li key={reply.id}>
                <div className="user-info">
                  <p>s/ {getUser(reply.post_user_id)?.username}</p>
                  <p>u/ {getUser(reply.post_user_id)?.university_name}</p>
                </div>
                <div className="content">
                  <p>/{reply.post_content}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };  

  if (redirectToLogin) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="posts-container">
      <h1 style={{ color: thread && thread.university_color }}>
        Thread: {thread ? thread.thread_title : ''}
      </h1>
      <ul>{posts.map(post => renderPostWithReplies(post))}</ul>
      {replyPostId && (
        <div className="reply-box">
          <textarea value={replyContent} onChange={e => setReplyContent(e.target.value)} />
          <button onClick={handleReplySubmit}>Submit</button>
        </div>
      )}
    </div>
  );
}

export default Posts;

