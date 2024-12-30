import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Idioma = sequelize.define('Idioma', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  idioma: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  icono: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'idioma',
  timestamps: false
});

export default Idioma;