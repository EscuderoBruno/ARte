import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Estado = sequelize.define('Estado', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }
}, {
  tableName: 'estado',
  timestamps: false
});

export default Estado;