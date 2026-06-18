import type { Request, Response } from "express";
import type { Prontuario } from "../prisma/generated/prisma/client";
import { ProntuarioService, prontuarioService } from "../services/ProntuarioService";

class ProntuarioController {
    constructor(private readonly service: ProntuarioService) {}

    async listarTodosProntuarios(_: Request, res: Response) {
        try {
            const prontuarios = await this.service.listarTodosProntuarios();
            return res.status(200).json(prontuarios);
        } catch (error) {
            console.log(error);
            return res.status(404).json({ error });
        }
    }

    async buscarProntuarioId(req: Request, res: Response) {
        try {
            const idProntuario = Number(req.params.id);
            const prontuario = await this.service.buscarProntuarioId(idProntuario);
            return res.status(200).json(prontuario);
        } catch (error) {
            console.log(error);
            return res.status(404).json({ error });
        }
    }

    async buscarProntuariosPorPaciente(req: Request, res: Response) {
        try {
            const idPaciente = Number(req.params.pacienteId);
            const prontuarios = await this.service.buscarProntuariosPorPaciente(idPaciente);
            return res.status(200).json(prontuarios);
        } catch (error) {
            console.log(error);
            return res.status(404).json({ error });
        }
    }

    async criarProntuario(req: Request, res: Response) {
        try {
            const dadosProntuario = req.body as Prontuario;
            const prontuarioCriado = await this.service.criarProntuario(dadosProntuario);
            return res.status(201).json(prontuarioCriado);
        } catch (error) {
            console.log(error);
            return res.status(404).json({ error });
        }
    }

    async atualizarProntuario(req: Request, res: Response) {
        try {
            const idProntuario = Number(req.params.id);
            const dadosParaAtualizar = req.body as Omit<Prontuario, 'id'>;
            const prontuarioAtualizado = await this.service.atualizarProntuario(idProntuario, dadosParaAtualizar);
            return res.status(200).json(prontuarioAtualizado);
        } catch (error) {
            console.log(error);
            return res.status(404).json({ error });
        }
    }

    async deletarProntuario(req: Request, res: Response) {
        try {
            const idProntuario = Number(req.params.id);
            const prontuario = await this.service.deletarProntuario(idProntuario);
            return res.status(200).json({
                mensagem: "Prontuário deletado com sucesso!",
                data: prontuario
            });
        } catch (error) {
            console.log(error);
            return res.status(404).json({ error });
        }
    }
}

export const prontuarioController = new ProntuarioController(prontuarioService);