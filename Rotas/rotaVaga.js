import { Router } from "express";
import VagaCtrl from "../Controle/vagaCtrl.js";

const vagaCtrl = new VagaCtrl();
const rotaVaga = new Router();

rotaVaga
  .get('/', vagaCtrl.consultar)                
  .get('/:termo', vagaCtrl.consultar)          
  .post('/', vagaCtrl.gravar)                  
  .patch('/', vagaCtrl.atualizar)             
  .put('/', vagaCtrl.atualizar)                
  .delete('/', vagaCtrl.excluir);             
export default rotaVaga;
