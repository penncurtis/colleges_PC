import { Link } from 'react-router-dom';

function University({ university }) {
  const { university_name, university_color } = university;

  // Define the inline style for the background color
  const universityStyle = {
    backgroundColor: university_color,
  };

  return (
    <Link to={`/${university_name}`} className="uni-link">
      <div className="uni" style={universityStyle}>
        <h1>/ {university_name}</h1>
      </div>
    </Link>
  );
}

export default University;

