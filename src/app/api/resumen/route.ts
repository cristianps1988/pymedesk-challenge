import { prisma } from '../../lib/prismaClient';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const totalOrders = await prisma.pedido.count();

        const totalCustomers = await prisma.cliente.count();

        const last30DaysStart = new Date();
        last30DaysStart.setDate(last30DaysStart.getDate() - 30);
        const now = new Date();
        const lastMonthRevenue = await prisma.pedido.aggregate({
            _sum: {
                total: true
            },
            where: {
                pagado: true,
                fecha: {
                    gte: last30DaysStart,
                    lte: now
                }
            }
        });

        const ordersByCity = await prisma.pedido.groupBy({
            by: ['clienteId'],
            _count: { clienteId: true },
            orderBy: {
                _count: { clienteId: 'desc' },
            },
            take: 1,
        });

        let topCity = null;
        if (ordersByCity.length > 0) {
            const topCityCliente = await prisma.cliente.findUnique({
                where: { id: ordersByCity[0].clienteId },
                select: { ciudad: true },
            });
            topCity = topCityCliente?.ciudad || null;
        }

        const topProductGroup = await prisma.pedidoItem.groupBy({
            by: ['productoId'],
            _sum: { cantidad: true },
            orderBy: {
                _sum: { cantidad: 'desc' },
            },
            take: 1,
        });

        let topProduct = null;
        if (topProductGroup.length > 0) {
            const topProductData = await prisma.producto.findUnique({
                where: { id: topProductGroup[0].productoId },
                select: { nombre: true },
            });
            topProduct = topProductData?.nombre || null;
        }

        const resumenData = {
            totalOrders,
            totalCustomers,
            lastMonthRevenue: lastMonthRevenue._sum.total || 0,
            topCity,
            topProduct,
        };

        return NextResponse.json(resumenData, { status: 200 });
    } catch (error) {
        console.error('Error al obtener resumen de desempeño:', error);
        return NextResponse.json({ error: 'Error al obtener resumen' }, { status: 500 });
    }
}