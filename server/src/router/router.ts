import { Router } from "express";
import * as HealthController from "../controller/health-controller.js";
import * as UserController from "../controller/user-controller.js";

const router = Router();

// monitoring
router.get("/health", HealthController.health);

router.get("/user/:username", UserController.getUser)
router.post('/users/:username/friends', UserController.getFriends)
router.get('/users/:username', UserController.searchUser)
router.delete('/users/:username', UserController.deleteUser)
router.patch('/users/:username', UserController.updateUser)
router.get('/users', UserController.sortUser)

export default router;