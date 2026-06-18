import type { PrismaClient, Paciente } from "../prisma/generated/prisma/client";
import { prisma } from "../prisma/prisma";

export class PacienteRepository {
    constructor(private readonly prisma: PrismaClient) {
        this.prisma = prisma
    }

    async listarTodosPacientes() {
        return await this.prisma.paciente.findMany({
            include: {
                prontuarios: true,
                consultas: true,
                exames: true
            }
        });
    }

    async buscarPacienteId(idPaciente: number) {
        return await this.prisma.paciente.findUnique({
            where: { id: idPaciente },
            include: {
                prontuarios: true,
                consultas: true,
                exames: true
            }
        });
    }

    async criarPaciente(dadosPaciente: Partial<Paciente>) {
        return await this.prisma.paciente.create({
            data: {
                nome: dadosPaciente.nome || "",
                cpf: dadosPaciente.cpf || "",
                telefone: dadosPaciente.telefone || "",
                email: dadosPaciente.email || "",
                data_nascimento: dadosPaciente.data_nascimento || new Date(),
                sexo: dadosPaciente.sexo || "",
                responsavel: dadosPaciente.responsavel || null,
            }
        });
    }

    async atualizarPaciente(idPaciente: number, dadosParaAtualizar: Omit<Paciente, 'id'>) {
        return await this.prisma.paciente.update({
            data: { ...dadosParaAtualizar },
            where: { id: idPaciente }
        });
    }

    async deletarPaciente(idPaciente: number) {
        return await this.prisma.paciente.delete({
            where: { id: idPaciente }
        });
    }
}

export const pacienteRepository = new PacienteRepository(prisma);