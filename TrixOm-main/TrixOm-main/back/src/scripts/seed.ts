import dotenv from 'dotenv';
dotenv.config();

import { connectDatabase, disconnectDatabase } from '../database';
import { User } from '../models/User';
import { Contact } from '../models/Contact';
import { Product } from '../models/Product';
import { BillPayable } from '../models/BillPayable';
import { BillReceivable } from '../models/BillReceivable';
import { FinancialExtract } from '../models/FinancialExtract';
import { logger } from '../logger';

async function seed() {
  try {
    logger.info('🌱 Iniciando script de povoamento (Seed) do MongoDB...');
    await connectDatabase();

    // Limpar dados anteriores
    await Promise.all([
      User.deleteMany({}),
      Contact.deleteMany({}),
      Product.deleteMany({}),
      BillPayable.deleteMany({}),
      BillReceivable.deleteMany({}),
      FinancialExtract.deleteMany({}),
    ]);

    logger.info('🧹 Banco de dados limpo com sucesso.');

    // 1. Criar Usuário Demo
    const user = await User.create({
      nome: 'João da Silva',
      email: 'useremail@example.com',
      telefone: '(11) 98888-8888',
      senha_hash: 'senha123',
      tipo: 'admin',
    });
    logger.info(`👤 Usuário criado: ${user.nome} (${user.email})`);

    // 2. Criar Contatos
    const contatos = await Contact.insertMany([
      { usuario_id: user._id, nome: 'Lojas Americanas', tipo: 'Credor', email: 'sac@americanas.com' },
      { usuario_id: user._id, nome: 'Copel Energia', tipo: 'Credor', email: 'contato@copel.com' },
      { usuario_id: user._id, nome: 'HostGator Hospedagem', tipo: 'Credor', email: 'financeiro@hostgator.com.br' },
      { usuario_id: user._id, nome: 'Maria Oliveira', tipo: 'Devedor', email: 'maria@email.com', telefone: '(11) 97777-7777' },
      { usuario_id: user._id, nome: 'Carlos Mendes', tipo: 'Devedor', telefone: '(11) 96666-6666' },
    ]);
    logger.info(`📇 ${contatos.length} contatos criados.`);

    // 3. Criar Produtos no Inventário
    const produtos = await Product.insertMany([
      {
        usuario_id: user._id,
        nome: 'Mel Silvestre 1kg',
        categoria: 'Alimentos',
        preco: 45.0,
        quantidade: 25,
        qualidade: 'Nova',
        descricao: 'Mel 100% puro colhido na temporada de primavera.',
        status: 'disponivel',
      },
      {
        usuario_id: user._id,
        nome: 'Fumigador Galvanizado',
        categoria: 'Equipamentos',
        preco: 280.0,
        quantidade: 5,
        qualidade: 'Nova',
        descricao: 'Fumigador galvanizado profissional com proteção térmica.',
        status: 'disponivel',
      },
      {
        usuario_id: user._id,
        nome: 'Colmeia Langstroth Completa',
        categoria: 'Equipamentos',
        preco: 350.0,
        quantidade: 10,
        qualidade: 'Nova',
        descricao: 'Colmeia padrão Langstroth completa de madeira eucalipto.',
        status: 'disponivel',
      },
    ]);
    logger.info(`📦 ${produtos.length} produtos adicionados ao estoque.`);

    // 4. Criar Contas a Pagar
    const hoje = new Date();
    const addDias = (dias: number) => {
      const d = new Date();
      d.setDate(hoje.getDate() + dias);
      return d;
    };

    const contasPagar = await BillPayable.insertMany([
      {
        usuario_id: user._id,
        nome_devedor: 'Lojas Americanas',
        apelido: 'Compra de Equipamento',
        descricao: 'Parcela de computadores para o escritório',
        valor: 1500.0,
        data_vencimento: addDias(5),
        contato: 'sac@americanas.com',
        status: 'pendente',
      },
      {
        usuario_id: user._id,
        nome_devedor: 'Copel Energia',
        apelido: 'Conta de Luz',
        descricao: 'Energia elétrica do escritório central',
        valor: 350.0,
        data_vencimento: addDias(-2), // Vencida
        contato: 'contato@copel.com',
        status: 'atrasado',
      },
      {
        usuario_id: user._id,
        nome_devedor: 'HostGator Hospedagem',
        apelido: 'Hospedagem Web',
        descricao: 'Hospedagem anual do servidor',
        valor: 240.0,
        data_vencimento: addDias(12),
        contato: 'financeiro@hostgator.com.br',
        status: 'pendente',
      },
    ]);
    logger.info(`💸 ${contasPagar.length} contas a pagar inseridas.`);

    // 5. Criar Contas a Receber
    const contasReceber = await BillReceivable.insertMany([
      {
        usuario_id: user._id,
        nome_devedor: 'Maria Oliveira',
        apelido: 'Venda de Mel Silvestre',
        descricao: '10x Mel Silvestre 1kg',
        valor: 450.0,
        data_vencimento: addDias(7),
        contato: '(11) 97777-7777',
        status: 'pendente',
      },
      {
        usuario_id: user._id,
        nome_devedor: 'Carlos Mendes',
        apelido: 'Aluguel de Equipamento',
        descricao: 'Fumigador Profissional',
        valor: 120.0,
        data_vencimento: addDias(-5), // Atrasado
        contato: '(11) 96666-6666',
        status: 'atrasado',
      },
    ]);
    logger.info(`💰 ${contasReceber.length} contas a receber inseridas.`);

    // 6. Criar Lançamentos no Extrato
    await FinancialExtract.insertMany([
      {
        usuario_id: user._id,
        tipo: 'Entrada',
        categoria: 'Vendas',
        titulo: 'Venda de Mel Silvestre',
        descricao: 'Pagamento via Pix efetuado',
        valor: 450.0,
        data_pagamento: new Date(),
        status: 'Pago',
        nome_contato: 'Maria Oliveira',
      },
      {
        usuario_id: user._id,
        tipo: 'Saida',
        categoria: 'Operacional',
        titulo: 'Compra de Insumos',
        descricao: 'Caixas de madeira para apicultura',
        valor: 210.0,
        data_pagamento: new Date(),
        status: 'Pago',
        nome_contato: 'Fornecedor Madeira Ltda',
      },
    ]);
    logger.info('📋 Lançamentos do extrato financeiro inicializados.');

    logger.info('🎉 Seed concluído com sucesso!');
  } catch (error) {
    logger.error('❌ Erro ao executar seed:', error);
  } finally {
    await disconnectDatabase();
  }
}

seed();
