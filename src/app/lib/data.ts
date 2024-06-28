import axios from 'axios'

export const fetchResumen = async () => {
    const response = await axios.get('http://localhost:3000/api/resumen')
    return response.data
}