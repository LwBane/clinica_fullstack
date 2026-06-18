import { Router } from "express";
import { prontuarioController } from "../controllers/ProntuarioController";

export const prontuarioRouter = Router();

prontuarioRouter.get('/prontuarios', async (_, res) => {
    return prontuarioController.listarTodosProntuarios(_, res);
});

prontuarioRouter.get('/prontuarios/:id', async (req, res) => {
    return prontuarioController.buscarProntuarioId(req, res);
});

// Buscar todos os prontuários de um paciente específico
prontuarioRouter.get('/prontuarios/paciente/:pacienteId', async (req, res) => {
    return prontuarioController.buscarProntuariosPorPaciente(req, res);
});

prontuarioRouter.post('/prontuarios', async (req, res) => {
    return prontuarioController.criarProntuario(req, res);
});

prontuarioRouter.put('/prontuarios/:id', async (req, res) => {
    return prontuarioController.atualizarProntuario(req, res);
});

prontuarioRouter.delete('/prontuarios/:id', async (req, res) => {
    return prontuarioController.deletarProntuario(req, res);
});