import { ProductoInput } from '../../../lib/interfaces';
import { prisma } from '../../../lib/prismaClient';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const productId = +params.id
    try {
        const productExist = await prisma.producto.findUnique({
            where: {
                id: productId
            }
        })

        if (!productExist) {
            return NextResponse.json({ error: 'El producto no existe' }, { status: 404 });
        }
        await prisma.producto.delete({
            where: {
                id: productId
            }
        })
        return NextResponse.json({ msg: "Producto eliminado exitosamente" }, { status: 201 });

    } catch (error) {
        console.error('Error al eliminar producto:', error);
        return NextResponse.json({ error: 'Error al eliminar el producto' }, { status: 500 });
    }
}


export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    console.log('entrando a actualizar')
    const productId = +params.id
    try {
        const productExist = await prisma.producto.findUnique({
            where: {
                id: productId
            }
        })

        if (!productExist) {
            return NextResponse.json({ error: 'El producto no existe' }, { status: 404 });
        }
        const productInfo: ProductoInput = await req.json();
        await prisma.producto.update({
            where: {
                id: productId
            },
            data: productInfo
        })
        return NextResponse.json({ msg: "Producto actualizado exitosamente" }, { status: 201 });

    } catch (error) {
        console.error('Error al editar producto:', error);
        return NextResponse.json({ error: 'Error al editar el producto' }, { status: 500 });
    }
}


