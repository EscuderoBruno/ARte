import express from "express";
import { createTexto, getAllTextos, getTextoById, updateTextoById, deleteTextoById } from "../controllers/texto.controller.js";
import { validatorExpress, checkTextoErrors, checkParamId } from "../middlewares/validatorExpress.js";
import upload from "../middlewares/subirFichero.js";

const router = express.Router();

router.post("/", upload.single('audio'), checkTextoErrors, validatorExpress, createTexto);
router.get("/", getAllTextos);
router.get("/:id", getTextoById);
router.put("/:id", upload.single('audio'), checkTextoErrors, validatorExpress, updateTextoById);
router.delete("/:id", deleteTextoById);


export default router;