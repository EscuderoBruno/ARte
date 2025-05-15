import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Informacion = sequelize.define('Informacion', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  texto_completo: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  texto_facil: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  audio: {
    type: DataTypes.STRING,
    allowNull: true
  },
  pieza_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idioma_id: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'informacion'
});

export default Informacion;