import express from "express";
import { createEscaneoPieza, editarEscaneoPieza, getAllEscaneosPieza, getEscaneoPiezaById, getFiltroEscaneosPieza } from "../controllers/escaneoPieza.controller.js";
import { validateToken } from "../middlewares/validarToken.js";
import { validatorExpress } from "../middlewares/validatorExpress.js";

const router = express.Router();

router.post("/escaneoPieza/", validateToken, validatorExpress , createEscaneoPieza);
router.get("/escaneoPieza", getAllEscaneosPieza);
router.get("/escaneoPieza/filtro", getFiltroEscaneosPieza);
router.get("/escaneoPieza/:id", getEscaneoPiezaById);
router.put("/escaneoPieza/:id", editarEscaneoPieza);

export default router;