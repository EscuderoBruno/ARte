import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Test = sequelize.define('Test', {
  msg: {
    type: DataTypes.STRING,
    primaryKey: true,
  }
}, {
  timestamps: false,
  tableName: 'test'
});

export default Test;