import { validationResult, body, param } from "express-validator";

export const validatorExpress = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  next();
};

export const checkLoginErrors = [
  body("nombre").trim().notEmpty().withMessage("El nombre no puede estar vacío."),
  body("contrasenya").trim().notEmpty().withMessage("La contraseña no puede estar vacía."),
];

export const checkRegisterErrors = [
  body("nombre").trim().notEmpty().withMessage("El nombre no puede estar vacío."),
  body("correo").trim().notEmpty().withMessage("El email no puede estar vacío."),
  body("contrasenya").trim().notEmpty().withMessage("La contraseña no puede estar vacía."),
];

export const checkJuegoErrors = [
  body("nombre").trim().notEmpty().withMessage("El nombre del juego no puede estar vacío."),
];

export const checkExpoErrors = [
  body("nombre").trim().notEmpty().withMessage("El nombre de la exposición no puede estar vacío."),
];

export const checkNuevaSalaErrors = [
  body("nombre").trim().notEmpty().withMessage("El nombre de la sala no puede estar vacío."),
  body("exposicion_id").trim().notEmpty().withMessage("La exposición de la sala no puede estar vacía."),
];

export const checkParamId = [
  param("id").trim().notEmpty().withMessage("El id pasado por parámetro no es válido."),
];

export const checkPiezaErrors = [
  body("sala_id").trim().notEmpty().withMessage("Se debe pasar el atributo sala_id."),
  body("estado_id").trim().notEmpty().withMessage("Se debe pasar el atributo estado_id."),
];

export const checkTextoErrors = [
  body("pieza_id").trim().notEmpty().withMessage("Se debe especificar una pieza."),
  body("idioma_id").trim().notEmpty().withMessage("Se debe especificar un idioma."),
];
