import Sala from "../models/Sala.js";
import Exposicion from "../models/Exposicion.js";
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export const verSalas = async (req, res) => {
    try {
        const { nombre, desde, hasta, exposicion_id } = req.query;
        let salas;

        // Definir opciones de paginación
        let options = {};

        if (nombre) {
            options.where = {
                nombre: {
                    [Op.like]: `%${nombre}%`,
                },
            };
        }

        if (exposicion_id) {
            // Si ya hay una condición 'where', agregamos la nueva condición con 'and'
            if (options.where) {
                options.where.exposicion_id = {
                    [Op.like]: `%${exposicion_id}%`,
                };
            } else {
                options.where = {
                    exposicion_id: {
                        [Op.like]: `%${exposicion_id}%`,
                    },
                };
            }
        }

        // Aplicar paginación si se proporcionan los parámetros desde y hasta
        if (desde && hasta) {
            options.offset = parseInt(desde)-1;
            options.limit = parseInt(hasta) - parseInt(desde) + 1;
        }

        // Buscar las salas según las opciones
        salas = await Sala.findAll(options);

        res.status(200).json(salas);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error });
    }
};

export const verSala = async (req, res) => {
    try {
        const { id } = req.params;
        let sala = await Sala.findByPk(id);
        res.status(200).json(sala);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error });
    }
};

export const verSalasPorExposicionId = async (req, res) => {
    try {
        const { exposicion_id } = req.params;
        const salas = await Sala.findAll({
            where: {
                exposicion_id: exposicion_id
            }
        });
        res.status(200).json(salas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener las salas de la exposición." });
    }
};

export const verExposicionSala = async (req, res) => {
    try {
        const { sala_id } = req.params;
        const sala = await Sala.findByPk(sala_id);

        if (!sala) {
            return res.status(404).json({ error: "La sala no existe." });
        }

        const exposicion = await Exposicion.findByPk(sala.exposicion_id);

        if (!exposicion) {
            return res.status(404).json({ error: "La exposición asociada a la sala no existe." });
        }

        res.status(200).json(exposicion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener la exposición de la sala." });
    }
};

export const crearSala = async (req, res) => {
    try {
        const sala = req.body;
        sala.id = uuidv4();
        console.log(sala);
        let nuevaSala = await Sala.create(sala);

        res.status(201).json(nuevaSala);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error });
    }
};

export const editarSala = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, exposicion_id, estado_id } = req.body;

        await Sala.update({ nombre, descripcion, exposicion_id, estado_id }, {
            where: {
                id: id
            }
        });

        res.status(200).json({ msg: "La sala se ha actualizado correctamente." });
    } catch (error) {
        console.log(error);
        return res.status(409).json({ error });
    }
};

export const borrarSala = async (req, res) => {
    try {
        const { id } = req.params;
        const sala = await Sala.findByPk(id);

        if (!sala) return res.status(404).json({ error: "La sala que deseas borrar no existe." });

        await Sala.destroy({
            where: {
                id: sala.get('id')
            }
        });

        return res.json({ msg: "La sala fue borrada con éxito." });
    } catch (error) {
        console.log(error);
        return res.status(409).json({ error });
    }
};
