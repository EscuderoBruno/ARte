import 'dotenv/config';
import Estado from "../models/Estado.js";
import { v4 as uuidv4 } from 'uuid';


export const getAllEstados = async (req, res) => { 
    try {
        const estados = await Estado.findAll();

        res.status(200).json(estados);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error al cargar los estados" });
    }
};

export const getEstadoById = async (req, res) => {
    try {
        const { id } = req.params;
        const estado = await Estado.findByPk(id);

        if(!estado) {
            return res.status(404).json({ error: "Estado no encontrado" });
        }
        res.status(200).json(estado);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error al cargar el texto" });
    }
};