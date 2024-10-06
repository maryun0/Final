// Modelo/candidato.js
import CandidatoDAO from "../Persistencia/candidatoDAO.js";
import Vaga from "./vaga.js";

export default class Candidato {
    #codigo;
    #nome;
    #email;
    #telefone;
    #vagas; // Lista de vagas associadas

    constructor(codigo = 0, nome = '', email = '', telefone = '', vagas = []) {
        this.#codigo = codigo;
        this.#nome = nome;
        this.#email = email;
        this.#telefone = telefone;
        this.#vagas = vagas;
    }

    get codigo() {
        return this.#codigo;
    }

    set codigo(novoCodigo) {
        this.#codigo = novoCodigo;
    }

    get nome() {
        return this.#nome;
    }

    set nome(novoNome) {
        this.#nome = novoNome;
    }

    get email() {
        return this.#email;
    }

    set email(novoEmail) {
        this.#email = novoEmail;
    }

    get telefone() {
        return this.#telefone;
    }

    set telefone(novoTelefone) {
        this.#telefone = novoTelefone;
    }

    get vagas() {
        return this.#vagas;
    }

    set vagas(novasVagas) {
        this.#vagas = novasVagas;
    }

    toJSON() {
        return {
            codigo: this.#codigo,
            nome: this.#nome,
            email: this.#email,
            telefone: this.#telefone,
            vagas: this.#vagas.map(v => v.toJSON())
        };
    }

    async gravar() {
        const candidatoDAO = new CandidatoDAO();
        await candidatoDAO.gravar(this);
    }

    async atualizar() {
        const candidatoDAO = new CandidatoDAO();
        await candidatoDAO.atualizar(this);
    }

    async excluir() {
        const candidatoDAO = new CandidatoDAO();
        await candidatoDAO.excluir(this);
    }

    async consultar(parametro) {
        const candidatoDAO = new CandidatoDAO();
        return await candidatoDAO.consultar(parametro);
    }
}
