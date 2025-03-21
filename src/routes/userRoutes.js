import { Router } from "express";
import {
  createUser,
  loginUser,
  logOutUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
} from "../controllers/userController.js";

// import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = Router();

router.post("/register", createUser); // basically registering  the  user
router.post("/login", loginUser);
router.get("/logout", logOutUser);

router.get("/users", getAllUsers);
router.get("/user/:id", getUserById);
router.put("/user/:id", updateUserById);
router.delete("/user/:id", deleteUserById);

export default router;
