import CandidatoDAO from "../Persistencia/candidatoDAO.js";
import Vaga from "./vaga.js";

export default class Candidato {
    #codigo;
    #nome;
    #cpf;
    #idade;
    #telefone;
    #vaga;

    constructor(codigo = 0, nome = "", cpf = "", idade = 0, telefone = "", vaga = null) {
        this.#codigo = codigo;
        this.#nome = nome;
        this.#cpf = cpf;
        this.#idade = idade;
        this.#telefone = telefone;
        this.#vaga = vaga;
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

    get cpf() {
        return this.#cpf;
    }
    set cpf(novoCpf) {
        this.#cpf = novoCpf;
    }

    get idade() {
        return this.#idade;
    }
    set idade(novaIdade) {
        this.#idade = novaIdade;
    }

    get telefone() {
        return this.#telefone;
    }
    set telefone(novoTelefone) {
        this.#telefone = novoTelefone;
    }

    get vaga() {
        return this.#vaga;
    }
    set vaga(novaVaga) {
        if (novaVaga instanceof Vaga) {
            this.#vaga = novaVaga;
        }
    }

    toJSON() {
        return {
            codigo: this.#codigo,
            nome: this.#nome,
            cpf: this.#cpf,
            idade: this.#idade,
            telefone: this.#telefone,
            vaga: this.#vaga ? this.#vaga.toJSON() : null
        };
    }

    async gravar() {
        const candidatoDAO = new CandidatoDAO();
        await candidatoDAO.gravar(this);
    }

    async excluir() {
        const candidatoDAO = new CandidatoDAO();
        await candidatoDAO.excluir(this);
    }

    async alterar() {
        const candidatoDAO = new CandidatoDAO();
        await candidatoDAO.atualizar(this);
    }

    async consultar(termo) {
        const candidatoDAO = new CandidatoDAO();
        return await candidatoDAO.consultar(termo);
    }
}
