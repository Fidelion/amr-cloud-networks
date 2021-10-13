const { check, validationResult } = require('express-validator');
const Profile = require('../models/Profile');
const User = require('../models/User');
const Posts = require('../models/Posts');


const httpAddPost = async(req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array()
        });
    }

    try {
    const user = await User.findById(req.user.id).select('-password');

    const newPost = new Posts({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
    });

    const post = await newPost.save();

    return res.status(200).json(post);
        
    } catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
}

const httpGetAllPosts = async(req, res) => {
    try {
        const posts = await Posts.find().sort({ date: -1 });

        return res.status(200).json(posts);
    } catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
}

const httpGetOnePost = async(req, res) => {
     try {
        const post = await Posts.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                error: 'Post not found'
            });
        } else {
            return res.json(post);
        }
    } catch (err) {

        if(err.kind === "ObjectId"){
            return res.status(404).json({
                error: 'Post not found'
            });
        }

        return res.status(500).json({
            error: err.message
        })
    }
}


const httpRemoveOnePost = async(req, res) => {
    try {
        const post = await Posts.findById(req.params.id);

        if(!post){
            return res.status(400).json({
                error: 'Post not found'
            });
        }

        if(post.user.toString() !== req.user.id){
            return res.status(401).json({
                error: 'User not authorized'
            });
        }

        await post.remove();

        return res.status(200).json({
            msg: 'Post removed successfully'
        });
    } catch (err) {
        if(err.kind === "ObjectId"){
            return res.status(400).json({
                error: 'Post not found'
            });
        }
        return res.status(500).json({
            error: err.message
        });
    }
}


const httpAddLike = async(req, res) => {
    try {
        const post = await Posts.findById(req.params.id);

        //Check if post has already been liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({
                msg: 'Post has been already liked'
            });
        }

        post.likes.unshift({ user: req.user.id });

        await post.save();

        return res.status(200).json(post.likes);
    } catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
}

const httpAddUnlike = async(req, res) => {
try {
        const post = await Posts.findById(req.params.id);

        //Check if post has already been liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
            return res.status(400).json({
                msg: 'Post has not yet been liked'
            });
        }

        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);

        await post.save();

        return res.status(200).json(post.likes);
    } catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
}


const httpAddComment = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array()
        });
    }

    try {
    const user = await User.findById(req.user.id).select('-password');

    const post = await Posts.findById(req.params.id);

    const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
    };

    post.comments.unshift(newComment);

    await post.save();

    return res.status(200).json(post.comments);
        
    } catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
}


const httpRemoveComment = async(req, res) => {
    try {
        const post = await Posts.findById(req.params.id);

        //Pull comment from the post
        const comment = post.comments.find(comment => comment.id === req.params.comment_id)
    
        //Make sure comment exist
        if(!comment){
            return res.status(400).json({
                error: 'Comment does not exist'
            });
        }

        //Check user
        if(comment.user.toString() !== req.user.id){
            return res.status(401).json({
                error: 'User not authorized'
            });
        }

        //Get remove index
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);

        post.comments.splice(removeIndex, 1);

        await post.save();
    
        return res.status(200).json(post.comments);
    } catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
}

module.exports = {
    httpAddPost,
    httpGetAllPosts,
    httpGetOnePost,
    httpRemoveOnePost,
    httpAddLike,
    httpAddUnlike,
    httpAddComment,
    httpRemoveComment
}