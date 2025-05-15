import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const EscaneoJuego = sequelize.define('EscaneoJuego', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  usuario: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  tiempo: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  finalizado: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  total_piezas: {
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