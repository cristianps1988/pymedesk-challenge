import { isValidInventario, isValidNombre, isValidValor } from '../../lib/utils';
import { ProductoInput } from '../../lib/interfaces';
import { prisma } from '../../lib/prismaClient';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
    try {
        const body: ProductoInput = await req.json();
        const { nombre, valor, inventario } = body;

        if (!isValidNombre(nombre)) {
            return NextResponse.json({ error: 'El nombre del producto no puede estar vacío' }, { status: 400 });
        }

        if (!isValidValor(valor)) {
            return NextResponse.json({ error: 'El valor no puede ser menor a cero' }, { status: 400 });
        }

        if (!isValidInventario(inventario)) {
            return NextResponse.json({ error: 'El inventario debe ser mayor a cero' }, { status: 400 });
        }

        const nuevoProducto = await prisma.producto.create({
            data: {
                nombre: nombre.trim(),
                valor,
                inventario,
            },
        });

        return NextResponse.json(nuevoProducto, { status: 201 });

    } catch (error) {
        console.error('Error al crear producto:', error);
        return NextResponse.json({ error: 'Error al crear el producto' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const response = await prisma.producto.findMany()
        return NextResponse.json(response, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener los productos" }, { status: 500 })
    }
}

// Todo: PUT, DELETE endpoints