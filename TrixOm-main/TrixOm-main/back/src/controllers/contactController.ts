import { Request, Response } from 'express';
import { contactService } from '../services/contactService';

export class ContactController {
  async criar(req: Request, res: Response) {
    try {
      const contato = await contactService.criarOuRetornar(req.body);
      return res.status(201).json(contato);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const { usuario_id, termo } = req.query;
      if (!usuario_id) return res.status(400).json({ error: 'usuario_id é obrigatório' });

      if (termo) {
        const contatos = await contactService.buscarPorNome(usuario_id as string, termo as string);
        return res.json(contatos);
      }

      const contatos = await contactService.listar(usuario_id as string);
      return res.json(contatos);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const contato = await contactService.buscarPorId(req.params.id);
      if (!contato) return res.status(404).json({ error: 'Contato não encontrado' });
      return res.json(contato);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async editar(req: Request, res: Response) {
    try {
      const contato = await contactService.editar(req.params.id, req.body);
      if (!contato) return res.status(404).json({ error: 'Contato não encontrado' });
      return res.json(contato);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async excluir(req: Request, res: Response) {
    try {
      const { usuario_id } = req.body;
      const resultado = await contactService.excluir(req.params.id, usuario_id);
      if (!resultado) return res.status(404).json({ error: 'Contato não encontrado' });
      return res.json({ message: 'Contato excluído com sucesso', ...resultado });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export const contactController = new ContactController();
