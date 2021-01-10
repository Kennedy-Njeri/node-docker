const express = require("express");
const router = express.Router();

const {
    create,
    taskById,
    read,
    remove,
    update,
    list1
} = require("../controllers/task");
const { requireSignin, isAuth } = require("../controllers/auth");
const { userById } = require("../controllers/user");



router.get("/tasks/:taskId")
router.get("/tasks/:userId", requireSignin, isAuth, list1);
router.post("/tasks/create/:userId", requireSignin, isAuth, create);
router.put("/tasks/:taskId/:userId", requireSignin, isAuth, update);
router.delete("/tasks/remove/:taskId/:userId", requireSignin, isAuth, remove);
//router.get("/tasks/list/:userId", list);




router.param("userId", userById);
router.param("taskId", taskById);



module.exports = router;