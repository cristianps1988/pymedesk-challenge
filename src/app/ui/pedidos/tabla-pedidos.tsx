'use client'

import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import { lusitana } from '../../ui/fonts';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const initialState = {
    meta: {},
    pedidos: []
}

export default function TablaPedidos() {
    const [isLoading, setisLoading] = useState(true)
    const [respuesta, setrespuesta] = useState(initialState)
    useEffect(() => {
        axios.get('http://localhost:3000/api/pedidos').then((resp) => {
            setrespuesta(resp.data)
        })
        setisLoading(false)
    }, [])

    const { pedidos } = respuesta
    return (
        <>
            {isLoading ? <p>Cargando</p> :
                <div className="flex w-full flex-col md:col-span-8">
                    <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
                        <div className="bg-white px-6">
                            {pedidos.map((pedido, i) => {
                                return (
                                    <div
                                        key={pedido.id}
                                        className={clsx(
                                            'flex flex-row items-center justify-between py-4',
                                            {
                                                'border-t': i !== 0,
                                            },
                                        )}
                                    >
                                        <div className="flex items-center">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold md:text-base">Estado: <span className='text-sm text-gray-400'>{pedido.estado}</span>
                                                </p>
                                                <p className="hidden text-sm text-gray-500 sm:block">Pagado: {pedido.pagado ? <span className='text-sm text-gray-400'>Si</span> : <span className='text-sm text-red-600'>No</span>}
                                                </p>
                                            </div>
                                        </div>
                                        <p
                                            className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                                        >
                                            ${pedido.total}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex items-center pb-2 pt-6">
                            <ArrowPathIcon className="h-5 w-5 text-gray-500" />
                            <h3 className="ml-2 text-sm text-gray-500 ">Actualizado justo ahora</h3>
                        </div>
                    </div>
                </div>
            }

        </>
    );
}
