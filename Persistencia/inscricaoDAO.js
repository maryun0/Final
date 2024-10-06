import Inscricao from "../Modelo/inscricao.js";
import Candidato from "../Modelo/canditato.js";
import Vaga from "../Modelo/vaga.js";
import conectar from "./conexao.js";

export default class InscricaoDAO {
    async gravar(inscricao) {
        if (inscricao instanceof Inscricao) {
            const conexao = await conectar();

            await conexao.beginTransaction();
            try {

                const sql = 'INSERT INTO inscricao (cand_codigo, vaga_codigo) VALUES (?, ?)';
                const parametros = [inscricao.candidatoId, inscricao.vagaId];
                await conexao.execute(sql, parametros);
                await conexao.commit();
            } catch (error) {
                await conexao.rollback();
                throw error;
            } finally {
                global.poolConexoes.releaseConnection(conexao);
            }
        }
    }

    async excluir(inscricao) {
        if (inscricao instanceof Inscricao) {
            const conexao = await conectar();
            await conexao.beginTransaction();
            try {
                const sql = 'DELETE FROM inscricao WHERE cand_codigo = ? AND vaga_codigo = ?';
                const parametros = [inscricao.candidatoId, inscricao.vagaId];
                await conexao.execute(sql, parametros);
                await conexao.commit();
            } catch (error) {
                await conexao.rollback();
                throw error;
            } finally {
                global.poolConexoes.releaseConnection(conexao);
            }
        }
    }

    async consultarPorCandidato(candCodigo) {
        const conexao = await conectar();
        const sql = `
            SELECT i.cand_codigo, i.vaga_codigo,
                   c.cand_nome, c.cand_email,
                   v.vaga_titulo, v.vaga_descricao, v.vaga_salario
            FROM inscricao i
            INNER JOIN candidato c ON i.cand_codigo = c.cand_codigo
            INNER JOIN vaga v ON i.vaga_codigo = v.vaga_codigo
            WHERE i.cand_codigo = ?`;
        const [registros] = await conexao.execute(sql, [candCodigo]);
        global.poolConexoes.releaseConnection(conexao);
        
        const listaInscricoes = [];
        for (const registro of registros) {
            const candidato = new Candidato(registro.cand_codigo, registro.cand_nome, registro.cand_email);
            const vaga = new Vaga(
                registro.vaga_codigo,
                registro.vaga_titulo,
                registro.vaga_descricao,
                registro.vaga_salario
            );
            const inscricao = new Inscricao(candidato.codigo, candidato.codigo, vaga.codigo);
            listaInscricoes.push(inscricao);
        }
        return listaInscricoes;
    }

    async consultarPorVaga(vagaCodigo) {
        const conexao = await conectar();
        const sql = `
            SELECT i.cand_codigo, i.vaga_codigo,
                   c.cand_nome, c.cand_email,
                   v.vaga_titulo, v.vaga_descricao, v.vaga_salario
            FROM inscricao i
            INNER JOIN candidato c ON i.cand_codigo = c.cand_codigo
            INNER JOIN vaga v ON i.vaga_codigo = v.vaga_codigo
            WHERE i.vaga_codigo = ?`;
        const [registros] = await conexao.execute(sql, [vagaCodigo]);
        global.poolConexoes.releaseConnection(conexao);

        const listaInscricoes = [];
        for (const registro of registros) {
            const candidato = new Candidato(registro.cand_codigo, registro.cand_nome, registro.cand_email);
            const vaga = new Vaga(
                registro.vaga_codigo,
                registro.vaga_titulo,
                registro.vaga_descricao,
                registro.vaga_salario
            );
            const inscricao = new Inscricao(candidato.codigo, candidato.codigo, vaga.codigo);
            listaInscricoes.push(inscricao);
        }
        return listaInscricoes;
    }
}
