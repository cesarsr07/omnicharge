import { Request, Response } from 'express';
import { financialExtractService } from '../services/financialExtractService';

export class FinancialExtractController {
  async registrar(req: Request, res: Response) {
    try {
      const lancamento = await financialExtractService.registrar(req.body);
      return res.status(201).json(lancamento);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const { usuario_id, tipo, status, mes, ano } = req.query;
      if (!usuario_id) return res.status(400).json({ error: 'usuario_id é obrigatório' });

      const lancamentos = await financialExtractService.listar(usuario_id as string, {
        tipo: tipo as any,
        status: status as string,
        mes: mes ? parseInt(mes as string) : undefined,
        ano: ano ? parseInt(ano as string) : undefined,
      });

      return res.json(lancamentos);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async obterBalanco(req: Request, res: Response) {
    try {
      const { usuario_id, mes, ano } = req.query;
      if (!usuario_id) return res.status(400).json({ error: 'usuario_id é obrigatório' });

      const balanco = await financialExtractService.obterBalanco(
        usuario_id as string,
        mes ? parseInt(mes as string) : undefined,
        ano ? parseInt(ano as string) : undefined
      );

      return res.json(balanco);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export const financialExtractController = new FinancialExtractController();
