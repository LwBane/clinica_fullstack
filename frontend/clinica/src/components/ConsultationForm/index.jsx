import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import apiClient from '../../api/api'

// modal
import Modal from '../Modal'

// Decodifica o payload do JWT sem precisar de nenhuma lib extra.
// O token tem 3 partes separadas por ".", a do meio é o payload em base64.
function decodeToken(token) {
    try {
        const payloadBase64 = token.split('.')[1]
        const payloadJson = atob(payloadBase64)
        return JSON.parse(payloadJson)
    } catch (error) {
        console.error('Erro ao decodificar token', error)
        return null
    }
}

function ConsultationForm() {
    const [searchTerm, setSearchTerm] = useState("")
    const [patients, setPatients] = useState([])
    const [selectedPatient, setSelectedPatient] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const [formData, setFormData] = useState({
        reason: "",
        date: "",
        time: "",
        description: "",
    })


    // busca pacientes

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await apiClient.get("/pacientes")
                setPatients(response.data)
            } catch (error) {
                console.error("Erro ao obter dados dos pacientes", error)
                toast.error("Erro ao carregar pacientes", {
                    autoClose: 3000,
                    hideProgressBar: true
                })
            }
        }
        fetchPatients()
    }, [])


    // funções auxiliares

    //controle do campo de filtro

    const handleSearchChange = (e) => setSearchTerm(e.target.value)

    //filtro dos pacientes
    // obs: os campos do back são "nome" e "telefone" (não fullName/phone),
    // e não existe campo de convênio (healthInsurance) no model Paciente

    const filteredPatients = patients.filter(
        (patient) =>
            patient.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.id.toString().includes(searchTerm)
    )

    //seleciona o paciente  e abre modal

    const handleSelectPatient = (patient) => {
        setSelectedPatient(patient)
        setIsModalOpen(true)
    }

    //fecha modal e reseta o valor do paciente selecionado

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedPatient(null)
    }

    //Controla os campos do estado formData dinamicamente

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    //reseta o form

    const resetForm = () => {
        setFormData({
            reason: "",
            date: "",
            time: "",
            description: "",
        })
    }

    //envia os dados

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!selectedPatient) return

        const token = localStorage.getItem('accessToken')
        const dadosToken = token ? decodeToken(token) : null

        if (!dadosToken?.id) {
            toast.error("Não foi possível identificar o médico logado. Faça login novamente.", {
                autoClose: 3000,
                hideProgressBar: true
            })
            return
        }

        try {
            setIsSaving(true)

            // junta date + time num único DateTime, que é o que o back espera em data_consulta
            const dataConsulta = new Date(`${formData.date}T${formData.time}`)

            const dataToSave = {
                motivo: formData.reason,
                data_consulta: dataConsulta.toISOString(),
                observacoes: formData.description,
                paciente_id: selectedPatient.id,
                medico_responsavel_id: dadosToken.id
            }

            await apiClient.post("/consultas", dataToSave)

            toast.success("Consulta cadastrada com sucesso!", {
                autoClose: 2000,
                hideProgressBar: true
            })

            resetForm()
            handleCloseModal()

        } catch (error) {
            console.error("Erro ao cadastrar consulta!", error)

            if (error.response) {
                toast.error("Não foi possível salvar a consulta. Verifique os dados.", {
                    autoClose: 3000,
                    hideProgressBar: true
                })
            } else {
                toast.error("Erro ao conectar com o servidor", {
                    autoClose: 3000,
                    hideProgressBar: true
                })
            }
        } finally {
            setIsSaving(false)
        }
    }



    return (
        <section className='p-6 text-gray-800 dark:text-gray-200'>
            {/* campo de busca */}

            <div className='mb-6'>
                <label className='block text-sm font-semibold mb-2'>
                    Buscar paciente para cadastrar a consulta
                </label>
                <input
                    type='text'
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder='Digite o nome ou o registro do paciente'
                    className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400'
                />

            </div>

            {/* Lista de pacientes */}

            <ul className='space-y-3'>
                {
                    filteredPatients.map((patient) => (
                        <li
                            key={patient.id}
                            className='p-4 border rounded-lg shadow-sm flex justify-between items-center hover:bg-gray-50 transition dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
                        >
                            <div>
                                <p className='text-sm'>
                                    <strong>Registro:</strong> {patient.id}
                                </p>
                                <p className='text-sm'>
                                    <strong>Nome:</strong> {patient.nome}
                                </p>

                            </div>

                            <button
                                onClick={() => handleSelectPatient(patient)}
                                className='bg-cyan-700 text-white px-3 py-2 rounded-lg hover:bg-cyan-600 cursor-pointer'
                            >
                                Selecionar
                            </button>

                        </li>
                    ))
                }
            </ul>


            {/* Modal de cadastro de consulta */}

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                {
                    selectedPatient && (
                        <>
                            {/* Título */}
                            <h2 className='text-lg font-bold mb-4 text-cyan-700'>
                                Cadastrar consulta para {selectedPatient.nome}
                            </h2>

                            {/* Dados básicos */}
                            <div className='mb-4 text-sm text-gray-700 dark:text-gray-300'>
                                <p>
                                    <strong>Email:</strong> {selectedPatient.email}
                                </p>
                                <p>
                                    <strong>Telefone:</strong> {selectedPatient.telefone}
                                </p>
                            </div>

                            {/* Formulário */}

                            <form onSubmit={handleSubmit} className='space-y-4'>
                                {/* motivo da consulta */}
                                <div>
                                    <label htmlFor='reason' className='block text-sm font-medium mb-1'>
                                        Motivo da Consulta
                                    </label>

                                    <input
                                        type='text'
                                        name='reason'
                                        id='reason'
                                        value={formData.reason}
                                        onChange={handleInputChange}
                                        required
                                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200'
                                    />
                                </div>

                                <div className='grid grid-cols-2 gap-4'>
                                    {/* data */}
                                    <div>
                                        <label htmlFor='date' className='block text-sm font-medium mb-1'>
                                            Data
                                        </label>

                                        <input
                                            type='date'
                                            name='date'
                                            id='date'
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            required
                                            className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:scheme-dark'
                                        />
                                    </div>
                                    {/* Hora */}
                                    <div>
                                        <label htmlFor='time' className='block text-sm font-medium mb-1'>
                                            Horário
                                        </label>

                                        <input
                                            type='time'
                                            name='time'
                                            id='time'
                                            value={formData.time}
                                            onChange={handleInputChange}
                                            required
                                            className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:scheme-dark'
                                        />
                                    </div>

                                </div> {/* fechamento do grid*/}

                                {/* Descrição do problema */}

                                <div>
                                    <label htmlFor='description' className='block text-sm font-medium mb-1'>
                                        Descrição do problema
                                    </label>

                                    <textarea
                                        name='description'
                                        id='description'
                                        value={formData.description}
                                        rows={3}
                                        onChange={handleInputChange}
                                        required
                                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none resize-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200'
                                    />
                                </div>

                                {/* botões */}

                                <div className='flex justify-end gap-3 pt-4'>
                                    <button
                                        type='button'
                                        onClick={handleCloseModal}
                                        className='px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
                                    >
                                        Fechar
                                    </button>


                                    <button
                                        type='submit'
                                        disabled={isSaving}
                                        className='px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 transition'
                                    >
                                        {isSaving ? "Salvando..." : "Salvar"}
                                    </button>


                                </div>



                            </form>
                        </>
                    )
                }
            </Modal>

        </section>
    )
}

export default ConsultationForm