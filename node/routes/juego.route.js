import express from "express";
import { crearJuego, getListaJuegos, getJuegoById, updateJuegoById, deleteJuegoById } from "../controllers/juego.controller.js";
import { checkJuegoErrors, validatorExpress } from "../middlewares/validatorExpress.js";
import { validateToken } from "../middlewares/validarToken.js";

const router = express.Router();

// Rutas para las operaciones CRUD de juegos
router.post("/", validateToken, checkJuegoErrors, validatorExpress, crearJuego); // Corregido el orden de los middlewares
router.get("/", getListaJuegos);
router.get("/:id", getJuegoById);
router.put("/:id", validateToken, checkJuegoErrors, validatorExpress, updateJuegoById); // Corregido el orden de los middlewares
router.delete("/:id", validateToken, deleteJuegoById);

export default router;
