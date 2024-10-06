import InscricaoDAO from "../Persistencia/inscricaoDAO.js";

export default class Inscricao {

    #codigo;
    #candidatoId;
    #vagaId;

    constructor(codigo = 0, candidatoId = 0, vagaId = 0) {
        this.#codigo = codigo;
        this.#candidatoId = candidatoId;
        this.#vagaId = vagaId;
    }

    get codigo() {
        return this.#codigo;
    }

    set codigo(novoCodigo) {
        this.#codigo = novoCodigo;
    }

    get candidatoId() {
        return this.#candidatoId;
    }

    set candidatoId(novoCandidatoId) {
        this.#candidatoId = novoCandidatoId;
    }

    get vagaId() {
        return this.#vagaId;
    }

    set vagaId(novoVagaId) {
        this.#vagaId = novoVagaId;
    }

    toJSON() {
        return {
            codigo: this.#codigo,
            candidatoId: this.#candidatoId,
            vagaId: this.#vagaId
        };
    }

    async gravar() {
        const inscricaoDAO = new InscricaoDAO();
        await inscricaoDAO.gravar(this);
    }

    async excluir() {
        const inscricaoDAO = new InscricaoDAO();
        await inscricaoDAO.excluir(this);
    }

    async atualizar() {
        const inscricaoDAO = new InscricaoDAO();
        await inscricaoDAO.atualizar(this);
    }

    async consultar(parametro) {
        const inscricaoDAO = new InscricaoDAO();
        return await inscricaoDAO.consultar(parametro);
    }
}
