import express from 'express';
import cors from 'cors';

import dotenv from 'dotenv';

import rotaCandidato from './Rotas/rotaCandidato.js';
import rotaVaga from './Rotas/rotaVaga.js';

import { verificarAutenticacao } from './Seguranca/autenticar.js';

dotenv.config();

const host = process.env.HOST || '0.0.0.0';
const porta = process.env.PORT || 4000;

const app = express();



app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://192.168.10.152:3000"],
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use('/candidato', verificarAutenticacao, rotaCandidato);
app.use('/vaga', verificarAutenticacao, rotaVaga);


app.listen(porta, host, () => {
    console.log(`Servidor escutando em http://${host}:${porta}.`);
});
