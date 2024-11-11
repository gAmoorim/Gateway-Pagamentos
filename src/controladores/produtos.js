const pool = require('../conexao');

const listar = async (req, res) => {
    try {
        const produtos = await pool.query('SELECT * FROM produtos');
        return res.json(produtos.rows);
    } catch (error) {
        console.error('Erro ao listar produtos:', error);
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
}

const cadastrar = async (req, res) => {
    const { nome, descricao, valor } = req.body;

    if (!nome || !descricao || valor === undefined || isNaN(valor)) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios e o valor deve ser numérico' });
    }

    try {
        const query = `INSERT INTO produtos (nome, descricao, valor) VALUES ($1, $2, $3) RETURNING *`;
        const params = [nome, descricao, valor];
        const produto = await pool.query(query, params);

        return res.status(201).json(produto.rows[0]);
    } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
}

module.exports = {
    listar,
    cadastrar
}
