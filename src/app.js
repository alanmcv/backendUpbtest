require('dotenv').config();
const express = require('express');
const cors = require('cors');
const productoRoutes = require('./routes/producto.routes');
const categoriaRoutes = require('./routes/categoria.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API backendUpb funcionando');
});

app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes);

// Ruta no encontrada
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Errores de restricciones de PostgreSQL → respuesta clara para el cliente
// (código de error de pg: https://www.postgresql.org/docs/current/errcodes-appendix.html)
const erroresPg = {
    23505: [409, 'Ya existe una categoría con ese nombre'], // UNIQUE (categorias.nombre)
    23503: [400, 'La categoría indicada no existe'],     // FOREIGN KEY (productos.categoria_id)
    23514: [400, 'El precio y el stock no pueden ser negativos'], // CHECK
};

// Manejador de errores: HttpError usa su status, cualquier otro error es 500
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'JSON inválido' });
    }
    if (erroresPg[err.code]) {
        const [status, mensaje] = erroresPg[err.code];
        return res.status(status).json({ error: mensaje });
    }
    if (err.status) {
        return res.status(err.status).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
