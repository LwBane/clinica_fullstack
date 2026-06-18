import type { Consulta } from "../prisma/generated/prisma/client";
import { consultaRepository, type ConsultaRepository } from "../repositories/ConsultationRepository";

export class ConsultaService {
    constructor(private readonly repository: ConsultaRepository) {}

    async listarTodasConsultas(pagina?: number, limite?: number) {
        const exames = await this.repository.listarTodasConsultas(pagina, limite)
        return exames
    }

    async buscarConsultaId(idConsulta: number) {
        return await this.repository.buscarConsultaId(idConsulta);
    }

    async criarConsulta(dadosConsulta: Consulta) {
        return await this.repository.criarConsulta(dadosConsulta);
    }

    async atualizarConsulta(idConsulta: number, dadosParaAtualizar: Omit<Consulta, 'id'>) {
        return await this.repository.atualizarConsulta(idConsulta, dadosParaAtualizar);
    }

    async deletarConsulta(idConsulta: number) {
        return await this.repository.deletarConsulta(idConsulta);
    }
}

export const consultaService = new ConsultaService(consultaRepository);