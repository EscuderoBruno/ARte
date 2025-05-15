import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  adulto: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    unique: true,
  },
  niño: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  ultima_sesion: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  tableName: 'usuario'
});

export default Usuario;