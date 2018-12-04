import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Spinner from '../common/Spinner';
import PostItem from '../posts/PostItem';
import CommentForm from './CommentForm';
import CommentFeed from './CommentFeed';

import { getCurrentProfile } from '../../actions/profileActions';
import { getPost } from '../../actions/postActions';
import isEmpty from '../../utils/is-empty';

class Post extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
    this.props.getPost(this.props.match.params.id);
  }

  render() {
    const { post, loading } = this.props.post;

    let postContent;

    if (post === null || loading || isEmpty(post)) {
      postContent = <Spinner />;
    } else {
      postContent = (
        <div>
          <PostItem post={post} showActions={false} />
          <CommentForm postId={post._id} />
          <CommentFeed postId={post._id} comments={post.comments} />
        </div>
      );
    }

    return (
      <div className='post'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <Link to='/feed' className='btn btn-light mb-3'>
                Back To Feed
              </Link>
              {postContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = ({ post }) => ({ post });

export default connect(
  mapStateToProps,
  { getPost, getCurrentProfile }
)(Post);