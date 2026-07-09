import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiClient from "../../api/api";

import Modal from "../Modal";

const ExamsForm = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [examData, setExamData] = useState({
    tipo_exame: "",
    valor: "",
    descricao: "",
    resultado: "",
    data_exame: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Buscar pacientes ao carregar o componente
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await apiClient.get("/pacientes");
      setPatients(response.data);
      setFilteredPatients(response.data);
    } catch (error) {
      console.error("Erro ao obter dados dos pacientes:", error);
      toast.error("Erro ao carregar pacientes", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = patients.filter(
      (patient) =>
        patient.nome.toLowerCase().includes(searchTerm) ||
        patient.id.toString().includes(searchTerm)
    );
    setFilteredPatients(filtered);
  };

  const handleSelectModal = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPatient(null);
    setIsModalOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setExamData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setExamData({
      tipo_exame: "",
      valor: "",
      descricao: "",
      resultado: "",
      data_exame: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedPatient) return;

    try {
      setIsSaving(true);
      const examToAdd = {
        ...examData,
        valor: Number(examData.valor), // o back espera Decimal, o input manda string
        pacienteId: selectedPatient.id,
      };

      await apiClient.post("/exames", examToAdd);
      toast.success("Exame cadastrado com sucesso!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
      });

      resetForm();
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao cadastrar exame:", error);

      if (error.response) {
        toast.error("Não foi possível salvar o exame. Verifique os dados.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
        });
      } else {
        toast.error("Erro ao conectar com o servidor", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="p-6 text-gray-800">
      {/* Campo de busca */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">
          Buscar paciente para cadastrar exame
        </label>
        <input
          type="text"
          onChange={handleSearchChange}
          placeholder="Digite o nome ou registro do paciente"
          className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
        />
      </div>

      {/* Lista de pacientes */}
      <ul className="space-y-3">
        {filteredPatients.map((patient) => (
          <li
            key={patient.id}
            className="p-4 border rounded-lg shadow-sm flex justify-between items-center hover:bg-gray-50 transition"
          >
            <div>
              <p className="text-sm">
                <strong>Registro:</strong> {patient.id}
              </p>
              <p className="text-sm">
                <strong>Nome:</strong> {patient.nome}
              </p>
            </div>
            <button
              onClick={() => handleSelectModal(patient)}
              className="bg-cyan-700 text-white px-3 py-1.5 rounded-lg hover:bg-cyan-600 transition"
            >
              Selecionar
            </button>
          </li>
        ))}
      </ul>

      {/* Modal de cadastro de exame */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedPatient && (
          <>
            <h2 className="text-lg font-bold mb-4 text-cyan-700">
              Cadastrar Exame para {selectedPatient.nome}
            </h2>

            <div className="mb-4 text-sm text-gray-700">
              <p>
                <strong>Email:</strong> {selectedPatient.email}
              </p>
              <p>
                <strong>Telefone:</strong> {selectedPatient.telefone}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tipo do Exame
                </label>
                <input
                  type="text"
                  name="tipo_exame"
                  value={examData.tipo_exame}
                  onChange={handleInputChange}
                  required
                  minLength={5}
                  maxLength={30}
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="valor"
                    value={examData.valor}
                    onChange={handleInputChange}
                    required
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Data do Exame
                  </label>
                  <input
                    type="date"
                    name="data_exame"
                    value={examData.data_exame}
                    onChange={handleInputChange}
                    required
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Descrição
                </label>
                <textarea
                  name="descricao"
                  value={examData.descricao}
                  onChange={handleInputChange}
                  rows="3"
                  required
                  minLength={5}
                  maxLength={500}
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Resultado do Exame
                </label>
                <textarea
                  name="resultado"
                  value={examData.resultado}
                  onChange={handleInputChange}
                  rows="3"
                  required
                  minLength={15}
                  maxLength={1000}
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 transition"
                >
                  {isSaving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </>
        )}
      </Modal>

      <ToastContainer />
    </section>
  );
};

export default ExamsForm;