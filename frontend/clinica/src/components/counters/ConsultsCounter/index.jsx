import { useState, useEffect } from 'react'
import axios from 'axios'
import { FaCalendarCheck } from "react-icons/fa";


const ConsultsCounter = () => {
    const [consultCounter, setConsultCounter] = useState(0)

    useEffect(() => {
        const fetchConsults = async () => {
            try {
                const response = await axios.get('http://localhost:3000/consults')

                setConsultCounter(response.data.length)
            } catch (error) {
                console.error('Erro ao buscar consultas', error)
            }
        }
        fetchConsults()
    }, [])

    return (
        <div className='bg-white dark:bg-gray-900 shadow rounded-lg p-6 flex flex-col items-center w-60'>
            <h2 className='text-xl font-bold flex items-center gap-2 dark:text-gray-200'>
                <FaCalendarCheck className='text-green-600 dark:text-green-500' />
                {consultCounter}
            </h2>
            <p className='text-grey-600 dark:text-gray-400 mt-2'>Consultas</p>
        </div>
    )
}

export default ConsultsCounter