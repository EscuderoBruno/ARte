import express from "express";
import { createEscaneoPieza, editarEscaneoPieza, getAllEscaneosPieza, getEscaneoPiezaById, getFiltroEscaneosPieza, obtenerUsoIdiomas } from "../controllers/escaneoPieza.controller.js";
import { createEscaneoJuego, editarEscaneoJuego, getAllEscaneosJuego, getEscaneoJuegoById, getFiltroEscaneosJuego } from "../controllers/escaneoJuego.controller.js";
import { validateToken } from "../middlewares/validarToken.js";
import { validatorExpress } from "../middlewares/validatorExpress.js";

const router = express.Router();

// Pieza
router.post("/escaneoPieza/", validateToken, validatorExpress , createEscaneoPieza);
router.get("/escaneoPieza", getAllEscaneosPieza);
router.get("/escaneoPieza/idiomas", obtenerUsoIdiomas);
router.get("/escaneoPieza/filtro", getFiltroEscaneosPieza);
router.get("/escaneoPieza/:id", getEscaneoPiezaById);
router.put("/escaneoPieza/:id", editarEscaneoPieza);
// Juego
router.post("/escaneoJuego/", validateToken, validatorExpress , createEscaneoJuego);
router.get("/escaneoJuego", getAllEscaneosJuego);
router.get("/escaneoJuego/filtro", getFiltroEscaneosJuego);
router.get("/escaneoJuego/:id", getEscaneoJuegoById);
router.put("/escaneoJuego/:id", editarEscaneoJuego);

export default router;