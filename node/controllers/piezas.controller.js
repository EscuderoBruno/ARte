import "dotenv/config";
import Pieza from "../models/Pieza.js";
import Idioma from "../models/Idioma.js";
import Informacion from "../models/Informacion.js";
import { Op, QueryTypes } from "sequelize";
import sequelize from "../database/connection.js";
import { subirFichero } from "../helpers/subirFichero.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

export const crearPieza = async (req, res) => {
  try {
    const { sala_id, estado_id } = req.body;

    const pieza = {
      id: req.id || uuidv4(),
      imagen: req.imagen || null,
      pictograma: req.pictograma || null,
      modelo: req.modelo || null,
      textura: req.textura || null,
      sala_id,
      estado_id,
    };

    const newPieza = await Pieza.create(pieza);

    return res.status(201).json(newPieza);
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Error al crear la pieza" });
  }
};

export const getListaPiezas = async (req, res) => {
  const idioma_id = req.params.id;
  const { nombre, sala, lim, pag } = req.query;

  console.log("Params: ", { nombre, sala, lim, pag });

  let filtros = [];
  if (nombre) {
    filtros.push(`i.nombre LIKE '%${nombre}%'`);
  }
  if (sala && sala != 0) {
    filtros.push(`s.id = '${sala}'`);
  }

  let pagina = Number(pag) || 1;
  let limite = Number(lim) || 10;

  const offset = (pagina - 1) * limite;

  const filtroWhere =
    filtros.length > 0 ? `WHERE ${filtros.join(" AND ")}` : "";

  try {
    
    const piezas = await sequelize.query(
      `SELECT p.imagen, p.id, i.nombre, i.texto_completo, i.texto_facil, s.id as sala_id, s.nombre as sala_nombre, p.estado_id as estado_id, e.id as exposicion_id, e.nombre as exposicion_nombre FROM pieza AS p LEFT JOIN informacion AS i ON p.id = i.pieza_id AND i.idioma_id = :idioma LEFT JOIN sala AS s ON p.sala_id = s.id LEFT JOIN exposicion AS e ON s.exposicion_id = e.id ${filtroWhere} LIMIT :limite OFFSET :offset`,
      {
        replacements: {
          idioma: idioma_id,
          limite: Number(limite),
          offset: Number(offset),
        },
        type: QueryTypes.SELECT,
      }
    );

    const count = await Pieza.count();

    const pagination = {
      pagina,
      desde: (pagina - 1) * limite + 1,
      hasta: count < pagina * limite ? count : pagina * limite,
      total: count,
      totalPag: Math.ceil(count / limite),
    };
    res.status(200).json({ piezas, pagination });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ msg: "Error al cargar las piezas:", error });
  }
};

export const getAllPiezas = async (req, res) => {
  try {
    const { nombre, sala } = req.query;

    let options = {
      where: {},
    };

    if (nombre) {
      options.where.nombre = {
        [Op.like]: `%${nombre}%`,
      };
    }

    if (sala) {
      options.where.SalaId = {
        [Op.eq]: sala,
      };
    }

    const piezas = await Pieza.findAll(options);

    res.status(200).json(piezas);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error al cargar las piezas" });
  }
};

export const getPiezaById = async (req, res) => {
  try {
    const { id } = req.params;
    const pieza = await Pieza.findByPk(id, {
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
      ],
    });

    if (!pieza) {
      return res.status(404).json({ error: "Pieza no encontrada" });
    }

    // console.log(pieza.dataValues);

    // const informacionModel = await Informacion.findAll({
    //   where: {
    //     pieza_id: {
    //       [Op.eq]: id,
    //     },
    //   },
    // });

    // const informacion = [];
    // informacionModel.forEach((infoModel) => {
    //   informacion.push(infoModel.dataValues);
    // });

    // const data = pieza.dataValues;
    // data.informacion = informacion;

    res.status(200).json(pieza);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error al cargar la pieza" });
  }
};

