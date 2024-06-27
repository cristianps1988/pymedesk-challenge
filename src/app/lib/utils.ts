
// Funciones de validación
export function isValidNombre(nombre: unknown): nombre is string {
    return typeof nombre === 'string' && nombre.trim() !== ''
}

export function isValidValor(valor: unknown): valor is number {
    return typeof valor === 'number' && !isNaN(valor) && valor > 0
}

export function isValidInventario(inventario: unknown): inventario is number {
    return Number.isInteger(inventario) && (inventario as number) >= 0
}