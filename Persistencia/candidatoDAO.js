import Candidato from "../Modelo/canditato.js";
import Vaga from "../Modelo/vaga.js";
import conectar from "./conexao.js";

export default class CandidatoDAO {
    constructor() {
        this.init();
    }

    async init() {
        try {
            const conexao = await conectar();
            const sql = `
                CREATE TABLE IF NOT EXISTS candidato (
                    cand_codigo INT NOT NULL AUTO_INCREMENT,
                    cand_nome VARCHAR(100) NOT NULL,
                    cand_cpf VARCHAR(14) NOT NULL,
                    cand_idade INT NOT NULL,
                    cand_telefone VARCHAR(15) NOT NULL,
                    vaga_codigo INT NOT NULL,
                    CONSTRAINT pk_candidato PRIMARY KEY (cand_codigo),
                    CONSTRAINT fk_candidato_vaga FOREIGN KEY (vaga_codigo) REFERENCES vaga (vaga_codigo)
                );`;
            await conexao.execute(sql);
            global.poolConexoes.releaseConnection(conexao);
        } catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async gravar(candidato) {
        if (candidato instanceof Candidato) {
            const sql = "INSERT INTO candidato (cand_nome, cand_cpf, cand_idade, cand_telefone, vaga_codigo) VALUES (?, ?, ?, ?, ?)";
            const parametros = [candidato.nome, candidato.cpf, candidato.idade, candidato.telefone, candidato.vaga.codigo];
            const conexao = await conectar();
            const retorno = await conexao.execute(sql, parametros);
            candidato.codigo = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(candidato) {
        if (candidato instanceof Candidato) {
            const sql = "UPDATE candidato SET cand_nome = ?, cand_cpf = ?, cand_idade = ?, cand_telefone = ?, vaga_codigo = ? WHERE cand_codigo = ?";
            const parametros = [candidato.nome, candidato.cpf, candidato.idade, candidato.telefone, candidato.vaga.codigo, candidato.codigo];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(candidato) {
        if (candidato instanceof Candidato) {
            const sql = "DELETE FROM candidato WHERE cand_codigo = ?";
            const parametros = [candidato.codigo];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(parametroConsulta) {
        let sql = '';
        let parametros = [];
        if (!isNaN(parseInt(parametroConsulta))) {
            sql = `
                SELECT c.*, v.vaga_cargo
                FROM candidato c
                INNER JOIN vaga v ON c.vaga_codigo = v.vaga_codigo
                WHERE c.cand_codigo = ?
                ORDER BY c.cand_nome`;
            parametros = [parametroConsulta];
        } else {
            if (!parametroConsulta) {
                parametroConsulta = '';
            }
            sql = `
                SELECT c.*, v.vaga_cargo
                FROM candidato c
                INNER JOIN vaga v ON c.vaga_codigo = v.vaga_codigo
                WHERE c.cand_nome LIKE ?
                ORDER BY c.cand_nome`;
            parametros = ['%' + parametroConsulta + '%'];
        }
        const conexao = await conectar();
        const [registros] = await conexao.execute(sql, parametros);
        global.poolConexoes.releaseConnection(conexao);
        let listaCandidatos = [];
        for (const registro of registros) {
            const vaga = new Vaga(registro.vaga_codigo, registro.vaga_cargo);
            const candidato = new Candidato(
                registro.cand_codigo,
                registro.cand_nome,
                registro.cand_cpf,
                registro.cand_idade,
                registro.cand_telefone,
                vaga
            );
            listaCandidatos.push(candidato);
        }
        return listaCandidatos;
    }
}
