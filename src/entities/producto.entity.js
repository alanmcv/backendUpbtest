class Producto {
    constructor({ id, nombre, descripcion, precio, stock, categoriaId, categoriaNombre, createdAt, updatedAt }) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = Number(precio); // NUMERIC llega como texto desde pg
        this.stock = Number(stock);
        this.categoriaId = categoriaId;
        this.categoriaNombre = categoriaNombre;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static fromRow(row) {
        if (!row) return null;
        return new Producto({
            id: row.id,
            nombre: row.nombre,
            descripcion: row.descripcion,
            precio: row.precio,
            stock: row.stock,
            categoriaId: row.categoria_id,
            categoriaNombre: row.categoria_nombre,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        });
    }
}

module.exports = Producto;
