import { useState, useEffect } from 'react'
import axios from 'axios'
import { FaCalendarPlus } from "react-icons/fa";

const ExamsCounter = () => {
    const [examCounter, setExamCounter] = useState(0)

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.get('http://localhost:3000/exams')

                setExamCounter(response.data.length)
            } catch (error) {
                console.error('Erro ao buscar exames', error)
            }
        }
        fetchExams()
    }, [])

    return (
        <div className='bg-white dark:bg-gray-900 shadow rounded-lg p-6 flex flex-col items-center w-60'>
            <h2 className='text-xl font-bold flex items-center gap-2 dark:text-gray-200'>
                <FaCalendarPlus className='text-purple-600 dark:text-purple-400' />
                {examCounter}
            </h2>
            <p className='text-grey-600 dark:text-gray-400 mt-2'>Exames</p>
        </div>
    )
}

export default ExamsCounter