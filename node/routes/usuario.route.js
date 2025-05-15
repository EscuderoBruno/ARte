import express from "express";
import { nuevoUsuario, obtenerUsuarios, obtenerTotalesUsuarios, actualizarUsuario } from "../controllers/usuario.controller.js";

const router = express.Router();

router.post("/", nuevoUsuario);
router.get("/", obtenerUsuarios);	
router.get("/indicadores", obtenerTotalesUsuarios);
router.put("/:id", actualizarUsuario);

export default router;
