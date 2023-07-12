const express = require('express');
const {authMiddleWare , isAdmin} = require('../middlewares/authMiddleWare');
const router = express.Router();
const {
    createUser,
    loginUser,
    getallUsers,
    getaUser,
    deleteaUser,
    updateaUser,
    blockUser,
    unBlockUser,
    handleRefreshToken,
    logout
} = require("../controller/userController");


router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/users',authMiddleWare,isAdmin,getallUsers);
router.get('/:id',authMiddleWare,isAdmin,getaUser);
router.delete('/:id',authMiddleWare, deleteaUser);
router.put("/:id",authMiddleWare,updateaUser);
router.put("/block/:id",authMiddleWare,isAdmin,blockUser);
router.put("/unblock/:id",authMiddleWare,isAdmin,unBlockUser);
router.put('/refresh',handleRefreshToken);
router.get('/logout',logout);
module.exports = router;