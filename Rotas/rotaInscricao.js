import { Router } from "express";
import InscricaoCtrl from "../Controle/inscricaoCtrl.js";

const rotaInscricao = new Router();
const inscricaoCtrl = new InscricaoCtrl();

rotaInscricao
  .get('/:termo', inscricaoCtrl.consultar)    
  .post('/', inscricaoCtrl.gravar);           
// .patch('/', inscricaoCtrl.atualizar)
// .put('/', inscricaoCtrl.atualizar)
// .delete('/', inscricaoCtrl.excluir);

export default rotaInscricao;
