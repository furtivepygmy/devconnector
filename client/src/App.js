import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { Provider } from 'react-redux';
import store from './store';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/create-profile/CreateProfile';
import EditProfile from './components/edit-profile/EditProfile';
import AddExperience from './components/add-credentials/AddExperience';
import AddEducation from './components/add-credentials/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';
import NotFound from './components/not-found/NotFound';

// Higher order component for protected routes
import requireAuth from './components/common/RequireAuth';

import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import { clearCurrentProfile } from './actions/profileActions';

import './App.css';

// Check for token
if (localStorage.jwtToken) {
  // Set token to Auth header
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and expiration
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user (time out)
    store.dispatch(logoutUser());
    // TODO: CLear current Profile
    store.dispatch(clearCurrentProfile());
    // Redirect to login
    window.location.href = '/login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className='App'>
            <Navbar />
            <Route exact path='/' component={Landing} />
            <div className='container'>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/profiles' component={Profiles} />
              <Route exact path='/profile/:handle' component={Profile} />
              <Route exact path='/feed' component={requireAuth(Posts)} />
              <Route exact path='/post/:id' component={requireAuth(Post)} />
              <Route
                exact
                path='/create-profile'
                component={requireAuth(CreateProfile)}
              />
              <Route
                exact
                path='/edit-profile'
                component={requireAuth(EditProfile)}
              />
              <Route
                exact
                path='/add-experience'
                component={requireAuth(AddExperience)}
              />
              <Route
                exact
                path='/add-education'
                component={requireAuth(AddEducation)}
              />
              <Route
                exact
                path='/dashboard'
                component={requireAuth(Dashboard)}
              />
              <Route exact path='/not-found' component={NotFound} />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
