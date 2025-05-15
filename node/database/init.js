import sequelize from "./connection.js";

import Editor from '../models/Editor.js';
import Estado from "../models/Estado.js";
import EscaneoJuego from "../models/EscaneoJuego.js";
import EscaneoPieza from "../models/EscaneoPieza.js";
import Exposicion from "../models/Exposicion.js";
import Juego from "../models/Juego.js";
import Pieza from "../models/Pieza.js";
import Pregunta from "../models/Pregunta.js";
import Sala from "../models/Sala.js";
import Informacion from "../models/Informacion.js";
import Test from "../models/Test.js";
import Idioma from "../models/Idioma.js";

// Aqui van las asociaciones
Pieza.hasMany(Informacion, {as: 'informacion', foreignKey: 'pieza_id' });
Informacion.belongsTo(Pieza, { foreignKey: 'pieza_id' });

Pieza.hasMany(EscaneoPieza, { foreignKey: 'pieza_id' });
EscaneoPieza.belongsTo(Pieza, { as: 'pieza' ,foreignKey: 'pieza_id' });

Pieza.hasMany(Pregunta, { foreignKey: 'pieza_id' });
Pregunta.belongsTo(Pieza, { as: 'pieza', foreignKey: 'pieza_id' });

Sala.hasMany(Pieza, { foreignKey: 'sala_id' });
Pieza.belongsTo(Sala, { as: 'sala', foreignKey: 'sala_id' });

Exposicion.hasMany(Sala, { foreignKey: 'exposicion_id' });
Sala.belongsTo(Exposicion, { as: 'exposicion', foreignKey: 'exposicion_id' });

Exposicion.hasMany(Juego, { foreignKey: 'exposicion_id' });
Juego.belongsTo(Exposicion, { as: 'exposicion', foreignKey: 'exposicion_id' });

Juego.hasMany(EscaneoJuego, { foreignKey: 'juego_id' });
EscaneoJuego.belongsTo(Juego, { as: 'juego', foreignKey: 'juego_id' });

Juego.hasMany(Pregunta, { foreignKey: 'juego_id' });
Pregunta.belongsTo(Juego, { as: 'juego', foreignKey: 'juego_id' });

Idioma.hasOne(Informacion, { foreignKey: 'idioma_id' });
Informacion.belongsTo(Idioma, { as: 'idioma', foreignKey: 'idioma_id' });

Estado.hasOne(Exposicion, { foreignKey: 'estado_id' });
Exposicion.belongsTo(Estado, { as: 'estado', foreignKey: 'estado_id' });

Estado.hasOne(Sala, { foreignKey: 'estado_id' });
Sala.belongsTo(Estado, { as: 'estado', foreignKey: 'estado_id' });

Estado.hasOne(Pieza, { foreignKey: 'estado_id' });
Pieza.belongsTo(Estado, { as: 'estado', foreignKey: 'estado_id' });

Estado.hasOne(Juego, { foreignKey: 'estado_id' });
Juego.belongsTo(Estado, { as: 'estado', foreignKey: 'estado_id' });

// Hook antes de sincronizar la base de datos
sequelize.beforeSync(async () => {
  // Código vacío de momento
});

// Sincroniza los modelos con la base de datos
(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Tablas sincronizadas");
  } catch (error) {
    console.error("Error al sincronizar tablas:", error);
  }
})();

// Hook después de sincronizar la base de datos
sequelize.afterSync(async () => {
  // Código vacío de momento
});