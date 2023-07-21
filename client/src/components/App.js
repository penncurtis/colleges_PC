import '../App.css';
import {useState, useEffect} from 'react'
import { Route, Switch, useParams } from "react-router-dom"

import UniversitiesList from './UniversitiesList'
import NewUniversityForm from './NewUniversityForm'
import Threads from './Threads';
import Posts from './Posts';
import NavBar from './NavBar'
import Header from './Header'
import AddThread from './AddThread';
import Login from "./Login"
import Signup from "./Signup"
import UserDetails from "./UserDetails"
import AddPost from './AddPost';
import FeaturedThreads from './FeaturedThreads';
import SearchUni from './SearchUni';
import AllThreads from './AllThreads';
import FeaturedUni from './FeaturedUnis';
import CommunityPage from './Community';

function App() {

  // const [threadFormData, setThreadFormData] = useState({});
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    fetch('/universities')
      .then(response => response.json())
      .then(unidata => setUniversities(unidata))
  }, [])

  // add school stuff
  const [postUniFormData, setPostUniFormData] = useState({});

  function addUniversity(event, formData) {
    event.preventDefault();
  
    fetch('/universities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(newUni => {
        setUniversities(universities => [...universities, newUni]);
        window.location.reload(); // Refresh the page
      });
  }
  
  function updatePostUniFormData(event) {
    setPostUniFormData({ ...postUniFormData, [event.target.name]: event.target.value });
  }
  
  // make thread stuff
  const [threads, setThreads] = useState([]);
  
  function addThread(newThread, schoolname) {
    fetch(`/${schoolname}/threads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(newThread),
    })
      .then(response => response.json())
      .then(newThread => {
        setThreads(threads => [...threads, newThread]);
        window.location.reload(); // Refresh the page
      });
  }
  
  const { schoolname } = useParams();
  const universityId = universities.find(uni => uni.university_name === schoolname)?.id;
  
  // make post stuff
  const [posts, setPosts] = useState([]);
  
  function addPost(newPost, schoolname, threadId) {
    fetch(`/${schoolname}/threads/${threadId}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(newPost),
    })
      .then(response => response.json())
      .then(newPost => {
        setPosts(posts => [...posts, newPost]);
        window.location.reload(); // Refresh the page
      });
  }  

  // login stuff
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    fetch('/current_session')
    .then(res => {
      if (res.ok) {
        res.json()
        .then(user => setCurrentUser(user))
      }
    })
  }, [])

  function attemptLogin(userInfo) {
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accepts': 'application/json'
      },
      body: JSON.stringify(userInfo)
    })
    .then(res => {
      if (res.ok) {
        res.json()
        .then(user => setCurrentUser(user))
      }
    })
  }

  function attemptSignup(userInfo) {
    fetch('/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accepts': 'application/json'
      },
      body: JSON.stringify(userInfo)
    })
    .then(res => {
      if (res.ok) {
        res.json()
        .then(user => setCurrentUser(user))
      }
    })
  }

  function logout() {
    setCurrentUser(null)
    fetch('/logout', { method: 'DELETE' })
  }

  // college search stuff

  const [searchUni, setSearchUni] = useState('')

  function searchUniversities(e) {
    setSearchUni(e.target.value)
  }

  const filteredUniversities = universities.filter(university => {
    if (searchUni === '') {
      return true
    }
    return university.university_name.toLowerCase().includes(searchUni.toLowerCase())
  })

  return (
    <div className="app">
      <NavBar />
      <Header />
      <Switch>
        <Route exact path="/">
          <div className="featured-header-box">
            <div className="featured-header-text">
              <p className="main-subtitle">// All Schools, One Schoolhouse</p>
              <p className="tagline">// Questions Asked & Answers Found</p>
            </div>
          </div>
          <h1 style={{ fontSize: "3.5rem" }}>/ explore universities:</h1>
          <FeaturedUni universities={universities} />
          <h1 style={{ fontSize: "3.5rem" }}>/ explore topics:</h1>
          <FeaturedThreads universities={universities}/>
        </Route>
        <Route path="/login">
          
        { !currentUser ? <Login attemptLogin={attemptLogin} /> : null }

        { currentUser ? <UserDetails currentUser={currentUser} logout={logout} /> : null }

        </Route>
        <Route path="/signup">

        { !currentUser ? <Signup attemptSignup={attemptSignup} universities={universities} /> : null }

        { currentUser ? <UserDetails currentUser={currentUser} logout={logout} /> : null }

        </Route>
        <Route path="/community">
          <CommunityPage/>
        </Route>
        <Route path="/universities">
          <SearchUni searchUniversities={searchUniversities} searchUni={searchUni}/>
          <UniversitiesList universities={filteredUniversities} />
        </Route>
        <Route path="/threads">
          <AllThreads universities={universities} />
        </Route>
        <Route path="/add_university">
          <NewUniversityForm addUniversity={addUniversity} updatePostUniFormData={updatePostUniFormData} postUniFormData={postUniFormData}/>
        </Route>
        <Route exact path="/:schoolname">
          <div
            className="schoolname-container"
            style={{
              backgroundColor: universities.find(uni => uni.university_name === schoolname)?.university_color,
            }}
          >
            <Threads universities={universities} threads={threads} />
            <AddThread universityId={universityId} addThread={addThread} />
          </div>
        </Route>
        <Route exact path="/:schoolname/threads/:threadId/posts">
          <Posts universities={universities} />
          <AddPost addPost={addPost} />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
