import express from "express";
import { getAllEstados, getEstadoById } from "../controllers/estado.controller.js";

const router = express.Router();

router.get("/", getAllEstados);
router.get("/:id", getEstadoById);


export default router;