import type { PrismaClient, Prontuario } from "../prisma/generated/prisma/client";
import { prisma } from "../prisma/prisma";

export class ProntuarioRepository {
    constructor(private readonly prisma: PrismaClient) {
        this.prisma = prisma
    }

    async listarTodosProntuarios() {
        return await this.prisma.prontuario.findMany({
            include: {
                paciente: true,
                usuario: true
            }
        });
    }

    async buscarProntuarioId(idProntuario: number) {
        return await this.prisma.prontuario.findUnique({
            where: { id: idProntuario },
            include: {
                paciente: true,
                usuario: true
            }
        });
    }

    async buscarProntuariosPorPaciente(idPaciente: number) {
        return await this.prisma.prontuario.findMany({
            where: { paciente_id: idPaciente },
            include: {
                paciente: true,
                usuario: true
            }
        });
    }

    async criarProntuario(dadosProntuario: Partial<Prontuario>) {
        return await this.prisma.prontuario.create({
            data: {
                descricao: dadosProntuario.descricao || "",
                data: dadosProntuario.data || null,
                medico_responsavel_id: dadosProntuario.medico_responsavel_id || 0,
                paciente_id: dadosProntuario.paciente_id || 0,
            }
        });
    }

    async atualizarProntuario(idProntuario: number, dadosParaAtualizar: Omit<Prontuario, 'id'>) {
        return await this.prisma.prontuario.update({
            data: { ...dadosParaAtualizar },
            where: { id: idProntuario }
        });
    }

    async deletarProntuario(idProntuario: number) {
        return await this.prisma.prontuario.delete({
            where: { id: idProntuario }
        });
    }
}

export const prontuarioRepository = new ProntuarioRepository(prisma);