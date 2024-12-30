import express from "express";
import { obtenerIdioma, obtenerIdiomas } from "../controllers/idioma.controller.js";
import { validatorExpress } from "../middlewares/validatorExpress.js";

const router = express.Router();
router.get("/", obtenerIdiomas);
router.get("/:id", obtenerIdioma);

export default router;
