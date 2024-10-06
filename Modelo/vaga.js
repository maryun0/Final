import VagaDAO from "../Persistencia/vagaDAO.js";
import Candidato from "./canditato.js";

export default class Vaga {
    #codigo;
    #titulo;
    #descricao;
    #localizacao;
    #salario;

    constructor(codigo = 0, titulo = '', descricao = '', localizacao = '', salario = 0.0) {
        this.#codigo = codigo;
        this.#titulo = titulo;
        this.#descricao = descricao;
        this.#localizacao = localizacao;
        this.#salario = salario;
    }

    get codigo() {
        return this.#codigo;
    }

    set codigo(novoCodigo) {
        this.#codigo = novoCodigo;
    }

    get titulo() {
        return this.#titulo;
    }

    set titulo(novoTitulo) {
        this.#titulo = novoTitulo;
    }

    get descricao() {
        return this.#descricao;
    }

    set descricao(novaDescricao) {
        this.#descricao = novaDescricao;
    }

    get localizacao() {
        return this.#localizacao;
    }

    set localizacao(novaLocalizacao) {
        this.#localizacao = novaLocalizacao;
    }

    get salario() {
        return this.#salario;
    }

    set salario(novoSalario) {
        this.#salario = novoSalario;
    }

    toJSON() {
        return {
            codigo: this.#codigo,
            titulo: this.#titulo,
            descricao: this.#descricao,
            localizacao: this.#localizacao,
            salario: this.#salario
        };
    }

    async gravar() {
        const vagaDAO = new VagaDAO();
        await vagaDAO.gravar(this);
    }

    async atualizar() {
        const vagaDAO = new VagaDAO();
        await vagaDAO.atualizar(this);
    }

    async excluir() {
        const vagaDAO = new VagaDAO();
        await vagaDAO.excluir(this);
    }

    async consultar(parametro) {
        const vagaDAO = new VagaDAO();
        return await vagaDAO.consultar(parametro);
    }

    async obterCandidatos() {
        const vagaDAO = new VagaDAO();
        return await vagaDAO.obterCandidatos(this);
    }
}
