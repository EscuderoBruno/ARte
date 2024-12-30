import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const EscaneoJuego = sequelize.define('EscaneoJuego', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  tiempo: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  valoracion: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  juego_id: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'escaneo_juego'
});

export default EscaneoJuego;