import { Sequelize } from "sequelize";
import 'dotenv/config';

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "mariadb",
});

(async () =>{
    try {
      await sequelize.authenticate();
      console.log("Conexión a la base de datos correcta.");
    } catch (error) {
      console.error("Error al intentar conectar con la base de datos.", error);
    }
})();


export default sequelize;