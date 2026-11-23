import { Request, Response } from 'express';
import { userService } from '../services/userService';

export class UserController {
  async criar(req: Request, res: Response) {
    try {
      const usuario = await userService.criar(req.body);
      return res.status(201).json(usuario);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const usuarios = await userService.listar(req.query);
      return res.json(usuarios);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const usuario = await userService.buscarPorId(req.params.id);
      if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
      return res.json(usuario);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async editar(req: Request, res: Response) {
    try {
      const usuario = await userService.editar(req.params.id, req.body);
      if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
      return res.json(usuario);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async excluir(req: Request, res: Response) {
    try {
      const resultado = await userService.excluir(req.params.id);
      if (!resultado) return res.status(404).json({ error: 'Usuário não encontrado' });
      return res.json({ message: 'Usuário excluído com sucesso', ...resultado });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export const userController = new UserController();
