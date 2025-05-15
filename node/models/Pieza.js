import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Pieza = sequelize.define('Pieza', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  pictograma: {
    type: DataTypes.STRING,
    allowNull: true
  },
  modelo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  imagen: {
    type: DataTypes.STRING,
    allowNull: true
  },
  textura: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sala_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado_id: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'pieza'
});

export default Pieza;