import { useState, useEffect } from 'react';
import { ChromePicker } from 'react-color';
import { Redirect } from 'react-router-dom';

function NewUniversityForm({ addUniversity, updatePostUniFormData, postUniFormData }) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [color, setColor] = useState('#ffffff'); 
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleColorChange = (selectedColor) => {
    setColor(selectedColor.hex);
  };

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

  const convertHexToRgb = (hexColor) => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!loggedInUser) {
        setRedirectToLogin(true);
        return;
    }

    const convertedColor = convertHexToRgb(color);

    const formData = {
      ...postUniFormData,
      university_color: convertedColor,
    };

    addUniversity(event, formData);

    setFormSubmitted(true);
  };

  if (redirectToLogin) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="new-university-form-container">
      <h1>help us get better...</h1>
      <h2>add a school</h2>
      {formSubmitted ? (
        <h1>thanks for adding a new university!</h1>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            onChange={updatePostUniFormData}
            type="text"
            name="university_name"
            placeholder="University Name"
            required
          />
          <ChromePicker
            color={color}
            onChange={handleColorChange}
            disableAlpha
          />
          <input type="submit" value="Add University" />
        </form>
      )}
    </div>
  );
}

export default NewUniversityForm;

