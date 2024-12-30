import express from "express";
import { login, register, refreshToken, logout, getData, loginWithGoogle } from "../controllers/editor.controller.js";
import { validatorExpress, checkLoginErrors, checkRegisterErrors } from "../middlewares/validatorExpress.js";
import { validateToken } from "../middlewares/validarToken.js";

const router = express.Router();

router.post("/login", checkLoginErrors, validatorExpress, login);
router.post("/googlelogin", loginWithGoogle);
router.get("/logout", logout);	
router.post("/register", checkRegisterErrors, validatorExpress, register);
router.get("/refresh", refreshToken);
router.get("/editor", validateToken, getData);

export default router;
