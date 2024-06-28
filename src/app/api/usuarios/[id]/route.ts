import { UsuarioInput } from '../../../lib/interfaces';
import { prisma } from '../../../lib/prismaClient';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const userId = +params.id
    try {
        const userExist = await prisma.cliente.findUnique({
            where: {
                id: userId
            }
        })

        if (!userExist) {
            return NextResponse.json({ error: 'El usuario no existe' }, { status: 404 });
        }
        await prisma.cliente.delete({
            where: {
                id: userId
            }
        })
        return NextResponse.json({ msg: "Usuario eliminado exitosamente" }, { status: 201 });

    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        return NextResponse.json({ error: 'Error al eliminar el usuario' }, { status: 500 });
    }
}


export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const userId = +params.id
    try {
        const clienteExist = await prisma.cliente.findUnique({
            where: {
                id: userId
            }
        })

        if (!clienteExist) {
            return NextResponse.json({ error: 'El cliente no existe' }, { status: 404 });
        }
        const clienteInfo: UsuarioInput = await req.json();
        const { pedidos, ...clienteData } = clienteInfo;

        await prisma.cliente.update({
            where: {
                id: userId
            },
            data: clienteData,
        });

        return NextResponse.json({ msg: "Cliente actualizado exitosamente" }, { status: 201 });

    } catch (error) {
        console.error('Error al editar cliente:', error);
        return NextResponse.json({ error: 'Error al editar el cliente' }, { status: 500 });
    }
}


