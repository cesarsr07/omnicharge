import { User } from '../models/User';
import { ICreateUserDTO, IUpdateUserDTO, IUser } from '../types/user.types';

export class UserService {
  async criar(dados: ICreateUserDTO): Promise<Omit<IUser, 'senha_hash'>> {
    const usuarioExistente = await User.findOne({ email: dados.email.toLowerCase() });
    if (usuarioExistente) {
      throw new Error('Já existe um usuário cadastrado com este e-mail');
    }

    const usuario = new User({
      ...dados,
      email: dados.email.toLowerCase(),
    });

    await usuario.save();
    const userObj = usuario.toObject();
    delete (userObj as Partial<IUser>).senha_hash;
    return userObj as Omit<IUser, 'senha_hash'>;
  }

  async listar(filtro: { nome?: string; email?: string; tipo?: string } = {}): Promise<IUser[]> {
    const query: Record<string, unknown> = {};

    if (filtro.nome) {
      query.nome = { $regex: filtro.nome, $options: 'i' };
    }
    if (filtro.email) {
      query.email = filtro.email.toLowerCase();
    }
    if (filtro.tipo) {
      query.tipo = filtro.tipo;
    }

    return User.find(query).select('-senha_hash').sort({ nome: 1 });
  }

  async buscarPorId(id: string): Promise<IUser | null> {
    return User.findById(id).select('-senha_hash');
  }

  async buscarPorEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email: email.toLowerCase() });
  }

  async editar(id: string, dados: IUpdateUserDTO): Promise<IUser | null> {
    const usuario = await User.findByIdAndUpdate(
      id,
      { $set: dados },
      { new: true, runValidators: true }
    ).select('-senha_hash');

    return usuario;
  }

  async excluir(id: string): Promise<{ id: string } | null> {
    const deletado = await User.findByIdAndDelete(id);
    if (!deletado) return null;
    return { id };
  }
}

export const userService = new UserService();
