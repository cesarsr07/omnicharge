import { Router } from 'express';
import { userController } from '../controllers/userController';
import { contactController } from '../controllers/contactController';
import { productController } from '../controllers/productController';
import { billPayableController } from '../controllers/billPayableController';
import { billReceivableController } from '../controllers/billReceivableController';
import { financialExtractController } from '../controllers/financialExtractController';

const router = Router();

// =========================================================
// ROTAS DE USUÁRIOS
// =========================================================
router.post('/usuarios', (req, res) => userController.criar(req, res));
router.get('/usuarios', (req, res) => userController.listar(req, res));
router.get('/usuarios/:id', (req, res) => userController.buscarPorId(req, res));
router.put('/usuarios/:id', (req, res) => userController.editar(req, res));
router.delete('/usuarios/:id', (req, res) => userController.excluir(req, res));

// =========================================================
// ROTAS DE CONTATOS
// =========================================================
router.post('/contatos', (req, res) => contactController.criar(req, res));
router.get('/contatos', (req, res) => contactController.listar(req, res));
router.get('/contatos/:id', (req, res) => contactController.buscarPorId(req, res));
router.put('/contatos/:id', (req, res) => contactController.editar(req, res));
router.delete('/contatos/:id', (req, res) => contactController.excluir(req, res));

// =========================================================
// ROTAS DE PRODUTOS / ESTOQUE
// =========================================================
router.post('/produtos', (req, res) => productController.adicionar(req, res));
router.get('/produtos', (req, res) => productController.listar(req, res));
router.get('/produtos/:id', (req, res) => productController.buscarPorId(req, res));
router.put('/produtos/:id', (req, res) => productController.editar(req, res));
router.delete('/produtos/:id', (req, res) => productController.excluir(req, res));
router.post('/produtos/:id/vender', (req, res) => productController.vender(req, res));
router.post('/produtos/:id/emprestar', (req, res) => productController.emprestar(req, res));
router.post('/produtos/devolver', (req, res) => productController.devolver(req, res));

// =========================================================
// ROTAS DE CONTAS A PAGAR
// =========================================================
router.post('/contas-pagar', (req, res) => billPayableController.criar(req, res));
router.get('/contas-pagar', (req, res) => billPayableController.listar(req, res));
router.get('/contas-pagar/:id', (req, res) => billPayableController.buscarPorId(req, res));
router.put('/contas-pagar/:id', (req, res) => billPayableController.editar(req, res));
router.delete('/contas-pagar/:id', (req, res) => billPayableController.excluir(req, res));
router.post('/contas-pagar/:id/pagar', (req, res) => billPayableController.marcarComoPago(req, res));

// =========================================================
// ROTAS DE CONTAS A RECEBER
// =========================================================
router.post('/contas-receber', (req, res) => billReceivableController.criar(req, res));
router.get('/contas-receber', (req, res) => billReceivableController.listar(req, res));
router.get('/contas-receber/:id', (req, res) => billReceivableController.buscarPorId(req, res));
router.put('/contas-receber/:id', (req, res) => billReceivableController.editar(req, res));
router.delete('/contas-receber/:id', (req, res) => billReceivableController.excluir(req, res));
router.post('/contas-receber/:id/receber', (req, res) => billReceivableController.marcarComoRecebido(req, res));

// =========================================================
// ROTAS DE EXTRATO FINANCEIRO E BALANÇO
// =========================================================
router.post('/extrato', (req, res) => financialExtractController.registrar(req, res));
router.get('/extrato', (req, res) => financialExtractController.listar(req, res));
router.get('/extrato/balanco', (req, res) => financialExtractController.obterBalanco(req, res));

export default router;
