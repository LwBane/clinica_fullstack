import type { PrismaClient, Consulta } from "../prisma/generated/prisma/client";
import { prisma } from "../prisma/prisma";

export class ConsultaRepository {
    constructor(private readonly prisma: PrismaClient) {
        this.prisma = prisma
    }

    async listarTodasConsultas(pagina?: number, limite?: number) {
        const existePaginacao = pagina! && limite!
        if (!existePaginacao) return await prisma.consulta.findMany()
        const exames = await prisma.consulta.findMany({
            skip: (pagina - 1) * limite,
            take: limite
        })

        const total = await prisma.consulta.count();
        const totalPaginas = Math.ceil(total / limite)
        return {
            exames,
            total,
            totalPaginas
        }
    }

    async buscarConsultaId(idConsulta: number) {
        return await this.prisma.consulta.findUnique({
            where: { id: idConsulta },
            include: {
                paciente: true
            }
        });
    }

    async criarConsulta(dadosConsulta: Partial<Consulta>) {
        return await this.prisma.consulta.create({
            data: {
                motivo: dadosConsulta.motivo || "",
                data_consulta: dadosConsulta.data_consulta || new Date(),
                observacoes: dadosConsulta.observacoes || "",
                medico_responsavel_id: dadosConsulta.medico_responsavel_id || 0,
                paciente_id: dadosConsulta.paciente_id || 0,
            }
        });
    }

async atualizarConsulta(idConsulta: number, dadosParaAtualizar: Omit<Consulta, 'id'>) {
    return await this.prisma.consulta.update({
        data: {
            motivo: dadosParaAtualizar.motivo,
            data_consulta: dadosParaAtualizar.data_consulta,
            observacoes: dadosParaAtualizar.observacoes,
            medico_responsavel_id: dadosParaAtualizar.medico_responsavel_id,
            paciente_id: dadosParaAtualizar.paciente_id,
        },
        where: { id: idConsulta }
    });
}

    async deletarConsulta(idConsulta: number) {
        return await this.prisma.consulta.delete({
            where: { id: idConsulta }
        });
    }
}

export const consultaRepository = new ConsultaRepository(prisma);