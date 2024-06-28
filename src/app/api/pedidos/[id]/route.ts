import { PedidoInput } from '../../../lib/interfaces';
import { prisma } from '../../../lib/prismaClient';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const pedidoId = +params.id
    try {
        const pedidoExist = await prisma.pedido.findUnique({
            where: {
                id: pedidoId
            }
        })

        if (!pedidoExist) {
            return NextResponse.json({ error: 'El pedido no existe' }, { status: 404 });
        }
        await prisma.pedidoItem.deleteMany({ where: { pedidoId } });
        await prisma.pedido.delete({
            where: {
                id: pedidoId
            }
        })
        return NextResponse.json({ msg: "Pedido eliminado exitosamente" }, { status: 201 });

    } catch (error) {
        console.error('Error al eliminar pedido:', error);
        return NextResponse.json({ error: 'Error al eliminar el pedido' }, { status: 500 });
    }
}


export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const pedidoId = +params.id
    try {
        const pedidoExist = await prisma.pedido.findUnique({
            where: {
                id: pedidoId
            },
            include: {
                items: true
            }
        })

        if (!pedidoExist) {
            return NextResponse.json({ error: 'El pedido no existe' }, { status: 404 });
        }
        const pedidoInfo: PedidoInput = await req.json();
        // todo: actualizar pedido

        return NextResponse.json({ msg: "Pedido actualizado exitosamente" }, { status: 201 });

    } catch (error) {
        console.error('Error al editar pedido:', error);
        return NextResponse.json({ error: 'Error al editar el pedido' }, { status: 500 });
    }
}


