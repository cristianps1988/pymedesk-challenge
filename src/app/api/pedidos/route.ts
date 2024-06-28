import { NextRequest, NextResponse } from 'next/server';
import { PedidoInput, estadosValidos, reglasEnvioValidas } from '../../lib/interfaces';
import { prisma } from '../../lib/prismaClient';
import { EstadoPedido, ReglaEnvio } from '@prisma/client';
import { updateProducto } from '@/app/lib/utils';

// export async function POST(req: Request) {
//     try {
//         const body: PedidoInput = await req.json();
//         const { clienteId, estado, pagado, reglaEnvio, observaciones, items } = body;

//         if (!clienteId || typeof clienteId !== 'number') {
//             return NextResponse.json({ error: 'ID de cliente inválido' }, { status: 400 });
//         }

//         if (!estadosValidos.includes(estado)) {
//             return NextResponse.json({ error: 'Estado de pedido inválido' }, { status: 400 });
//         }

//         if (!reglasEnvioValidas.includes(reglaEnvio)) {
//             return NextResponse.json({ error: 'Regla de envío inválida' }, { status: 400 });
//         }

//         if (typeof pagado !== 'boolean') {
//             return NextResponse.json({ error: 'El campo pagado debe ser un booleano' }, { status: 400 });
//         }

//         if (!Array.isArray(items) || items.length === 0) {
//             return NextResponse.json({ error: 'La lista de items no puede estar vacía' }, { status: 400 });
//         }

//         for (const item of items) {
//             const producto = await prisma.producto.findUnique({
//                 where: { id: item.productoId },
//                 select: { inventario: true }
//             });

//             if (!producto) {
//                 return NextResponse.json({ error: `Producto con ID ${item.productoId} no encontrado` }, { status: 400 });
//             }

//             if (producto.inventario < item.cantidad) {
//                 return NextResponse.json({ error: `Inventario insuficiente para el producto con ID ${item.productoId}` }, { status: 400 });
//             }
//         }

//         const nuevoPedido = await prisma.pedido.create({
//             data: {
//                 clienteId,
//                 estado,
//                 pagado,
//                 reglaEnvio,
//                 observaciones,
//                 items: {
//                     create: items.map(item => ({
//                         productoId: item.productoId,
//                         cantidad: item.cantidad
//                     }))
//                 }
//             },
//             include: {
//                 items: {
//                     include: {
//                         producto: true
//                     }
//                 },
//                 cliente: true
//             }
//         });

//         for (const item of items) {
//             await updateProducto(item.productoId, item.cantidad);
//         }

//         return NextResponse.json(nuevoPedido, { status: 201 });
//     } catch (error) {
//         console.error('Error al crear pedido:', error);
//         return NextResponse.json({ error: 'Error al crear el pedido' }, { status: 500 });
//     }
// }

export async function POST(req: Request) {
    try {
        const body: PedidoInput = await req.json();
        const { clienteId, estado, pagado, reglaEnvio, observaciones, items } = body;

        if (!clienteId || typeof clienteId !== 'number') {
            return NextResponse.json({ error: 'ID de cliente inválido' }, { status: 400 });
        }

        if (!estadosValidos.includes(estado)) {
            return NextResponse.json({ error: 'Estado de pedido inválido' }, { status: 400 });
        }

        if (!reglasEnvioValidas.includes(reglaEnvio)) {
            return NextResponse.json({ error: 'Regla de envío inválida' }, { status: 400 });
        }

        if (typeof pagado !== 'boolean') {
            return NextResponse.json({ error: 'El campo pagado debe ser un booleano' }, { status: 400 });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'La lista de items no puede estar vacía' }, { status: 400 });
        }

        let totalPedido = 0;

        for (const item of items) {
            const producto = await prisma.producto.findUnique({
                where: { id: item.productoId },
                select: {
                    valor: true,
                    inventario: true
                }
            });

            if (!producto) {
                return NextResponse.json({ error: `Producto con ID ${item.productoId} no encontrado` }, { status: 400 });
            }

            if (producto.inventario < item.cantidad) {
                return NextResponse.json({ error: `Inventario insuficiente para el producto con ID ${item.productoId}` }, { status: 400 });
            }

            const productoPrecio = +producto.valor;


            const itemTotal = productoPrecio * item.cantidad;
            totalPedido += itemTotal;

        }

        const nuevoPedido = await prisma.pedido.create({
            data: {
                clienteId,
                estado,
                pagado,
                reglaEnvio,
                observaciones,
                total: totalPedido,
                items: {
                    create: items.map(item => ({
                        productoId: item.productoId,
                        cantidad: item.cantidad
                    }))
                }
            },
            include: {
                items: {
                    include: {
                        producto: true
                    }
                },
                cliente: true
            }
        });
        console.log(totalPedido)

        for (const item of items) {
            await updateProducto(item.productoId, item.cantidad);
        }

        return NextResponse.json(nuevoPedido, { status: 201 }); // Retornar el valor total del pedido
    } catch (error) {
        console.error('Error al crear pedido:', error);
        return NextResponse.json({ error: 'Error al crear el pedido' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const estado = searchParams.get('estado') as EstadoPedido | null;
        const reglaEnvio = searchParams.get('reglaEnvio') as ReglaEnvio | null;
        const clienteId = searchParams.get('clienteId');
        const fechaDesde = searchParams.get('fechaDesde');
        const fechaHasta = searchParams.get('fechaHasta');

        const skip = (page - 1) * limit;

        const where: any = {};
        if (estado) where.estado = estado;
        if (reglaEnvio) where.reglaEnvio = reglaEnvio;
        if (clienteId) where.clienteId = parseInt(clienteId);
        if (fechaDesde || fechaHasta) {
            where.fecha = {};
            if (fechaDesde) where.fecha.gte = new Date(fechaDesde);
            if (fechaHasta) where.fecha.lte = new Date(fechaHasta);
        }

        const [pedidos, total] = await Promise.all([
            prisma.pedido.findMany({
                where,
                skip,
                take: limit,
                include: {
                    items: {
                        include: {
                            producto: true
                        }
                    },
                    cliente: true
                },
                orderBy: {
                    fecha: 'desc'
                }
            }),
            prisma.pedido.count({ where })
        ]);

        return NextResponse.json({
            pedidos,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }, { status: 200 });
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        return NextResponse.json({
            error: "Error al obtener los pedidos",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
