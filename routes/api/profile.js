const express = require('express');
const { check, validationResult } = require('express-validator');
const profileRouter = express.Router();
const { httpGetProfile, 
    httpAddUpdateProfile,
    httpGetAllProfiles, 
    httpGetOneProfile, 
    httpRemoveProfileUser, 
    httpAddExperience,
    httpDeleteExperience,
    httpAddEducation,
    httpDeleteEducation,
    httpUpdateEducation,
    httpGetGithubRepo } = require('../../controllers/profile.controller');
const { middlewareDecode } = require('../../middleware/auth');


profileRouter.get('/me', middlewareDecode, httpGetProfile);
profileRouter.post('/', [middlewareDecode, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
]], httpAddUpdateProfile);
profileRouter.get('/', httpGetAllProfiles)
profileRouter.get('/user/:user_id', httpGetOneProfile);
profileRouter.delete('/', middlewareDecode, httpRemoveProfileUser);
profileRouter.put('/experience', [middlewareDecode, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From is required').not().isEmpty()
]], httpAddExperience);
profileRouter.delete('/experience/:exp_id', middlewareDecode, httpDeleteExperience);
profileRouter.put('/education', [middlewareDecode, [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
]], httpAddEducation);
profileRouter.delete('/education/:edu_id', middlewareDecode, httpDeleteEducation);
// profileRouter.put('/education/:edu_id', middlewareDecode, httpUpdateEducation);
profileRouter.get('/github/:username', middlewareDecode, httpGetGithubRepo);

module.exports = {
    profileRouter
}