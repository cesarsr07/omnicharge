import { Request, Response } from 'express';
import { productService } from '../services/productService';

export class ProductController {
  async adicionar(req: Request, res: Response) {
    try {
      const produto = await productService.adicionar(req.body);
      return res.status(201).json(produto);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const produtos = await productService.listar(req.query as any);
      return res.json(produtos);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const produto = await productService.buscarPorId(req.params.id);
      if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
      return res.json(produto);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async editar(req: Request, res: Response) {
    try {
      const { usuario_id, ...dados } = req.body;
      const produto = await productService.editar(req.params.id, usuario_id, dados);
      if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
      return res.json(produto);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async excluir(req: Request, res: Response) {
    try {
      const { usuario_id } = req.body;
      const resultado = await productService.excluir(req.params.id, usuario_id);
      if (!resultado) return res.status(404).json({ error: 'Produto não encontrado' });
      return res.json({ message: 'Produto excluído com sucesso', ...resultado });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async vender(req: Request, res: Response) {
    try {
      const { usuario_id, quantidade, cliente_id } = req.body;
      const resultado = await productService.vender(req.params.id, usuario_id, quantidade, cliente_id);
      return res.json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async emprestar(req: Request, res: Response) {
    try {
      const { usuario_id, quantidade, cliente_id, dias_emprestimo } = req.body;
      const resultado = await productService.emprestar(req.params.id, usuario_id, quantidade, cliente_id, dias_emprestimo);
      return res.json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async devolver(req: Request, res: Response) {
    try {
      const { movimentacao_id } = req.body;
      const resultado = await productService.devolver(movimentacao_id);
      return res.json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export const productController = new ProductController();
