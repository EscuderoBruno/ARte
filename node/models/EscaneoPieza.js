import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const EscaneoPieza = sequelize.define('EscaneoPieza', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  tiempo: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  motor_grafico: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  audio: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  idioma: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pieza_id: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'escaneo_pieza'
});

export default EscaneoPieza;