import Usuario from "../models/Usuarios.js";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { generateToken, generateRefreshToken } from "../helpers/generarToken.js";
import 'dotenv/config';

export const nuevoUsuario = async (req, res) => {
    try {
        
        const usuario = req.body;

        usuario.id = uuidv4();

        let newUsuario = await Usuario.create(usuario);

        res.status(201).json(newUsuario);
    } catch (error) {
        console.log(error);
        return res.status(403).json({ error: error.message });
    }
};

export const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        const totalUsuarios = usuarios.length;
        res.status(200).json({ usuarios, total: totalUsuarios });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los usuarios." });
    }
}

export const obtenerTotalesUsuarios = async (req, res) => {
    try {
        const totalAdultos = await Usuario.count({ where: { adulto: true } });
        const totalNinos = await Usuario.count({ where: { niño: true } });
        
        const data = {
            values: [totalAdultos, totalNinos],
            names: ['Adultos', 'Niños']
        };

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los totales de usuarios." });
    }
};

export const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID del usuario a actualizar
        const newData = req.body; // Obtener los nuevos datos del usuario desde el cuerpo de la solicitud

        // Actualizar el usuario en la base de datos
        const usuarioActualizado = await Usuario.update(newData, {
            where: { id }
        });

        // Verificar si se actualizó correctamente
        if (usuarioActualizado[0] === 1) {
            // Usuario actualizado correctamente
            res.status(200).json({ message: "Usuario actualizado correctamente" });
        } else {
            // No se pudo encontrar el usuario para actualizar
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el usuario" });
    }
};


