import Juego from "../models/Juego.js";
import Pieza from "../models/Pieza.js";
import Informacion from "../models/Informacion.js";
import Exposicion from "../models/Exposicion.js";
import Pregunta from "../models/Pregunta.js";
import Idioma from "../models/Idioma.js";
import { Op, where } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import Estado from "../models/Estado.js";
import Sala from "../models/Sala.js";

// Método para crear un nuevo juego
export const crearJuego = async (req, res) => {
  try {
    const { nombre, descripcion, fecha, exposicion_id, estado_id, piezas } =
      req.body;
    console.log(req.body);

    // Verificar si la exposición asociada al juego existe
    const exposicion = await Exposicion.findByPk(exposicion_id);
    if (!exposicion) {
      return res
        .status(404)
        .json({ error: "La exposición asociada no existe" });
    }

    // Crear el juego con los datos proporcionados
    const nuevoJuego = await Juego.create({
      id: uuidv4(),
      nombre,
      descripcion,
      fecha: fecha || new Date(),
      exposicion_id,
      estado_id,
    });

    nuevoJuego.preguntas = [];

    piezas.forEach(async (pieza) => {
      const pregunta = await Pregunta.create({
        id: uuidv4(),
        pregunta: "",
        respuesta: "",
        pieza_id: pieza.id,
        juego_id: nuevoJuego.id,
      });
      nuevoJuego.preguntas.push(pregunta);
    });

    res.status(201).json({ juego: nuevoJuego });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el juego" });
  }
};

// Método para obtener la lista de juegos
export const getListaJuegos = async (req, res) => {
  try {
    const { nombre, exposicion, lim, pag } = req.query;
    const pagina = Number(pag) || 1;
    const limite = Number(lim) || 10;
    const offset = (pagina - 1) * limite;

    const filters = {};
    if (nombre) {
      filters.nombre = {
        [Op.like]: `%${nombre || ""}%`,
      };
    }
    if (exposicion) {
      filters.exposicion = {
        [Op.eq]: exposicion,
      };
    }

    const listaJuegos = await Juego.findAll({
      include: [
        { model: Exposicion, as: "exposicion" },
        { model: Estado, as: "estado" },
      ],
      limit: lim,
      offset: offset,
      where: filters,
    });

    res.status(200).json({ juegos: listaJuegos });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener la lista de juegos", error });
  }
};

// Método para obtener un juego por su ID
export const getJuegoById = async (req, res) => {
  try {
    const { id } = req.params;
    const juego = await Juego.findByPk(id, {
      include: [
        {
          model: Pregunta,
          include: [
            {
              model: Pieza,
              as: "pieza",
              include: [
                {
                  model: Informacion,
                  as: "informacion",
                  include: [
                    {
                      model: Idioma,
                      as: "idioma",
                    },
                  ],
                },
                {
                  model: Sala,
                  as: "sala",
                  include: [
                    {
                      model: Exposicion,
                      as: "exposicion",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    if (juego) {
      res.status(200).json(juego);
    } else {
      res.status(404).json({ error: "Juego no encontrado" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener el juego" });
  }
};

// Método para actualizar un juego por su ID
export const updateJuegoById = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, fecha, exposicion_id, estado_id, piezas } =
      req.body;
    console.log(req.body);

    // Verificar si la exposición asociada al juego existe
    const exposicion = await Exposicion.findByPk(exposicion_id);
    if (!exposicion) {
      return res
        .status(404)
        .json({ error: "La exposición asociada no existe" });
    }

    const juego = await Juego.findByPk(id);

    // Crear el juego con los datos proporcionados
    const nuevoJuego = await juego.update({
      nombre,
      descripcion,
      fecha: fecha || new Date(),
      exposicion_id,
      estado_id,
    });

    nuevoJuego.preguntas = [];

    await Pregunta.destroy({
      where: {
        juego_id: nuevoJuego.id,
      },
    });

    piezas.forEach(async (pieza) => {
      const pregunta = await Pregunta.create({
        id: uuidv4(),
        pregunta: "",
        respuesta: "",
        pieza_id: pieza.id,
        juego_id: nuevoJuego.id,
      });
      nuevoJuego.preguntas.push(pregunta);
    });

    res.status(201).json({ juego: nuevoJuego });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el juego" });
  }
};

// Método para eliminar un juego por su ID
export const deleteJuegoById = async (req, res) => {
  try {
    const { id } = req.params;
    const numDeleted = await Juego.destroy({
      where: { id },
    });

    if (numDeleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Juego no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el juego" });
  }
};
