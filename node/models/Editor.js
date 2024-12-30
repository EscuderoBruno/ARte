import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Editor = sequelize.define('Editor', {
  nombre: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  contrasenya: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ultima_sesion: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  tableName: 'editor'
});

export default Editor;