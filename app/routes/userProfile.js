const express = require('express')
const router = express.Router();

const userProfileController = require('../controllers/userProfile')

router.post("/create", userProfileController.Create);
router.get("/get-all", userProfileController.GetAll);
router.get('/get-by-id',userProfileController.GetById);
router.put('/update/:id', userProfileController.Update);

module.exports = router;