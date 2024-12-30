import express from "express";
import { createExposicion,getAllExposiciones ,getExposicionById ,updateExposicionById ,deleteExposicionById } from "../controllers/exposicion.controller.js";
import { verSalasPorExposicionId } from "../controllers/sala.controller.js";
import { validatorExpress,checkExpoErrors } from "../middlewares/validatorExpress.js";
import { validateToken } from "../middlewares/validarToken.js";
import upload from "../middlewares/subirFichero.js";

const router = express.Router();

router.post("/", validateToken, upload.single('imagen'), checkExpoErrors, validatorExpress ,createExposicion);
router.get("/", validateToken ,getAllExposiciones);
router.get("/:id", validateToken, getExposicionById);
router.get("/:exposicion_id/salas", validateToken, verSalasPorExposicionId);
router.put("/:id", validateToken, upload.single('imagen'), checkExpoErrors, validatorExpress, updateExposicionById);
router.delete("/:id",deleteExposicionById);

export default router;
