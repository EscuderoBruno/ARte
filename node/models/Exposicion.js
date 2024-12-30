import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Exposicion = sequelize.define('Exposicion', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  autores: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fecha_inicio: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  fecha_fin: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  imagen: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  estado_id: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  
  tableName: 'exposicion'
});

export default Exposicion;