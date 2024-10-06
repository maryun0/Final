// Persistencia/candidatoDAO.js
import Candidato from '../Modelo/canditato.js';
import Vaga from '../Modelo/vaga.js';
import conectar from './conexao.js';

export default class CandidatoDAO {

    async criarTabelaCandidato() {
        const conexao = await conectar();
        const sql = `
            CREATE TABLE IF NOT EXISTS candidato (
                can_codigo INT NOT NULL AUTO_INCREMENT,
                can_nome VARCHAR(100) NOT NULL,
                can_email VARCHAR(100) NOT NULL,
                can_telefone VARCHAR(20),
                CONSTRAINT pk_candidato PRIMARY KEY (can_codigo)
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

    async gravar(candidato) {
        await this.criarTabelaCandidato();
        await this.criarTabelaCandidatoVaga();
        if (candidato instanceof Candidato) {
            const sql = "INSERT INTO candidato (can_nome, can_email, can_telefone) VALUES (?, ?, ?)";
            const parametros = [candidato.nome, candidato.email, candidato.telefone];
            const conexao = await conectar();
            try {
                const retorno = await conexao.execute(sql, parametros);
                candidato.codigo = retorno[0].insertId;

      
                if (candidato.vagas && candidato.vagas.length > 0) {
                    for (const vaga of candidato.vagas) {
                        const sqlAssociacao = "INSERT INTO candidato_vaga (can_codigo, vag_codigo) VALUES (?, ?)";
                        await conexao.execute(sqlAssociacao, [candidato.codigo, vaga.codigo]);
                    }
                }
            } finally {
                global.poolConexoes.releaseConnection(conexao);
            }
        }
    }

    async atualizar(candidato) {
        await this.criarTabelaCandidato();
        await this.criarTabelaCandidatoVaga();
        if (candidato instanceof Candidato) {
            const sql = "UPDATE candidato SET can_nome = ?, can_email = ?, can_telefone = ? WHERE can_codigo = ?";
            const parametros = [candidato.nome, candidato.email, candidato.telefone, candidato.codigo];
            const conexao = await conectar();
            try {
                await conexao.execute(sql, parametros);

                
                const sqlDeleteAssociacoes = "DELETE FROM candidato_vaga WHERE can_codigo = ?";
                await conexao.execute(sqlDeleteAssociacoes, [candidato.codigo]);

                if (candidato.vagas && candidato.vagas.length > 0) {
                    for (const vaga of candidato.vagas) {
                        const sqlAssociacao = "INSERT INTO candidato_vaga (can_codigo, vag_codigo) VALUES (?, ?)";
                        await conexao.execute(sqlAssociacao, [candidato.codigo, vaga.codigo]);
                    }
                }
            } finally {
                global.poolConexoes.releaseConnection(conexao);
            }
        }
    }

    async excluir(candidato) {
        await this.criarTabelaCandidato();
        if (candidato instanceof Candidato) {
            const sql = "DELETE FROM candidato WHERE can_codigo = ?";
            const parametros = [candidato.codigo];
            const conexao = await conectar();
            try {
                await conexao.execute(sql, parametros);
               
            } finally {
                global.poolConexoes.releaseConnection(conexao);
            }
        }
    }

    async consultar(parametro) {
        await this.criarTabelaCandidato();
        await this.criarTabelaCandidatoVaga();
        let sql = '';
        let parametros = [];
        if (!parametro) {
            sql = "SELECT * FROM candidato";
            parametros = [];
        } else if (!isNaN(parseInt(parametro))) {
            sql = "SELECT * FROM candidato WHERE can_codigo = ?";
            parametros = [parametro];
        } else {
            sql = "SELECT * FROM candidato WHERE can_nome LIKE ?";
            parametros = ['%' + parametro + '%'];
        }
        const conexao = await conectar();
        try {
            const [registrosCandidatos] = await conexao.execute(sql, parametros);
            let listaCandidatos = [];
            for (const registro of registrosCandidatos) {
                const candidato = new Candidato(
                    registro.can_codigo,
                    registro.can_nome,
                    registro.can_email,
                    registro.can_telefone
                );

        
                const sqlVagas = `
                    SELECT v.*
                    FROM vaga v
                    INNER JOIN candidato_vaga cv ON v.vag_codigo = cv.vag_codigo
                    WHERE cv.can_codigo = ?
                `;
                const [registrosVagas] = await conexao.execute(sqlVagas, [candidato.codigo]);
                let vagas = [];
                for (const regVaga of registrosVagas) {
                    const vaga = new Vaga(
                        regVaga.vag_codigo,
                        regVaga.vag_titulo,
                        regVaga.vag_descricao,
                        regVaga.vag_localizacao,
                        regVaga.vag_salario
                    );
                    vagas.push(vaga);
                }
                candidato.vagas = vagas;
                listaCandidatos.push(candidato);
            }
            return listaCandidatos;
        } finally {
            global.poolConexoes.releaseConnection(conexao);
        }
    }
}
