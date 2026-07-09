import React, { useState } from 'react'
import { toast } from 'react-toastify'
import apiClient from '../../api/api'

function RegisterFormExams() {
    const [formData, setFormData] = useState({
        tipo_exame: "",
        valor: "",
        descricao: "",
        resultado: "",
        data_exame: ""
    })

    const [isSaving, setIsSaving] = useState(false)

    // handles

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // submit form

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            await apiClient.post("/exames", {
                ...formData,
                valor: Number(formData.valor) // o back espera Decimal, o input manda string
            })

            toast.success("Exame cadastrado com sucesso!", {
                autoClose: 2000,
                hideProgressBar: true
            })

            setFormData({
                tipo_exame: "",
                valor: "",
                descricao: "",
                resultado: "",
                data_exame: ""
            })

        } catch (error) {
            console.error(error)

            if (error.response) {
                // O back respondeu, mas com erro (ex: dados inválidos)
                toast.error("Não foi possível salvar o exame. Verifique os dados.", {
                    autoClose: 3000,
                    hideProgressBar: true
                })
            } else {
                // Não teve resposta do back (rede caiu, back não está rodando, CORS etc)
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
        <form
            onSubmit={handleSubmit}
            className='space-y-6 text-gray-800'
            autoComplete='off'
        >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

                {/* Tipo do Exame */}
                <fieldset>
                    <label htmlFor='tipo_exame' className='block text-sm font-medium mb-1'>Tipo do Exame</label>
                    <input
                        type='text'
                        name='tipo_exame'
                        id='tipo_exame'
                        value={formData.tipo_exame}
                        onChange={handleInputChange}
                        required
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>

                {/* Valor */}
                <fieldset>
                    <label htmlFor='valor' className='block text-sm font-medium mb-1'>Valor (R$)</label>
                    <input
                        type='number'
                        step='0.01'
                        min='0'
                        name='valor'
                        id='valor'
                        value={formData.valor}
                        onChange={handleInputChange}
                        required
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>

                {/* Data do Exame */}
                <fieldset>
                    <label htmlFor='data_exame' className='block text-sm font-medium mb-1'>Data do Exame</label>
                    <input
                        type='date'
                        name='data_exame'
                        id='data_exame'
                        value={formData.data_exame}
                        onChange={handleInputChange}
                        required
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>

                {/* Descrição */}
                <fieldset className='md:col-span-2'>
                    <label htmlFor='descricao' className='block text-sm font-medium mb-1'>Descrição</label>
                    <textarea
                        name='descricao'
                        id='descricao'
                        value={formData.descricao}
                        onChange={handleInputChange}
                        rows={3}
                        required
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none resize-none'
                    />
                </fieldset>

                {/* Resultado - ocupa largura total */}
                <fieldset className='md:col-span-2'>
                    <label htmlFor='resultado' className='block text-sm font-medium mb-1'>Resultado</label>
                    <textarea
                        name='resultado'
                        id='resultado'
                        value={formData.resultado}
                        onChange={handleInputChange}
                        rows={4}
                        required
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none resize-none'
                    />
                </fieldset>

            </div>

            <button
                type='submit'
                disabled={isSaving}
                className='w-full bg-cyan-700 text-white p-2 rounded-lg hover:bg-cyan-800 transition-colors disabled:opacity-50'>
                {isSaving ? 'Salvando...' : 'Salvar Exame'}
            </button>

        </form>
    )
}

export default RegisterFormExams