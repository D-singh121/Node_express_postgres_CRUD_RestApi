import { Router } from "express";

const router = Router();


router.post("/user", createUser); // basically registering  the  user
router.post("/login", loginUser);
router.get("/logout", logoutUser);

router.get("/users", getAllUser);
router.get("/user/:id", getUserById);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

export default router;
