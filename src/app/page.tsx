'use client'
import { lusitana } from '@/app/ui/fonts';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from '@/app/ui/dashboard/card'

const initialState = {
  totalOrders: '',
  totalCustomers: '',
  lastMonthRevenue: '',
  topCity: '',
  topProduct: ''
}

export default function Page() {

  const [respuesta, setrespuesta] = useState(initialState)
  useEffect(() => {
    axios.get('http://localhost:3000/api/resumen').then((resp) => {
      setrespuesta(resp.data)
    })
  }, [])
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Número de pedidos" value={respuesta?.totalOrders || 'Loading'} type="collected" />
        <Card title="Total Clientes" value={respuesta?.totalCustomers || 'Loading'} type="collected" />
        <Card title="Ganancias últimos 30 días" value={respuesta?.lastMonthRevenue || 'Loading'} type="collected" />
        <Card title="Ciudad con más pedidos" value={respuesta?.topCity || 'Loading'} type="collected" />
        <Card title="Producto más vendido" value={respuesta?.topProduct || 'Loading'} type="collected" />

      </div>
    </main>
  );
}