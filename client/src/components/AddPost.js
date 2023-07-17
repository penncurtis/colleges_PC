import { useState, useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';

function AddPost({ addPost }) {
  const [postContent, setPostContent] = useState('');
  const { schoolname, threadId } = useParams();
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

    const newPost = {
      post_content: postContent
    };

    addPost(newPost, schoolname, threadId);
    setPostContent('');
  };

  const handleInputChange = (event) => {
    setPostContent(event.target.value);
  };

  if (redirectToLogin) {
    return <Redirect to="/login" />;
  }

  return (
    <div className='add-post-container'>
      <h2>Add Post</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          name="post_content"
          value={postContent}
          onChange={handleInputChange}
          placeholder="Enter your post"
          required
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default AddPost;
