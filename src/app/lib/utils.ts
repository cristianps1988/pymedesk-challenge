import { prisma } from './prismaClient';

export function isValidNombre(nombre: unknown): nombre is string {
    return typeof nombre === 'string' && nombre.trim() !== ''
}

export function isValidValor(valor: unknown): valor is number {
    return typeof valor === 'number' && !isNaN(valor) && valor > 0
}

export function isValidInventario(inventario: unknown): inventario is number {
    return Number.isInteger(inventario) && (inventario as number) >= 0
}

export async function updateProducto(productoId: number, cantidadVendida: number) {
    await prisma.producto.update({
        where: { id: productoId },
        data: {
            inventario: {
                decrement: cantidadVendida
            }
        }
    });
}