const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Post model
const Post = require('../../models/Post');

// Validation
const validatePostInput = require('../../validation/post');

/************************************************************************/

// @route   GET api/posts/all
// @desc    Get posts
// @access  Public
router.get('/all', (req, res) => {
  Post.find()
    .sort({ date: 'desc' })
    .populate('user', ['name', 'avatar'])
    .populate('likes.user', 'name')
    .populate('comments.user', 'name')
    .then(posts => res.json(posts))
    .catch(errors => res.status(404).json({ postNotFound: 'No posts found' }));
});

/************************************************************************/

// @route   GET api/posts/post/:id
// @desc    Get post by id
// @access  Public
router.get('/post/:id', (req, res) => {
  Post.findById(req.params.id)
    .populate('user', ['name', 'avatar'])
    .populate('likes.user', 'name')
    .populate('comments.user', 'name')
    .then(post => res.json(post))
    .catch(errors => res.status(404).json({ postNotFound: 'No post found' }));
});

/************************************************************************/

// @route   POST api/posts/
// @desc    Create post
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost
      .save()
      .then(post => res.json(post))
      .catch(err => res.json(err));
  }
);

/************************************************************************/

// @route   DELETE api/posts/post/:id
// @desc    Delete post
// @access  Private
router.delete(
  '/post/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findOneAndRemove({ user: req.user.id, _id: req.params.id }).then(
      post => {
        if (!post) res.status(404).json({ postNotFound: 'Post not found' });
        else
          res.json({
            succes: true,
            message: `Post ${post.id} has been removed`
          });
      }
    );
  }
);

/************************************************************************/

// @route   POST api/posts/like/:id
// @desc    Add a like to a post
// @access  Private
router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { id } = req.params;

    Post.findById(id)
      .then(post => {
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length > 0
        ) {
          return res.status(400).json({
            alreadyLiked: 'User already liked this post'
          });
        }

        // Add user ID to likes array
        post.likes.unshift({ user: req.user.id });
        post
          .save()
          .then(post => res.json(post))
          .catch(errors => res.json(errors));
      })
      .catch(errors =>
        res.status(404).json({ postNotFound: 'Post not found' })
      );
  }
);

/************************************************************************/

// @route   DELETE api/posts/like/:id
// @desc    Remove a like from a post
// @access  Private
router.delete(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { id } = req.params;

    Post.findById(id)
      .then(post => {
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length === 0
        ) {
          return res.status(400).json({
            notLiked: 'User has not liked this post'
          });
        }

        const filteredLikesArray = post.likes.filter(
          like => like.user.toString() !== req.user.id
        );

        post.likes = filteredLikesArray;

        post
          .save()
          .then(post => res.json({ success: true, message: 'Post unliked' }));
      })
      .catch(errors =>
        res.status(404).json({ postNotFound: 'Post not found' })
      );
  }
);

/************************************************************************/

// @route   POST api/posts/comment/:id
// @desc    Add a comment to post
// @access  Private
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const { id } = req.params;

    Post.findById(id)
      .then(post => {
        const newComment = {
          user: req.user.id,
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar
        };

        // Add to comments array
        post.comments.push(newComment);
        post.save().then(post => res.json(post));
      })
      .catch(errors =>
        res.status(404).json({ postNotFound: 'Post not found' })
      );
  }
);

/************************************************************************/

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove a comment from post
// @access  Private
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { id, comment_id } = req.params;

    Post.findById(id)
      .then(post => {
        const commentToDelete = post.comments.find(
          comment => comment.id === comment_id
        );

        if (!commentToDelete)
          return res.status(404).json({ commentNotFound: 'Comment not found' });

        if (commentToDelete.user.toString() !== req.user.id)
          return res.status(401).json({
            notAuthorized: 'You are not authorized to delete this comment'
          });

        const filteredCommentsArray = post.comments.filter(
          comment => comment !== commentToDelete
        );

        post.comments = filteredCommentsArray;
        post
          .save()
          .then(post =>
            res.json({ success: true, message: 'Comment removed' })
          );
      })
      .catch(errors =>
        res.status(404).json({ postNotFound: 'Post not found' })
      );
  }
);

/************************************************************************/

module.exports = router;
