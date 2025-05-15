import express from 'express';
import cors from 'cors';

import editorRoute from './routes/editor.route.js';
import piezasRoute from './routes/piezas.route.js';
import juegoRoute from './routes/juego.route.js';
import exposicionRoute from './routes/exposicion.route.js';
import textoRoute from './routes/texto.route.js';
import salaRoute from './routes/sala.route.js';
import testRoute from './routes/test.route.js';
import idiomaRoute from './routes/idioma.route.js';
import estadosRoute from './routes/estado.route.js';
import indicadoresRoute from './routes/indicadores.route.js';
import usuarioRoute from './routes/usuario.route.js';

import './database/init.js';

const app = express();

app.use(cors()); // Configuración del middleware de CORS

app.use('/api/uploads', express.static('./uploads'));
app.use(express.json());

const port = process.env.PORT || 3000;

app.use("/api/auth", editorRoute);
app.use("/api/juego", juegoRoute);
app.use("/api/exposicion", exposicionRoute);
app.use('/api/sala', salaRoute);
app.use("/api/piezas", piezasRoute);
app.use("/api/info", textoRoute);
app.use("/api/idioma", idiomaRoute);
app.use("/api/test", testRoute);
app.use("/api/estados", estadosRoute);
app.use("/api/indicadores", indicadoresRoute);
app.use("/api/usuario", usuarioRoute);

app.get('/api/', (req, res) => {
  res.send('¡Esta es la API del servidor de ARte! 🔙🔚👌');
});

app.listen(port, () => {
  console.log(`La aplicación está escuchando en el puerto ${port}`);
});
