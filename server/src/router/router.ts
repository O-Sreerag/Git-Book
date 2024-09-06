import { Router } from "express";
import * as HealthController from "../controller/health-controller.js";
import * as UserController from "../controller/user-controller.js";
import * as UserMiddlware from "../middleware/user-middleware.js";

const router = Router();

// monitoring
router.get("/health", HealthController.health);

router.get("/user/:username", UserMiddlware.validateGetUser, UserController.getUser)
router.post('/users/:username/friends', UserMiddlware.validateGetUser, UserController.getFriends)
router.get('/users/search', UserMiddlware.validateSearchUser, UserController.searchUser)
router.delete('/users/:username', UserMiddlware.validateGetUser, UserController.deleteUser)
router.patch('/users/:username', UserMiddlware.validateUpdateUser, UserController.updateUser)
router.get('/users', UserMiddlware.validateSortUsers, UserController.sortUsers)

export default router;