import Editor from "../models/Editor.js";
import bcrypt from "bcrypt";
import {
  generateToken,
  generateRefreshToken,
} from "../helpers/generarToken.js";
import "dotenv/config";

export const login = async (req, res) => {
  try {
    const { nombre, correo, contrasenya } = req.body;
    let editor = await Editor.findByPk(nombre);
    if (editor) {
      const password_valid = await bcrypt.compare(
        contrasenya,
        editor.contrasenya
      );
      if (!password_valid) {
        throw new Error("Nombre o contraseña incorrectos.");
      }

      const { token, expiresIn } = generateToken(nombre);
      generateRefreshToken(editor.id, res);

      editor.dataValues.token = token;
      editor.dataValues.expiresIn = expiresIn;

      const fechaActual = new Date();

      await Editor.update(
        { ultima_sesion: fechaActual },
        {
          // Actualizar solo la variable ultima_sesion
          where: {
            nombre: editor.nombre,
          },
        }
      );

      return res.status(202).json(editor.dataValues);
    } else {
      throw new Error("El editor no existe en la base de datos.");
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: error.message });
  }
};

export const loginWithGoogle = async (req, res) => {
  try {
    const { email } = req.body;
    const editor = await Editor.findOne({ where: { correo: email } });

    if (editor) {
      const { token, expiresIn } = generateToken(editor.dataValues.nombre);
      generateRefreshToken(editor.id, res);

      editor.dataValues.token = token;
      editor.dataValues.expiresIn = expiresIn;

      const fechaActual = new Date();

      await editor.update({ ultima_sesion: fechaActual });

      return res.status(200).json(editor.dataValues);
    } else {
      return res.status(401).json({
        error:
          "Este usuario no esta en la lista de usuarios permitidos de la db.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { nombre, correo, contrasenya } = req.body;

    let editorExist = await Editor.findByPk(nombre);

    if (editorExist) {
      throw new Error("El editor ya existe.");
    }

    const salt = await bcrypt.genSalt(10);
    var editor = {
      nombre,
      correo,
      contrasenya: await bcrypt.hash(contrasenya, salt),
    };

    let newEditor = await Editor.create(editor);

    const { token, expiresIn } = generateToken(nombre);
    generateRefreshToken(newEditor.nombre, res);

    newEditor.token = token;
    newEditor.expiresIn = expiresIn;

    res.status(201).json(newEditor);
  } catch (error) {
    console.log(error);
    return res.status(403).json({ error: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("refreshToken");
  return res.json({ ok: true });
};

export const refreshToken = (req, res) => {
  try {
    let refreshTokenCookie = req.cookies?.refreshToken;
    if (!refreshTokenCookie) throw new Error("No existe el refreshToken");

    const { id } = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);

    const { token, expiresIn } = generateToken(id);

    return res.json({ token, expiresIn });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: error });
  }
};

export const getData = async (req, res) => {
  try {
    const editorId = req.uid;
    console.log(editorId);
    let editor = await Editor.findByPk(editorId);
    if (editor) {
      return res.status(202).json(editor);
    } else {
      throw new Error("El editor no existe en la base de datos.");
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: error.message });
  }
};
