import type { Paciente } from "../prisma/generated/prisma/client";
import { pacienteRepository, type PacienteRepository } from "../repositories/PatientRepository";

export class PacienteService {
    constructor(private readonly repository: PacienteRepository) {}

    async listarTodosPacientes() {
        return await this.repository.listarTodosPacientes();
    }

    async buscarPacienteId(idPaciente: number) {
        return await this.repository.buscarPacienteId(idPaciente);
    }

    async criarPaciente(dadosPaciente: Paciente) {
        return await this.repository.criarPaciente(dadosPaciente);
    }

    async atualizarPaciente(idPaciente: number, dadosParaAtualizar: Omit<Paciente, 'id'>) {
        return await this.repository.atualizarPaciente(idPaciente, dadosParaAtualizar);
    }

    async deletarPaciente(idPaciente: number) {
        return await this.repository.deletarPaciente(idPaciente);
    }
}

export const pacienteService = new PacienteService(pacienteRepository);