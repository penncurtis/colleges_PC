import University from './University';
import { Link } from 'react-router-dom';

function FeaturedUni({ universities }) {
  const featuredUniversities = universities.slice(0, 20);

  const uniComponents = featuredUniversities.map(university => (
    <University key={university.id} university={university} />
  ));

  return (
    <div>
      <ul className="uni-list">{uniComponents}</ul>
      <div className="button-container">
        <Link to="/universities" className="explore-button">Explore More Universities</Link>
      </div>
    </div>
  );
}

export default FeaturedUni;