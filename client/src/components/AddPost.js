import { useState } from 'react';
import { useParams } from 'react-router-dom';

function AddPost({ addPost }) {
  const [postContent, setPostContent] = useState('');
  const { schoolname, threadId } = useParams();

  const handleSubmit = (event) => {
    event.preventDefault();

    const newPost = {
      post_content: postContent
    };

    addPost(newPost, schoolname, threadId);
    setPostContent('');
  };

  const handleInputChange = (event) => {
    setPostContent(event.target.value);
  };

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
