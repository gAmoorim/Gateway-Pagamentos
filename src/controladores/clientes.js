const pool = require('../conexao');

const listar = async (req, res) => {
    try {
        const clientes = await pool.query('SELECT * FROM clientes');
        return res.json(clientes.rows);
    } catch (error) {
        console.error('Erro ao buscar clientes:', error); 
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
}

const cadastrar = async (req, res) => {
    const { nome, email, telefone } = req.body;

    if (!nome || !email || !telefone) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }

    try {
        const queryClienteEmail = 'SELECT * FROM clientes WHERE email = $1';
        const emailExistente = await pool.query(queryClienteEmail, [email]);

        if (emailExistente.rowCount > 0) {
            return res.status(400).json({ mensagem: 'E-mail informado já está cadastrado' });
        }

        const query = `INSERT INTO clientes (nome, email, telefone) VALUES ($1, $2, $3) RETURNING *`;
        const params = [nome, email, telefone];
        const cliente = await pool.query(query, params);

        return res.status(201).json(cliente.rows[0]);
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
}

module.exports = {
    listar,
    cadastrar
}
