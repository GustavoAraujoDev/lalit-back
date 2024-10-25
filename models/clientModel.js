class Cliente {
  static idrandom = 10;
  constructor(nome, email, cpf, telefone) {
    this.clientid = Cliente.idrandom++;
    this.nome = nome;
    this.email = email;
    this.cpf = cpf;
    this.telefone = telefone;
    this.createdAt = new Date().toISOString(); // Data de criação
    this.updatedAt = new Date().toISOString(); // Data de atualização
  }

  // Validação de CPF
  static validarCpf(cpf) {
    const regex = /^\d{11}$/;
    if (!regex.test(cpf)) {
      throw new Error('CPF must be 11 digits');
    }
  }

  // Validação de Email
  static validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  // Validação de Telefone
  static validarTelefone(telefone) {
    const regex = /^\+?[1-9]\d{1,14}$/;
    if (telefone && !regex.test(telefone)) {
      throw new Error('Telefone must be a valid phone number');
    }
  }
}

module.exports = Cliente;
