import Vaga from "../Modelo/vaga.js";
import conectar from "./conexao.js";

export default class VagaDAO {

    constructor() {
        this.init();
    }

    async init() {
        try {
            const conexao = await conectar(); 
            const sql = `
                CREATE TABLE IF NOT EXISTS vaga(
                    vaga_codigo INT NOT NULL AUTO_INCREMENT,
                    vaga_cargo VARCHAR(100) NOT NULL,
                    vaga_salario DECIMAL(10, 2) NOT NULL,
                    vaga_cidade VARCHAR(100) NOT NULL,
                    CONSTRAINT pk_vaga PRIMARY KEY(vaga_codigo)
                );`;
            await conexao.execute(sql);
            global.poolConexoes.releaseConnection(conexao); 
        } catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async gravar(vaga) {
        if (vaga instanceof Vaga) {
            const sql = "INSERT INTO vaga(vaga_cargo, vaga_salario, vaga_cidade) VALUES(?, ?, ?)"; 
            const parametros = [vaga.cargo, vaga.salario, vaga.cidade];
            const conexao = await conectar(); 
            const retorno = await conexao.execute(sql, parametros); 
            vaga.codigo = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(vaga) {
        if (vaga instanceof Vaga) {
            const sql = "UPDATE vaga SET vaga_cargo = ?, vaga_salario = ?, vaga_cidade = ? WHERE vaga_codigo = ?"; 
            const parametros = [vaga.cargo, vaga.salario, vaga.cidade, vaga.codigo];
            const conexao = await conectar(); 
            await conexao.execute(sql, parametros); 
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(vaga) {
        if (vaga instanceof Vaga) {
            const sql = "DELETE FROM vaga WHERE vaga_codigo = ?"; 
            const parametros = [vaga.codigo];
            const conexao = await conectar(); 
            await conexao.execute(sql, parametros); 
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(parametroConsulta) {
        let sql = '';
        let parametros = [];
      
        if (!isNaN(parseInt(parametroConsulta))) {
            sql = 'SELECT * FROM vaga WHERE vaga_codigo = ? ORDER BY vaga_cargo';
            parametros = [parametroConsulta];
        } else {
            if (!parametroConsulta) {
                parametroConsulta = '';
            }
            sql = "SELECT * FROM vaga WHERE vaga_cargo LIKE ? ORDER BY vaga_cargo";
            parametros = ['%' + parametroConsulta + '%'];
        }
        const conexao = await conectar();
        const [registros] = await conexao.execute(sql, parametros);
        global.poolConexoes.releaseConnection(conexao);
        
        let listaVagas = [];
        for (const registro of registros) {
            const vaga = new Vaga(registro.vaga_codigo, registro.vaga_cargo, registro.vaga_salario, registro.vaga_cidade);
            listaVagas.push(vaga);
        }
        return listaVagas;
    }
}
