import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Pregunta = sequelize.define('Pregunta', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  pregunta: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  respuesta: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pieza_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  juego_id: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'pregunta'
});

export default Pregunta;