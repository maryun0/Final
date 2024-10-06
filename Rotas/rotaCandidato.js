// Rotas/rotaCandidato.js
import { Router } from "express";
import CandidatoCtrl from "../Controle/candidatoCtrl.js";

const candidatoCtrl = new CandidatoCtrl();
const rotaCandidato = new Router();

rotaCandidato
    .get('/', candidatoCtrl.consultar)           // Consulta todos os candidatos
    .get('/:termo', candidatoCtrl.consultar)     // Consulta candidatos por termo
    .post('/', candidatoCtrl.gravar)             // Cria um novo candidato
    .patch('/', candidatoCtrl.atualizar)         // Atualiza um candidato
    .put('/', candidatoCtrl.atualizar)           // Atualiza um candidato
    .delete('/', candidatoCtrl.excluir);         // Exclui um candidato

export default rotaCandidato;
