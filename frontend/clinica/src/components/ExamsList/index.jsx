import { useState, useEffect } from 'react'

import { useParams } from 'react-router'
import apiClient from '../../api/api'


const ExamsList = () => {
    const [page, setPage] = useState(1)
    const [exams, setExams] = useState()
    const [total, setTotal] = useState()
    const [totalPagina, setTotalPagina] = useState()
    const limite = 10
    useEffect(() => {
        const fethExames = async () => {
            try {
                const response = await apiClient.get(`/exames?pagina=${page}&limite=${limite}`)
                if (response.data) {
                    setExams(response.data.exames)
                    setTotal(response.data.total)
                    setTotalPagina(response.data.totalPaginas)
                }
            } catch (error) {
                console.error("Erro ao listar exames", error)
            }
        }
        fethExames()
    }, [page])

    return (
        <div className="bg-white rounded shadow p-4">
            <div className="text-lg font-semibold text-cyan-800 mb-4">Lista de exames</div>
            {
                exams?.length ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="border-b text-gray-500 text-xs uppercase">
                                        <th className="py-2 px-3">ID</th>
                                        <th className="py-2 px-3">Tipo de Exame</th>
                                        <th className="py-2 px-3">Descrição</th>
                                        <th className="py-2 px-3">Data do Exame</th>
                                        <th className="py-2 px-3">Valor</th>
                                        <th className="py-2 px-3">Resultado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exams.map((exame) => (
                                        <tr className="border-b hover:bg-gray-50 transition">
                                            <td className="py-2 px-3 text-gray-400">{exame.id}</td>
                                            <td className="py-2 px-3 text-cyan-700 font-medium">{exame.tipo_exame}</td>
                                            <td className="py-2 px-3 text-gray-600">{exame.descricao}</td>
                                            <td className="py-2 px-3 text-gray-600">{exame.data_exame}</td>
                                            <td className="py-2 px-3 text-gray-600">{exame.valor}</td>
                                            <td className="py-2 px-3"><em className="text-gray-500">{exame.resultado}</em></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className='flex gap-2 items-center justify-center mt-4'>
                            <span className="text-sm text-gray-500">Resultado {limite * page} de {total}</span>
                            {Array.from(Array(totalPagina)).map((_, i) => (
                                <button
                                    onClick={() => { setPage(i + 1) }}
                                    className={`px-2 py-1 text-sm text-white rounded cursor-pointer transition ${i + 1 == page ? "bg-cyan-950" : "bg-cyan-600 hover:bg-cyan-700"}`}>
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <span className="text-gray-500 text-sm">Sem dados!</span>
                )
            }
        </div>
    )
}

export default ExamsList