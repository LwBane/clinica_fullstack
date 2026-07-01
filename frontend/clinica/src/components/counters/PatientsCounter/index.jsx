import { useState, useEffect } from 'react'
import axios from 'axios'
import { FaHospitalUser } from 'react-icons/fa'

const PatientsCounter = () => {
    const [patientCounter, setPatientCounter] = useState(0)

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get('http://localhost:3000/patients')

                setPatientCounter(response.data.length)
            } catch (error) {
                console.error('Erro ao buscar pacientes', error)
            }
        }
        fetchPatients()
    }, [])

    return (
        <div className='bg-white dark:bg-gray-900 shadow rounded-lg p-6 flex flex-col items-center w-60'>
            <h2 className='text-xl font-bold flex items-center gap-2 dark:text-gray-200'>
                <FaHospitalUser className='text-blue-600 dark:text-blue-400' />
                {patientCounter}
            </h2>
            <p className='text-grey-600 dark:text-gray-400 mt-2'>Pacientes</p>
        </div>
    )
}

export default PatientsCounter