export const updatePiezaById = async (req, res) => {
  try {
    const {
      sala_id,
      estado_id,
      imagen_delete,
      textura_delete,
      pictograma_delete,
      modelo_delete,
    } = req.body;

    const nuevaPieza = {
      sala_id,
      estado_id,
    };

    if (imagen_delete === "true") {
      nuevaPieza.imagen = null;
    }
    if (req.imagen) {
      nuevaPieza.imagen = req.imagen;
    }
    if (textura_delete === "true") {
      nuevaPieza.textura = null;
    }
    if (req.textura) {
      nuevaPieza.textura = req.textura;
    }
    if (pictograma_delete === "true") {
      nuevaPieza.pictograma = null;
    }
    if (req.pictograma) {
      nuevaPieza.pictograma = req.pictograma;
    }

    if (modelo_delete === "true") {
      nuevaPieza.modelo = null;
    }
    if (req.modelo) {
      nuevaPieza.modelo = req.modelo;
    }

    const { id } = req.params;

    const pieza = await Pieza.findByPk(id);

    const piece = pieza;

    if (!pieza) {
      return res.status(404).json({ error: "Pieza no encontrada" });
    }
    
    if (
      imagen_delete &&
      fs.existsSync(`./uploads/${piece.imagen}`)
    ) {
      fs.unlinkSync(`./uploads/${piece.imagen}`);
    }
    if (
      textura_delete &&
      fs.existsSync(`./uploads/${piece.textura}`)
    ) {
      fs.unlinkSync(`./uploads/${piece.textura}`);
    }
    if (
      pictograma_delete &&
      fs.existsSync(`./uploads/${piece.pictograma}`)
    ) {
      fs.unlinkSync(`./uploads/${piece.pictograma}`);
    }
    if (
      modelo_delete &&
      fs.existsSync(`./uploads/${piece.modelo}`)
    ) {
      fs.unlinkSync(`./uploads/${piece.modelo}`);
    }

    const newPieza = await pieza.update(nuevaPieza);

    console.log(piece, nuevaPieza, newPieza)


    console.log(newPieza);

    return res.status(201).json(newPieza);
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Error al crear la pieza" });
  }
};

export const deletePiezaById = async (req, res) => {
  try {
    const { id } = req.params;
    const pieza = await Pieza.findByPk(id);

    if (!pieza) {
      return res.status(404).json({ error: "Pieza no encontrada" });
    }

    console.log(pieza, fs.existsSync(`./uploads/${pieza.textura}`))

    if (fs.existsSync(`./uploads/${pieza.imagen}`)) {
      fs.unlinkSync(`./uploads/${pieza.imagen}`);
    }
    if (fs.existsSync(`./uploads/${pieza.textura}`)) {
      fs.unlinkSync(`./uploads/${pieza.textura}`);
    }
    if (
      fs.existsSync(`./uploads/${pieza.pictograma}`)
    ) {
      fs.unlinkSync(`./uploads/${pieza.pictograma}`);
    }
    if (fs.existsSync(`./uploads/${pieza.modelo}`)) {
      fs.unlinkSync(`./uploads/${pieza.modelo}`);
    }

    await pieza.destroy();

    res.status(204).json(pieza);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Error al eliminar la pieza: " + error.message });
  }
};

export const getInfoPieza = async (req, res) => {
  try {
    const { id, idioma } = req.params;
    const info = await Informacion.findOne({
      where: {
        pieza_id: id,
        idioma_id: idioma,
      },
    });

    if (!info) {
      return res
        .status(404)
        .json({ error: "Informacion de pieza no encontrada" });
    }
    res.status(200).json(info);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Error al cargar la informacion de pieza" });
  }
};

export const obtenerTotalYDiferenciaPiezasMeses = async (req, res) => {
  try {
    // Obtener la fecha actual y el mes actual
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1; // Se suma 1 porque los meses son indexados desde 0

    // Calcular el primer día del mes actual
    const primerDiaMesActual = new Date(
      fechaActual.getFullYear(),
      mesActual - 1,
      1
    ); // Se resta 1 porque los meses son indexados desde 0

    // Calcular el primer día del mes pasado
    let primerDiaMesPasado;
    if (mesActual === 1) {
      // Si el mes actual es enero, el mes pasado es diciembre del año anterior
      primerDiaMesPasado = new Date(fechaActual.getFullYear() - 1, 11, 1);
    } else {
      primerDiaMesPasado = new Date(
        fechaActual.getFullYear(),
        mesActual - 2,
        1
      ); // Resta 2 para obtener el mes pasado
    }

    // Obtener el total de piezas creadas durante el mes actual
    const piezasMesActual = await Pieza.count({
      where: {
        createdAt: {
          $gte: primerDiaMesActual, // Mayor o igual que el primer día del mes actual
          $lt: fechaActual, // Menor que la fecha actual (hasta el día de hoy)
        },
      },
    });

    // Obtener el total de piezas creadas durante el mes pasado
    const piezasMesPasado = await Pieza.count({
      where: {
        createdAt: {
          $gte: primerDiaMesPasado, // Mayor o igual que el primer día del mes pasado
          $lt: primerDiaMesActual, // Menor que el primer día del mes actual
        },
      },
    });

    // Calcular la diferencia en el total de piezas entre el mes actual y el mes pasado
    const diferenciaTotalPiezas = piezasMesActual - piezasMesPasado;

    // Enviar el total y la diferencia como respuesta
    res
      .status(200)
      .json({ total: piezasMesActual, diferencia: diferenciaTotalPiezas });
  } catch (error) {
    console.error(
      "Error al obtener el total y la diferencia en el total de piezas entre meses:",
      error
    );
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
