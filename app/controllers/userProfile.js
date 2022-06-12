
const Joi = require("joi");
const Profile = require('../models/userProfile')
const timeline = require('../helpers/timestamp');

//Validate userProfile schema
const ProfileSchema = Joi.object().keys({
    user: Joi.string().required(),
    name: Joi.string().required(),
    age: Joi.number().required(),
    gender: Joi.string().required(),
    contactNumber: Joi.string().required(),
    address: Joi.string().required()
});

// user registration
exports.Create = async (req, res) => {
    try {
        console.log(req.body);
        const result = ProfileSchema.validate(req.body);
        if (result.error) {
            console.log(result.error.message);
            return res.json({
                error: true,
                status: 400,
                message: result.error.message,
            });
        }

        //Check if the email has been already registered.
        var user = await Profile.findOne({
            user: result.value.user,
        });
        if (user) {
            return res.json({
                error: true,
                message: "Details Already Present",
            });
        }

        let date_time = timeline.timestamp();
        req.body.createdAt = date_time;

        const newProfile = new Profile(result.value);
        await newProfile.save();

        return res.status(200).json({
            success: true,
            message: "Profile Created Successfully",
            Profile: newProfile
        });
    } catch (error) {
        console.error("newProfile-error", error);
        return res.status(500).json({
            error: true,
            message: "Cannot Create",
            error: error
        });
    }
};

// get all
exports.GetAll = async (req, res) => {
    try {
      // console.log(req);
      const profile = await Profile.find({});
      console.log(profile);
      return res.json(profile);
    } catch (err) {
      res.json({ message: err.message })
    }
  };

// get by ID
exports.GetById = async (req, res) => {
    try {
        const profile = await Profile.findById(req.query.userId);
        res.json(profile);
      } catch (err) {
        res.json({ message: err.message })
    }
}

// update profile by Id
exports.Update = async (req, res) => {
    const { name, age, gender, contactNumber, address } = req.body;

    try {

        const profile = await Profile.findById(req.params.id);
        if (!profile) {
            const error = new Error("User profile not found.");
            error.statusCode = 404;
            throw error;
        }
        
        profile.name = name || profile.name;
        profile.age = age || profile.age;
        profile.gender = gender || profile.gender;
        profile.contactNumber = contactNumber || profile.contactNumber;
        profile.address = address || profile.address;

        profile.updatedAt = timeline.timestamp();

        await profile.save();

        return res.status(200).json({
            success: true,
            message: "profile details has been updated",
            update_profile: profile
        })

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error
        })
    }
}
