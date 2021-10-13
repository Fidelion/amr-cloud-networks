const { default: axios } = require('axios');
const { check, validationResult } = require('express-validator');
const config = require('config');

const Profile = require('../models/Profile');
const User = require('../models/User');
const Post = require('../models/Posts');

const httpGetProfile = async(req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if(!profile) {
            return res.status(400).json({msg: 'There is no profile for this user'});
        }

        res.json(profile);

    } catch(err){
        console.error(err.message);
        res.status(500).send(`Server error`);
    }
};


const httpAddUpdateProfile = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        instagram,
        twitter,
        linkedin
    } = req.body;

    //Build profile object
    const profileFields = {};

    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills){
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    profileFields.social = {};
    if(youtube) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;
    if(facebook) profileFields.social.faceboook = facebook;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;

    try {
        let profile = await Profile.findOne({
            user: req.user.id
        });


        if(profile) {
            profile = await Profile.findOneAndUpdate({
                user: req.user.id
            }, {
                $set: profileFields
            },{
                new: true
            });

            return res.json(profile)
        }

        profile = new Profile(profileFields);

        await profile.save();
        res.json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
     
}

const httpGetAllProfiles = async(req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const httpGetOneProfile = async(req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate('user', ['name', 'avatar']);

        if(!profile) {
            return res.status(400).json({
                message: 'Profile not found'
            });
        }

        res.json(profile);
    } catch (err) {
        if(err.type = 'ObjectId') {
            return res.status(400).json({
                message: 'Profile not found'
            });
        }

        return res.status(500).json({
            error: err.message
        })
    }
}

const httpRemoveProfileUser = async(req, res) => {
    try {
        
        await Post.deleteMany({ user: req.user.id });

        await Profile.findOneAndRemove({ user: req.user.id });

        await User.findOneAndRemove({ _id: req.user.id });

        return res.status(200).json({
            msg: 'User with Profile has been successfully removed'
        })
    } catch (err) {
        return res.status(500).json({
            msg: err.message
        })
    }
}

const httpAddExperience = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        title,
        company,
        from,
        to,
        current,
        location,
        description
    } = req.body;

    const newExperience = {
        title,
        company,
        from,
        to,
        current,
        location,
        description
    };

    try {
        const profile = await Profile.findOne({ user: req.user.id });

        profile.experience.unshift(newExperience);

        await profile.save();

        return res.status(200).json(profile);
    } catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
}

const httpDeleteExperience = async(req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        const removeExp = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        
        profile.experience.splice(removeExp, 1);

        await profile.save();

        return res.status(200).json(profile);
    } catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
}


const httpAddEducation = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEducation = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({ user: req.user.id });

        profile.education.unshift(newEducation);

        await profile.save();

        return res.json(profile);
    } catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
}

const httpDeleteEducation = async(req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        const removeEdu = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        
        profile.education.splice(removeEdu, 1);

        await profile.save();

        return res.json(profile);
    } catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
}


const httpUpdateEducation = async(req, res) => {
    let profile = await Profile.findOne({ user: req.user.id });

        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body;


        const education = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }

    try {

        if(profile) {
            
            const user = await Profile.findOne({
                user: req.user.id,
            });

            user.education.updateOne({
                _id: req.params.edu_id
            }, {
                $set: education
            }, {
                new: true
            });

            await profile.save();

            return res.status(200).json({
                profile
            })
        }
    } catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
}


const httpGetGithubRepo = async(req, res) => {
    const github_client = config.get("github_client");
    const github_secret = config.get("github_secret");
    const github_user = req.params.username;
    const link = `https://api.github.com/users/${github_user}/repos?per_page=5&sort=created:asc&client_id=${github_client}&client_secret=${github_secret}`
    try {
        const request = await axios.get(link);
        
        if(request.status !== 200) {
           console.error(request);
        } else {
            return res.status(200).json(request.data)
        }
    } catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
}

module.exports = {
    httpGetProfile,
    httpAddUpdateProfile,
    httpGetAllProfiles,
    httpGetOneProfile,
    httpRemoveProfileUser,
    httpAddExperience,
    httpDeleteExperience,
    httpAddEducation,
    httpDeleteEducation,
    httpUpdateEducation,
    httpGetGithubRepo
}