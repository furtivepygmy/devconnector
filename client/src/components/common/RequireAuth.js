import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export default WrappedComponent => {
  class RequireAuth extends Component {
    componentDidMount() {
      this.redirectToLanding();
    }
    componentDidUpdate() {
      this.redirectToLanding();
    }

    redirectToLanding() {
      if (!this.props.auth.isAuthenticated) {
        this.props.history.push('/');
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  const mapStateToProps = ({ auth }) => {
    return {
      auth
    };
  };

  RequireAuth.propTypes = {
    auth: PropTypes.object.isRequired
  };

  return connect(mapStateToProps)(RequireAuth);
};
