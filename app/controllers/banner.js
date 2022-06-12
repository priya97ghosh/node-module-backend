const Banner = require('../models/banner');
const apiResponse = require('../helpers/responseApi')

// upload API
exports.Upload = (req, res, next) => {
    let banner = new Banner({
        name: req.body.name,
        description: req.body.description,
        avatar: req.body.avatar
    })
    console.log("body", req.body)
    // if (req.file) {
    //     banner.avatar = req.file.path
    // }
    if (req.files) {
        let path = ''
        req.files.forEach(function (files, index, arr) {
            path = path + files.path + ','
        })
        console.log("files", req.files)
        path = path.substring(0, path.lastIndexOf(','))
        banner.avatar = path;
        console.log("path", path)
    }

    /* banner.save();
    .then(response => {
        res.json({
            message: "banner added successfully"
        })
    })
        .catch(error => {
            res.json({
                message: "An error Occured"
            })
        })   */  

        banner.save(function (err) {
            if (err) { return apiResponse.errorResponse(res, err); }
            res.json({
                message: "banner added successfully"
            })
        })       
    }

// Get all API
exports.GetAll = async (req, res) => {
    try{
        const banners = await Banner.find({});
        if(banners.length === 0){
            return res.status(204).json(
                {
                    message: "no contents available in the database to present",
                }
            )
        }
        else{
            return res.status(200).json(
                {
                    banners: banners
                }
            )
        }
    }catch(error){
        return res.status(500).json(
            {
                error: "Something Went Wrong!",
                message: error
            }
        )
    }
}

// get banners by banner_name API
exports.GetByName = async (req, res) => {
    try {
        const banner = await Banner.find({ name: req.params.name });
        res.json(banner);
    } catch (err) {
        res.json(
            {
                error: true,
                message: err.message
            }
        )
    }
}

// Delete Specific banner By Id
exports.Delete= async (req, res) => {
    try {
        const deleteBanner = await Banner.findOneAndDelete({
            _id: req.params.id
        });
        res.json({
            error: false,
            message: "Banner Deleted Successfully!",
            Response: deleteBanner
        });
    } catch (err) {
        res.json({
            message: err.message
        });

    }
};
