import 'dotenv/config';
import Texto from "../models/Informacion.js";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

export const createTexto = async (req, res) => {
    try {
        const { nombre, texto_completo, texto_facil, pieza_id, idioma_id } = req.body;

        // Verificar si nombre es undefined o null, y asignarle un valor predeterminado en caso afirmativo
        const nombreValor = nombre !== undefined && nombre !== null ? nombre : '';

        const info = {
            id: req.id || uuidv4(),
            nombre: nombreValor,
            texto_completo,
            texto_facil,
            pieza_id,
            idioma_id,
            audio: req.audio || null,
        }

        const newTexto = await Texto.create(info);
        return res.status(201).json(newTexto);
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: "Error al crear el texto" /*error.message*/ });
    }
};

export const getAllTextos = async (req, res) => { 
    try {
        const textos = await Texto.findAll();

        res.status(200).json(textos);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error al cargar los textos" });
    }
};

export const getTextoById = async (req, res) => {
    try {
        const { id } = req.params;
        const texto = await Texto.findByPk(id);

        if(!texto) {
            return res.status(404).json({ error: "Texto no encontrado" });
        }
        res.status(200).json(texto);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error al cargar el texto" });
    }
};


export const updateTextoById = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, texto_completo, texto_facil, pieza_id, idioma_id, audio_delete } = req.body;

        const nuevoTexto = {
            nombre,
            texto_completo,
            texto_facil,
            pieza_id,
            idioma_id,
        }

        if(audio_delete === 'true'){
            nuevoTexto.audio = null;
        }

        if(req.audio){
            nuevoTexto.audio = req.audio;
        }

        const texto = await Texto.findByPk(id);

        if(!texto) {
            return res.status(404).json({ error: "Texto no encontrado" });
        }

        const path = texto.audio;

        const newTexto = await texto.update(nuevoTexto);

        console.log(nuevoTexto.audio, texto.audio, fs.existsSync(`./uploads/${path}`))

        if(nuevoTexto.audio === null && fs.existsSync(`./uploads/${path}`)){
            fs.unlinkSync(`./uploads/${path}`);
        }

        res.status(200).json(newTexto);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error al actualizar el texto" });
    }
};

export const deleteTextoById = async(req, res) => {
    try {
        const { id } = req.params;
        const texto = await Texto.findByPk(id);

        if(!texto) {
            return res.status(404).json({ error: "Texto no encontrado" });
        }
        
        if(texto.audio !== null && fs.existsSync(`./uploads/${texto.audio}`)){
            fs.unlinkSync(`./uploads/${texto.audio}`);
        }
        
        await texto.destroy();


        res.status(204).json(texto);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error al eliminar el texto: " + error.message});
    }
};

