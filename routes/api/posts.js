const express = require('express');
const postsRouter = express.Router();
const { check, validationResult } = require('express-validator');
const { middlewareDecode } = require('../../middleware/auth');

const Posts = require('../../models/Posts');
const User = require('../../models/User');
const { httpAddPost, httpGetAllPosts, httpGetOnePost, httpRemoveOnePost, httpAddLike, httpAddUnlike, httpAddComment, httpRemoveComment } = require('../../controllers/posts.controller');


//@route GET api/posts
//@access public
postsRouter.post('/',[middlewareDecode, [
    check('text', "Text is required").not().isEmpty()
]], httpAddPost);

postsRouter.get('/', middlewareDecode, httpGetAllPosts);

postsRouter.get('/:id', middlewareDecode, httpGetOnePost);

postsRouter.delete('/:id', middlewareDecode, httpRemoveOnePost);

postsRouter.put('/like/:id', middlewareDecode, httpAddLike);

postsRouter.put('/unlike/:id', middlewareDecode, httpAddUnlike);

postsRouter.post('/comment/:id',[middlewareDecode, [
    check('text', "Text is required").not().isEmpty()
]], httpAddComment);

postsRouter.delete('/comment/:id/:comment_id', middlewareDecode, httpRemoveComment);
module.exports = {
    postsRouter
}
