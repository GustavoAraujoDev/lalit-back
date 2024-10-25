class Produto {
  static idrandom = 10;
  constructor(nome, descricao, preco, precovenda, quantidade) {
    this.productid = Produto.idrandom++; // ID do produto
    this.nome = nome; // Nome do produto
    this.descricao = descricao; // Descrição do produto
    this.preco = preco; // Preço do produto
    this.precovenda = precovenda; // Preço de venda
    this.quantidade = quantidade; // Quantidade disponível
    this.createdAt = new Date().toISOString(); // Data de criação
    this.updatedAt = new Date().toISOString(); // Data de atualização
  }
}

module.exports = Produto;
