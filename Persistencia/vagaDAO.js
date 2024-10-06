import Vaga from "../Modelo/vaga.js";
import Candidato from "../Modelo/canditato.js";
import conectar from "./conexao.js";

export default class VagaDAO {

    async criarTabelaVaga() {
        const conexao = await conectar();
        const sql = `
            CREATE TABLE IF NOT EXISTS vaga (
                vag_codigo INT NOT NULL AUTO_INCREMENT,
                vag_titulo VARCHAR(200) NOT NULL,
                vag_descricao TEXT,
                vag_localizacao VARCHAR(100),
                vag_salario DECIMAL(10,2),
                CONSTRAINT pk_vaga PRIMARY KEY (vag_codigo)
            );
        `;
        await conexao.execute(sql);
        global.poolConexoes.releaseConnection(conexao);
    }

    async criarTabelaCandidatoVaga() {
        const conexao = await conectar();
        const sql = `
            CREATE TABLE IF NOT EXISTS candidato_vaga (
                can_codigo INT NOT NULL,
                vag_codigo INT NOT NULL,
                CONSTRAINT pk_candidato_vaga PRIMARY KEY (can_codigo, vag_codigo),
                CONSTRAINT fk_candidato_vaga_candidato FOREIGN KEY (can_codigo) REFERENCES candidato (can_codigo) ON DELETE CASCADE,
                CONSTRAINT fk_candidato_vaga_vaga FOREIGN KEY (vag_codigo) REFERENCES vaga (vag_codigo) ON DELETE CASCADE
            );
        `;
        await conexao.execute(sql);
        global.poolConexoes.releaseConnection(conexao);
    }

    async gravar(vaga) {
        await this.criarTabelaVaga();
        if (vaga instanceof Vaga) {
            const sql = "INSERT INTO vaga (vag_titulo, vag_descricao, vag_localizacao, vag_salario) VALUES (?, ?, ?, ?)";
            const parametros = [vaga.titulo, vaga.descricao, vaga.localizacao, vaga.salario];
            const conexao = await conectar();
            try {
                const retorno = await conexao.execute(sql, parametros);
                vaga.codigo = retorno[0].insertId;
            } finally {
                global.poolConexoes.releaseConnection(conexao);
            }
        }
    }

    async atualizar(vaga) {
        await this.criarTabelaVaga();
        if (vaga instanceof Vaga) {
            const sql = "UPDATE vaga SET vag_titulo = ?, vag_descricao = ?, vag_localizacao = ?, vag_salario = ? WHERE vag_codigo = ?";
            const parametros = [vaga.titulo, vaga.descricao, vaga.localizacao, vaga.salario, vaga.codigo];
            const conexao = await conectar();
            try {
                await conexao.execute(sql, parametros);
            } finally {
                global.poolConexoes.releaseConnection(conexao);
            }
        }
    }

    async excluir(vaga) {
        await this.criarTabelaVaga();
        if (vaga instanceof Vaga) {
            const sql = "DELETE FROM vaga WHERE vag_codigo = ?";
            const parametros = [vaga.codigo];
            const conexao = await conectar();
            try {
                await conexao.execute(sql, parametros);
            } finally {
                global.poolConexoes.releaseConnection(conexao);
            }
        }
    }

    async consultar(parametro) {
        await this.criarTabelaVaga();
        let sql = '';
        let parametros = [];
        if (!isNaN(parseInt(parametro))) {
            sql = "SELECT * FROM vaga WHERE vag_codigo = ?";
            parametros = [parametro];
        } else {
            sql = "SELECT * FROM vaga WHERE vag_titulo LIKE ?";
            parametros = ['%' + parametro + '%'];
        }
        const conexao = await conectar();
        try {
            const [registros] = await conexao.execute(sql, parametros);
            let listaVagas = [];
            for (const registro of registros) {
                const vaga = new Vaga(
                    registro.vag_codigo,
                    registro.vag_titulo,
                    registro.vag_descricao,
                    registro.vag_localizacao,
                    registro.vag_salario
                );
                listaVagas.push(vaga);
            }
            return listaVagas;
        } finally {
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async obterCandidatos(vaga) {
        await this.criarTabelaCandidatoVaga();
        if (vaga instanceof Vaga) {
            const sql = `
                SELECT c.*
                FROM candidato c
                INNER JOIN candidato_vaga cv ON c.can_codigo = cv.can_codigo
                WHERE cv.vag_codigo = ?
            `;
            const parametros = [vaga.codigo];
            const conexao = await conectar();
            try {
                const [registros] = await conexao.execute(sql, parametros);
                let listaCandidatos = [];
                for (const registro of registros) {
                    const candidato = new Candidato(
                        registro.can_codigo,
                        registro.can_nome,
                        registro.can_email,
                        registro.can_telefone
                    );
                    listaCandidatos.push(candidato);
                }
                return listaCandidatos;
            } finally {
                global.poolConexoes.releaseConnection(conexao);
            }
        }
    }
}
