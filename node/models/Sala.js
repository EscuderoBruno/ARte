import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Sala = sequelize.define('Sala', {
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
  exposicion_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado_id: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'sala'
});

export default Sala;