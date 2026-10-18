const HttpError = require('./http-error');

// Convierte un id que llega como texto (URL o query) a número y rechaza lo que no sea un entero positivo
const validarId = (valor, campo = 'id') => {
    const numero = Number(valor);
    if (!Number.isInteger(numero) || numero <= 0) throw new HttpError(400, `El ${campo} debe ser un entero positivo`);
    return numero;
};

module.exports = validarId;
