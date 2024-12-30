import Idioma from '../models/Idioma.js'

export const obtenerIdiomas = async (req, res) => {
  try {
    const idiomas = await Idioma.findAll();
    res.status(200).json(idiomas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los idiomas." });
  }
}

export const obtenerIdioma = async (req, res) => {
  try {

    const { id } = req.params;

    const idioma = await Idioma.findByPk(id);
    res.status(200).json(idioma);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error al obtener el idioma." });
  }
}
