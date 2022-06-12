const express = require("express");
const router = express.Router();

const BannerController = require('../controllers/banner');
const upload = require('../middlewares/multer')


//Defining endpoints
// router.post("/upload", upload.single('avatar'), BannerController.Upload);  this is for single file upload
router.post("/upload", upload.array('avatar', 30), BannerController.Upload);  //this is for multiple file upload
router.get("/get-all", BannerController.GetAll);
router.get("/get-by-name/:name", BannerController.GetByName);
router.delete('/delete/:id', BannerController.Delete)


module.exports = router;