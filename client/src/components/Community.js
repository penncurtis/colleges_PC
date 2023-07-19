import { Link } from 'react-router-dom';

function CommunityPage() {
  return (
    <div className='featured-header-box'>
        <div className="featured-header-text">
            <h2 className='main-subtitle'>Welcome to the Athena Community!</h2>
            <p className='community-tagline'>
                Athena thrives on the power of its user community. We encourage users to actively participate and contribute their valuable insights and experiences. By sharing your knowledge, you can help fellow students navigate the complexities of college life and make informed decisions.
            </p>
            <p className='community-tagline'>
                The community aspect of Athena fosters a supportive environment where students can connect, collaborate, and learn from one another. We believe that the strength of the platform lies in the collective wisdom and shared experiences of its users. Together, we can create a vibrant and inclusive college advice community.
            </p>
            <p className='community-tagline'>
                Join us on Athena and be a part of this dynamic community. Explore, learn, and share your journey with fellow students. Your contributions make a difference and enhance the value of the platform for everyone.
            </p>
            <div className="button-container">
                <Link to="/signup" className="explore-button">Join the Community</Link>
            </div>
        </div>
    </div>
  );
}

export default CommunityPage;