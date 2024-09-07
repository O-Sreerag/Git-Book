import { Router } from "express";
import * as UserController from "../controller/user-controller.js";
import * as UserMiddlware from "../middleware/user-middleware.js";

const router = Router();

router.get("/user/:username", UserMiddlware.validateGetUser, UserController.getUser)
router.get('/users/:username/friends', UserMiddlware.validateGetUser, UserController.getFriends)
router.get('/users/search', UserMiddlware.validateSearchUser, UserController.searchUser)
router.delete('/users/:username', UserMiddlware.validateGetUser, UserController.deleteUser)
router.patch('/users/:username', UserMiddlware.validateUpdateUser, UserController.updateUser)
router.get('/users', UserMiddlware.validateSortUsers, UserController.sortUsers)

export default router;