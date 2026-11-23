import { Contact } from '../models/Contact';
import { IContact, ICreateContactDTO, IUpdateContactDTO } from '../types/contact.types';

export class ContactService {
  async criarOuRetornar(dados: ICreateContactDTO): Promise<IContact> {
    const existente = await this.buscarPorNomeExato(dados.usuario_id, dados.nome);
    if (existente) {
      const atualizacoes: Partial<IContact> = {};
      if (dados.telefone && !existente.telefone) atualizacoes.telefone = dados.telefone;
      if (dados.email && !existente.email) atualizacoes.email = dados.email;

      if (Object.keys(atualizacoes).length > 0) {
        const atualizado = await this.editar(existente.id, atualizacoes);
        return atualizado || existente;
      }
      return existente;
    }

    return this.criar(dados);
  }

  async criar(dados: ICreateContactDTO): Promise<IContact> {
    const contato = new Contact(dados);
    return contato.save();
  }

  async listar(usuario_id: string): Promise<IContact[]> {
    return Contact.find({ usuario_id }).sort({ nome: 1 });
  }

  async buscarPorNome(usuario_id: string, termo: string): Promise<IContact[]> {
    return Contact.find({
      usuario_id,
      nome: { $regex: termo, $options: 'i' },
    })
      .sort({ nome: 1 })
      .limit(10);
  }

  async buscarPorNomeExato(usuario_id: string, nome: string): Promise<IContact | null> {
    return Contact.findOne({
      usuario_id,
      nome: { $regex: `^${nome.trim()}$`, $options: 'i' },
    });
  }

  async buscarPorId(id: string): Promise<IContact | null> {
    return Contact.findById(id);
  }

  async editar(id: string, dados: IUpdateContactDTO): Promise<IContact | null> {
    return Contact.findByIdAndUpdate(id, { $set: dados }, { new: true, runValidators: true });
  }

  async excluir(id: string, usuario_id: string): Promise<{ id: string } | null> {
    const deletado = await Contact.findOneAndDelete({ _id: id, usuario_id });
    if (!deletado) return null;
    return { id };
  }
}

export const contactService = new ContactService();
