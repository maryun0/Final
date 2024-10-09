import VagaDAO from "../Persistencia/vagaDAO.js";

export default class Vaga {

    #codigo;
    #cargo;
    #salario;
    #cidade;

    constructor(codigo = 0, cargo = '', salario = 0.0, cidade = '') {
        this.#codigo = codigo;
        this.#cargo = cargo;
        this.#salario = salario;
        this.#cidade = cidade;
    }

    // Getters e Setters
    get codigo() {
        return this.#codigo;
    }

    set codigo(novoCodigo) {
        this.#codigo = novoCodigo;
    }

    get cargo() {
        return this.#cargo;
    }

    set cargo(novoCargo) {
        this.#cargo = novoCargo;
    }

    get salario() {
        return this.#salario;
    }

    set salario(novoSalario) {
        this.#salario = novoSalario;
    }

    get cidade() {
        return this.#cidade;
    }

    set cidade(novaCidade) {
        this.#cidade = novaCidade;
    }

    
    toJSON() {
        return {
            codigo: this.#codigo,
            cargo: this.#cargo,
            salario: this.#salario,
            cidade: this.#cidade
        };
    }

   
    async gravar() {
        const vagaDAO = new VagaDAO();
        await vagaDAO.gravar(this);
    }

    async excluir() {
        const vagaDAO = new VagaDAO();
        await vagaDAO.excluir(this);
    }

    async atualizar() {
        const vagaDAO = new VagaDAO();
        await vagaDAO.atualizar(this);
    }

    async consultar(parametro) {
        const vagaDAO = new VagaDAO();
        return await vagaDAO.consultar(parametro);
    }
}
