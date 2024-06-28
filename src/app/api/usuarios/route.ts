import { isValidNombre } from '../../lib/utils';
import { UsuarioInput } from '../../lib/interfaces';
import { prisma } from '../../lib/prismaClient';
import { NextResponse, NextRequest } from 'next/server';


export async function POST(req: Request) {
    try {
        const body: UsuarioInput = await req.json();
        const { nombre, celular, correo, direccion, ciudad } = body;

        if (!isValidNombre(nombre)) {
            return NextResponse.json({ error: 'El nombre del producto no puede estar vacío' }, { status: 400 });
        }

        const nuevoUsuario = await prisma.cliente.create({
            data: {
                nombre: nombre.trim(),
                celular,
                correo,
                direccion,
                ciudad
            },
        });

        return NextResponse.json(nuevoUsuario, { status: 201 });

    } catch (error) {
        console.error('Error al crear el usuario:', error);
        return NextResponse.json({ error: 'Error al crear el usuario' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const nombre = searchParams.get('nombre') || '';
        const ciudad = searchParams.get('ciudad') || '';

        const skip = (page - 1) * limit;

        const where: any = {};
        if (nombre) where.nombre = { contains: nombre };
        if (ciudad) where.ciudad = { contains: ciudad };

        const [usuarios, total] = await Promise.all([
            prisma.cliente.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    // You can add an order by clause here for specific fields (e.g., id: 'asc')
                }
            }),
            prisma.cliente.count({ where })
        ]);

        return NextResponse.json({
            usuarios,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener los usuarios" }, { status: 500 })
    }
}
