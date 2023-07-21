import { useEffect, useState } from 'react';
import { useParams, Redirect } from 'react-router-dom';

function Posts() {
  const { schoolname, threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [postTree, setPostTree] = useState([]);
  const [users, setUsers] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyPostId, setReplyPostId] = useState(null);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const universityColor = universities.find((uni) => uni.university_name === schoolname)?.university_color;

  useEffect(() => {
    fetch(`/${schoolname}/threads/${threadId}`)
      .then(response => response.json())
      .then(data => setThread(data))
      .catch(error => console.log(error));

    fetch(`/${schoolname}/threads/${threadId}/posts?sort=vote_count`)
      .then(response => response.json())
      .then(data => {
        // Organize posts into a tree structure
        const tree = buildPostTree(data);
        setPostTree(tree);
      })
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

  const buildPostTree = (posts) => {
    const postMap = {};
    const tree = [];

    posts.forEach(post => {
      post.replies = [];
      postMap[post.id] = post;

      if (!post.post_reply_id) {
        tree.push(post);
      } else {
        const parentPost = postMap[post.post_reply_id];
        if (parentPost) {
          parentPost.replies.push(post);
        }
      }
    });

    return tree;
  };

  const handleVote = (postId, voteType) => {
    if (!loggedInUser) {
      setRedirectToLogin(true);
      return;
    }
  
    const voteValue = voteType === 'up' ? 1 : -1;
  
    fetch(`/${schoolname}/threads/${threadId}/posts/${postId}`)
      .then(response => response.json())
      .then(post => {
        const updatedVoteCount = post.post_vote_count + voteValue;
  
        fetch(`/${schoolname}/threads/${threadId}/posts/${postId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({ post_vote_count: updatedVoteCount }),
        })
          .then(response => response.json())
          .then(updatedPost => {
            const updatedTree = [...postTree];
            updateVoteCount(updatedTree, postId, updatedPost.post_vote_count);
            setPostTree(updatedTree);
          })
          .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
  };

  const updateVoteCount = (tree, postId, voteCount) => {
    for (let i = 0; i < tree.length; i++) {
      const post = tree[i];
      if (post.id === postId) {
        post.post_vote_count = voteCount;
        return;
      }
      if (post.replies && post.replies.length > 0) {
        updateVoteCount(post.replies, postId, voteCount);
      }
    }
  };

  const handleEdit = (postId) => {
    if (!loggedInUser) {
      setRedirectToLogin(true);
      return;
    }

    const updatedTree = [...postTree];
    updatePostEditingStatus(updatedTree, postId, true);
    setPostTree(updatedTree);
  };

  const updatePostEditingStatus = (tree, postId, isEditing) => {
    for (let i = 0; i < tree.length; i++) {
      const post = tree[i];
      if (post.id === postId) {
        post.isEditing = isEditing;
        return;
      }
      if (post.replies && post.replies.length > 0) {
        updatePostEditingStatus(post.replies, postId, isEditing);
      }
    }
  };

  const handleSave = (postId, newContent) => {
    if (!loggedInUser) {
      setRedirectToLogin(true);
      return;
    }

    const updatedTree = [...postTree];
    const updatedPost = findPostById(updatedTree, postId);
    if (updatedPost) {
      updatedPost.isEditing = false;
      updatedPost.post_content = newContent;
      setPostTree(updatedTree);

      const updatedData = { post_content: newContent };
      fetch(`/${schoolname}/threads/${threadId}/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(updatedData)
      })
        .then(response => {
          if (!response.ok) {
            console.log('Failed to update post');
          }
        })
        .catch(error => console.log(error));
    }
  };

  const findPostById = (tree, postId) => {
    for (let i = 0; i < tree.length; i++) {
      const post = tree[i];
      if (post.id === postId) {
        return post;
      }
      if (post.replies && post.replies.length > 0) {
        const foundPost = findPostById(post.replies, postId);
        if (foundPost) {
          return foundPost;
        }
      }
    }
    return null;
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
          const updatedTree = removePostById(postTree, postId);
          setPostTree(updatedTree);
        } else {
          console.log('Failed to delete post');
        }
      })
      .catch(error => console.log(error));
  };

  const removePostById = (tree, postId) => {
    const updatedTree = tree.filter(post => post.id !== postId);
    for (let i = 0; i < updatedTree.length; i++) {
      const post = updatedTree[i];
      if (post.replies && post.replies.length > 0) {
        post.replies = removePostById(post.replies, postId);
      }
    }
    return updatedTree;
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
            .then(data => {
              const updatedTree = buildPostTree(data);
              setPostTree(updatedTree);
            })
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
  
    const parentPost = post.post_reply_id ? findPostById(postTree, post.post_reply_id) : null;
    const parentUser = parentPost ? getUser(parentPost.post_user_id) : null;
  
    if (parentPost) {
      return (
        <li key={post.id} className="reply-post">
          <div className="user-info">
            <p>s/ {user ? user.username : ''}</p>
            <p>u/ {user ? user.university_name : ''}</p>
          </div>
          <div className="content">
            {post.isEditing ? (
              <textarea
                value={post.post_content}
                onChange={(e) => {
                  const updatedTree = [...postTree];
                  const updatedPost = findPostById(updatedTree, post.id);
                  if (updatedPost) {
                    updatedPost.post_content = e.target.value;
                    setPostTree(updatedTree);
                  }
                }}
              />
            ) : (
              <p>/ {post.post_content}</p>
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
          <div className="parent-post-info">
            <p>Reply to:</p>
            <p>s/ {parentUser ? parentUser.username : ''} u/ {parentUser ? parentUser.university_name : ''}</p>
            <p>/ {parentPost.post_content}</p>
          </div>
          {post.replies.length > 0 && (
            <ul className="replies">
              {post.replies.map((reply) => renderPostWithReplies(reply))}
            </ul>
          )}
        </li>
      );
    }
  
    // Render as a regular post
    return (
      <li key={post.id} className="regular-post">
        <div className="user-info">
          <p>s/ {user ? user.username : ''}</p>
          <p>u/ {user ? user.university_name : ''}</p>
        </div>
        <div className="content">
          {post.isEditing ? (
            <textarea
              value={post.post_content}
              onChange={(e) => {
                const updatedTree = [...postTree];
                const updatedPost = findPostById(updatedTree, post.id);
                if (updatedPost) {
                  updatedPost.post_content = e.target.value;
                  setPostTree(updatedTree);
                }
              }}
            />
          ) : (
            <p>/ {post.post_content}</p>
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
        {post.replies.length > 0 && (
          <ul className="replies">
            {post.replies.map((reply) => renderPostWithReplies(reply))}
          </ul>
        )}
      </li>
    );
  };  

  if (redirectToLogin) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="posts-container" style={{ backgroundColor: universityColor }}>
      <h1 style={{ color: thread && thread.university_color }}>
        Thread: {thread ? thread.thread_title : ''}
      </h1>
      <ul>{postTree.map(post => renderPostWithReplies(post))}</ul>
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

