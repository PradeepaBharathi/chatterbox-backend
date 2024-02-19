import express from "express";
import {
  LoginUser,
  getAllUsers,
  registerUser,
  setAvatar,
} from "../Controllers/usersController.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", LoginUser);
router.post("/setAvatar/:id", setAvatar);
router.get("/allusers/:id",getAllUsers);
export default router;
