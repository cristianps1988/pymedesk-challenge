import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient()

export async function calcularTotal(pedidoId: string) {
    const pedido = await prisma.pedido.findUnique({
        where: { id: +pedidoId },
        include: {
            items: {
                include: {
                    producto: true
                }
            }
        }
    });

    if (!pedido) {
        throw new Error(`Pedido con ID ${pedidoId} no encontrado`);
    }

    let total = 0;

    for (const item of pedido.items) {
        const productoPrecio = item.producto.valor;
        const itemCantidad = item.cantidad;

        total += +productoPrecio * itemCantidad;
    }

    return total;
}