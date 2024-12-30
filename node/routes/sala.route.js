import express from "express";
import { crearSala, borrarSala, verSalas, verSala, editarSala, verExposicionSala } from "../controllers/sala.controller.js";
import {
    checkNuevaSalaErrors,
  validatorExpress,
} from "../middlewares/validatorExpress.js";

const router = express.Router();

router.get("/", verSalas);
router.get("/:id", verSala);
router.get("/:sala_id/exposicion", verExposicionSala);
router.post("/", checkNuevaSalaErrors, validatorExpress, crearSala);
router.put("/:id", editarSala);
router.delete("/:id", borrarSala);

export default router;
