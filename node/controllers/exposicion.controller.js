import Exposicion from "../models/Exposicion.js";
import { Op } from 'sequelize';
import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from "path";

export const createExposicion = async (req, res) => {
  try {
    const { nombre, autores, descripcion, fecha_inicio, fecha_fin, estado_id } = req.body;

    const nuevaExposicion = await Exposicion.create({
      id: req.id || uuidv4(),
      nombre,
      autores,
      descripcion,
      fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : new Date(),
      fecha_fin: fecha_fin ? new Date(fecha_fin) : null,
      imagen: req.imagen,
      estado_id
    });

    res.status(201).json(nuevaExposicion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la exposición." });
  }
};

export const getAllExposiciones = async (req, res) => {
  try {
    const { nombre, desde, hasta } = req.query;
    let exposiciones;

    // Definir opciones de paginación
    let options = {};

    if (nombre) {
      options.where = {
          nombre: {
              [Op.like]: `%${nombre}%`,
          },
      };
    }

    // Aplicar paginación si se proporcionan los parámetros desde y hasta
    if (desde && hasta) {
      options.offset = parseInt(desde)-1;
      options.limit = parseInt(hasta) - parseInt(desde) + 1;
    }

    exposiciones = await Exposicion.findAll(options);

    res.status(200).json(exposiciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las exposiciones." });
  }
};

export const getExposicionById = async (req, res) => {
  try {
    const { id } = req.params;
    const exposicion = await Exposicion.findByPk(id);

    if (!exposicion) {
      return res.status(404).json({ error: "Exposición no encontrada." });
    }

    res.status(200).json(exposicion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener la exposición." });
  }
};

export const updateExposicionById = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, autores, descripcion, fecha_inicio, fecha_fin, estado_id, imagen_delete } = req.body;

    const exposicion = await Exposicion.findByPk(id);

    if (!exposicion) {
      return res.status(404).json({ error: "Exposición no encontrada." });
    }

    const nuevaExpo = {
      nombre,
      autores,
      descripcion,
      fecha_inicio,
      fecha_fin,
      estado_id,
      imagen: req.imagen
    }

    if(imagen_delete === 'true'){
      nuevaExpo.imagen = null;
      if(fs.existsSync(`./uploads/${exposicion.imagen}`)){
        fs.unlinkSync(`./uploads/${exposicion.imagen}`);
      }
    }

    await exposicion.update(nuevaExpo);

    res.status(200).json(exposicion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la exposición." });
  }
};

export const deleteExposicionById = async (req, res) => {
  try {
    const { id } = req.params;
    const exposicion = await Exposicion.findByPk(id);

    if (!exposicion) {
      return res.status(404).json({ error: "Exposición no encontrada." });
    }

    await exposicion.destroy();
    if (exposicion.imagen != null) {
      fs.unlinkSync(path.join('./uploads/', exposicion.imagen));
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar la exposición." });
  }
};
