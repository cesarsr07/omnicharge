import { Request, Response } from 'express';
import { billReceivableService } from '../services/billReceivableService';

export class BillReceivableController {
  async criar(req: Request, res: Response) {
    try {
      const conta = await billReceivableService.criar(req.body);
      return res.status(201).json(conta);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const contas = await billReceivableService.listar(req.query as any);
      return res.json(contas);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const conta = await billReceivableService.buscarPorId(req.params.id);
      if (!conta) return res.status(404).json({ error: 'Conta a receber não encontrada' });
      return res.json(conta);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async editar(req: Request, res: Response) {
    try {
      const { usuario_id, ...dados } = req.body;
      const conta = await billReceivableService.editar(req.params.id, usuario_id, dados);
      if (!conta) return res.status(404).json({ error: 'Conta a receber não encontrada' });
      return res.json(conta);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async excluir(req: Request, res: Response) {
    try {
      const { usuario_id } = req.body;
      const resultado = await billReceivableService.excluir(req.params.id, usuario_id);
      if (!resultado) return res.status(404).json({ error: 'Conta a receber não encontrada' });
      return res.json({ message: 'Conta a receber excluída com sucesso', ...resultado });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async marcarComoRecebido(req: Request, res: Response) {
    try {
      const { usuario_id } = req.body;
      const conta = await billReceivableService.marcarComoRecebido(req.params.id, usuario_id);
      if (!conta) return res.status(404).json({ error: 'Conta a receber não encontrada' });
      return res.json(conta);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export const billReceivableController = new BillReceivableController();
