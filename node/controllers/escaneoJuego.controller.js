import 'dotenv/config';
import EscaneoJuego from '../models/EscaneoJuego.js';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export const getFiltroEscaneosJuego = async (req, res) => { 
    try {
        // Definir opciones de búsqueda
        let options = {};

        // Obtener el año deseado del query string, por ejemplo, ?year=2024
        const año = req.query.year; // Obtener el año deseado del query string
        const mes = req.query.month; // Obtener el mes deseado del query string
        const semana = req.query.week; // Obtener la semana deseado del query string
        const dia = req.query.day; // Obtener el dia deseado del query string

        let values = Array(12).fill(0);
        let names = Array(12).fill(0);
        let title = String;
        
        if (año && mes && dia) {
        
            // Construir la fecha en formato YYYY-MM-DD
            const fechaSeleccionada = `${año}-${mes}-${dia}`;
        
            // Filtrar por el día específico
            options.where = {
                fecha: {
                    [Op.startsWith]: fechaSeleccionada // Filtrar por la fecha seleccionada
                }
            };
        } else if (año && mes && semana) {

            // Calcular la fecha de inicio y fin de la semana
            const fechaInicioSemana = new Date(año, mes-1, semana); // semana es el día de inicio
            const fechaFinSemana = new Date(fechaInicioSemana);
            fechaFinSemana.setDate(fechaFinSemana.getDate() + 6); // Obtener el séptimo día (7 días posteriores)

            // Filtrar por la semana
            options.where = {
                fecha: {
                    [Op.between]: [fechaInicioSemana, fechaFinSemana]
                }
            };

        } else if (año && mes) {
            // Filtrar por año y mes
            options.where = {
                fecha: {
                    [Op.and]: [
                        { [Op.startsWith]: `${año}-` },
                        { [Op.substring]: `-${mes}-` }
                    ]
                }
            };
        } else if (año) {
            // Filtrar solo por año
            options.where = {
                fecha: {
                    [Op.startsWith]: `${año}-`
                }
            };
        }

        // Obtener los escaneos de piezas según las opciones de búsqueda
        const escaneosJuegio = await EscaneoJuego.findAll(options);

        // Calcular el total de escaneos de pieza que cumplen con el filtro
        const total = escaneosJuegio.length;

        // ---------- Calcular el data de las gráficas -------------- //
        const meses = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
        if (año && mes && dia) {
            title = dia + " " + meses[mes-1] + " " + año;
            // Vector para almacenar el total de escaneos por hora (inicialmente todos son 0)
            values = Array(24).fill(0);
            names = [
                '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00',
                '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
                '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
            ];
            escaneosJuegio.forEach(escaneo => {
                const hora = new Date(escaneo.fecha).getHours();
                values[hora]++;
            });
        } else if (año && mes && semana) {
            const fechaInicioSemana = new Date(año, mes - 1, semana); // semana es el día de inicio
            const fechaFinSemana = new Date(fechaInicioSemana);
            fechaFinSemana.setDate(fechaFinSemana.getDate() + 6);
        
            if (fechaInicioSemana.getMonth() === fechaFinSemana.getMonth()) {
                title = semana + "-" + fechaFinSemana.getDate() + " " + meses[mes - 1] + " " + año;
            } else {
                const mesFinSemana = fechaFinSemana.getMonth() === 11 ? 0 : fechaFinSemana.getMonth(); // Evitar desbordamiento
                title = semana + " " + meses[mes - 1] + "-" + fechaFinSemana.getDate() + " " + meses[mesFinSemana] + " " + año;
            }
        
            values = Array(7).fill(0);
            names = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        
            escaneosJuegio.forEach(escaneo => {
                let diaSemana = new Date(escaneo.fecha).getDay();
                if (diaSemana === 0) {
                    diaSemana = 7;
                } else {
                    diaSemana--;
                }
                values[diaSemana]++;
            });
        } else if (año && mes) {
            const numeroEntero = parseInt(mes, 10);
            title = meses[numeroEntero-1] + " " + año;
            let daysInMonth;
            if (mes == 2) { // Si el mes es febrero (0-indexado)
                // Verificar si el año es bisiesto
                if ((año % 4 === 0 && año % 100 !== 0) || año % 400 === 0) {
                    daysInMonth = 29; // Febrero en un año bisiesto tiene 29 días
                } else {
                    daysInMonth = 28; // Febrero en un año no bisiesto tiene 28 días
                }
            } else {
                // Obtener el número de días en el mes para los otros meses
                daysInMonth = new Date(año, mes, 0).getDate();
            }
            // Vector para almacenar el total de escaneos por mes (inicialmente todos son 0)
            values = Array(daysInMonth).fill(0);
            names = Array.from({ length: daysInMonth }, (_, index) => (index + 1).toString());
            escaneosJuegio.forEach(escaneo => {
                const dia = new Date(escaneo.fecha).getDate()-1;
                values[dia]++;
            });
        } else if (año) {
            title = año;
            // Vector para almacenar el total de escaneos por mes (inicialmente todos son 0)
            values = Array(12).fill(0);
            names = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            escaneosJuegio.forEach(escaneo => {
                const month = new Date(escaneo.fecha).getMonth();
                values[month]++;
            });
        }    

        // Retornar los escaneos de piezas filtrados
        res.status(200).json({ values, names, title });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error al cargar los escaneos" });
    }
};

export const getAllEscaneosJuego = async (req, res) => { 
    try {

        // Definir opciones de paginación
        let options = {};
        const juego_id = req.query.juego_id;

        if (juego_id) {
            options.where = {
                juego_id: {
                    [Op.like]: `%${juego_id}%`,
                },
            };
        }

        const escaneos = await EscaneoJuego.findAll(options);

        // Calcular el total de escaneos de pieza que cumplen con el filtro
        const total = escaneos.length;

        res.status(200).json(escaneos);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error al cargar los escaneos juego" });
    }
};

export const getEscaneoJuegoById = async (req, res) => {
    try {
        const { id } = req.params;
        const estado = await EscaneoJuego.findByPk(id);

        if(!estado) {
            return res.status(404).json({ error: "Escaneo no encontrado" });
        }
        res.status(200).json(estado);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error al cargar el texto" });
    }
};

export const createEscaneoJuego = async (req, res) => {
    try {
        const escaneoJuego = req.body;
        const fechaActual = new Date();

        escaneoJuego.id = uuidv4();
        escaneoJuego.fecha = fechaActual;
        escaneoJuego.tiempo = 0;
        console.log(escaneoJuego);
        let newEscaneoJuego = await EscaneoJuego.create(escaneoJuego);
        res.status(201).json(newEscaneoJuego);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al crear el escaneo juego" });
    }
};

export const editarEscaneoJuego = async (req, res) => {
    try {
        const { id } = req.params;
        const { tiempo, finalizado, total_piezas } = req.body;

        await EscaneoJuego.update({ tiempo, finalizado, total_piezas }, {
            where: {
                id: id
            }
        });

        res.status(200).json({ msg: "El escaneo juego se ha actualizado correctamente." });
    } catch (error) {
        console.log(error);
        return res.status(409).json({ error });
    }
};