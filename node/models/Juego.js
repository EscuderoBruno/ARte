import sequelize from '../database/connection.js'
import { DataTypes } from 'sequelize';

// Define la estructura del modelo Juego
// Asegúrate de que esté definida correctamente según tu base de datos
const Juego = sequelize.define(
  'Juego',
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    tableName: 'juego',
    timestamps: true, // Opcional, dependiendo de tus necesidades
  }
);

export default Juego;
