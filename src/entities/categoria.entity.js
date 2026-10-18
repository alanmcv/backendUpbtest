class Categoria {
    constructor(id, nombre, totalProductos, createdAt) {
        this.id = id;
        this.nombre = nombre;
        this.totalProductos = totalProductos;
        this.createdAt = createdAt;
    }

    static fromRow(row) {
        if (!row) return null;
        // total_productos solo viene en el listado (COUNT); en INSERT/UPDATE no existe
        return new Categoria(row.id, row.nombre, row.total_productos ?? 0, row.created_at);
    }
}

module.exports = Categoria;
