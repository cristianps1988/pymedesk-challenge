import { EstadoPedido, ReglaEnvio } from '@prisma/client';

export interface ProductoInput {
    nombre: string;
    valor: number;
    inventario: number;
}

export interface UsuarioInput {
    nombre: string;
    celular: string;
    correo: string;
    direccion: string;
    ciudad: string;
    pedidos?: PedidoInput[] | [];
}
export interface PedidoInput {
    clienteId: number;
    estado: EstadoPedido;
    pagado: boolean;
    reglaEnvio: ReglaEnvio;
    observaciones?: string;
    total?: number;
    items: {
        productoId: number;
        cantidad: number;
    }[];
}

export interface PedidoItemInput {
    pedidoId: number;
    pedido: PedidoInput;
    productoId: number;
    producto: ProductoInput;
    cantidad: number;
}

export const estadosValidos: EstadoPedido[] = ['PENDIENTE', 'EN_RUTA', 'ENTREGADO', 'CANCELADO'];
export const reglasEnvioValidas: ReglaEnvio[] = ['DOMICILIO', 'RECOGE_EN_PUNTO'];
