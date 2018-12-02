import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TextAreaFieldGroup from '../common/TextAreaFieldGroup';

import { addPost } from '../../actions/postActions';

class PostForm extends Component {
  state = {
    text: '',
    errors: {}
  };

  componentDidUpdate(prevProps) {
    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }
  }

  onSubmit = event => {
    event.preventDefault();

    const { user } = this.props.auth;
    const { profile } = this.props.profile;

    const newPost = {
      text: this.state.text,
      name: user.name,
      handle: profile.handle,
      avatar: user.avatar
    };

    this.props.addPost(newPost);
    this.setState({ text: '' });
    this.setState({ errors: {} });
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { errors } = this.state;

    return (
      <div className='post-form mb-3'>
        <div className='card card-info'>
          <div className='card-header bg-info text-white'>Say Somthing...</div>
          <div className='card-body'>
            <form onSubmit={this.onSubmit}>
              <div className='form-group'>
                <TextAreaFieldGroup
                  placeholder='Create a Post'
                  name='text'
                  value={this.state.text}
                  onChange={this.onChange}
                  error={errors.text}
                />
              </div>
              <button type='submit' className='btn btn-dark'>
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = ({ auth, profile, errors }) => ({
  auth,
  profile,
  errors
});

export default connect(
  mapStateToProps,
  { addPost }
)(PostForm);
