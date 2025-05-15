import express from "express";
import { crearPieza, getAllPiezas, getListaPiezas, getPiezaById, updatePiezaById, deletePiezaById, getInfoPieza } from "../controllers/piezas.controller.js";
import { validatorExpress,checkPiezaErrors } from "../middlewares/validatorExpress.js";
import { validateToken } from "../middlewares/validarToken.js";
import upload from "../middlewares/subirFichero.js";

const router = express.Router();

router.post("/", validateToken, upload.fields([
    { name: 'imagen', maxCount: 1 },
    { name: 'modelo', maxCount: 1 },
    { name: 'pictograma', maxCount: 1 },
    { name: 'textura', maxCount: 1 }
]), checkPiezaErrors, validatorExpress, crearPieza);
router.get("/", getAllPiezas);
router.get("/lista/:id", getListaPiezas);
router.get("/info/:id/:idioma", getInfoPieza);
router.get("/:id", getPiezaById);
router.put("/:id", upload.fields([
    { name: 'imagen', maxCount: 1 },
    { name: 'modelo', maxCount: 1 },
    { name: 'pictograma', maxCount: 1 },
    { name: 'textura', maxCount: 1 }
]), checkPiezaErrors, validatorExpress, updatePiezaById);
router.delete("/:id", validateToken, deletePiezaById);


export default router;
