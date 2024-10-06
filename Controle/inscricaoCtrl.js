import Inscricao from "../Modelo/inscricao.js";

export default class InscricaoCtrl {

    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const candidatoId = dados.candidatoId;
            const vagaId = dados.vagaId;
            if (candidatoId && vagaId) {
                const inscricao = new Inscricao(0, candidatoId, vagaId);
                // resolver a promise
                inscricao.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": inscricao.codigo,
                        "mensagem": "Inscrição realizada com sucesso!"
                    });
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao registrar a inscrição: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o ID do candidato e o ID da vaga!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método POST para realizar uma inscrição!"
            });
        }
    }

    atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const candidatoId = dados.candidatoId;
            const vagaId = dados.vagaId;
            if (codigo && candidatoId && vagaId) {
                const inscricao = new Inscricao(codigo, candidatoId, vagaId);
                // resolver a promise
                inscricao.atualizar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Inscrição atualizada com sucesso!"
                    });
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao atualizar a inscrição: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código da inscrição, o ID do candidato e o ID da vaga!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize os métodos PUT ou PATCH para atualizar uma inscrição!"
            });
        }
    }

    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            if (codigo) {
                const inscricao = new Inscricao(codigo);
                inscricao.excluir().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Inscrição excluída com sucesso!"
                    });
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao excluir a inscrição: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código da inscrição!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método DELETE para excluir uma inscrição!"
            });
        }
    }

    consultar(requisicao, resposta) {
        resposta.type('application/json');
        let termo = requisicao.params.termo;
        if (!termo) {
            termo = "";
        }
        if (requisicao.method === "GET") {
            const inscricao = new Inscricao();
            inscricao.consultar(termo).then((listaInscricoes) => {
                resposta.json({
                    status: true,
                    listaInscricoes
                });
            })
            .catch((erro) => {
                resposta.json({
                    status: false,
                    mensagem: "Não foi possível obter as inscrições: " + erro.message
                });
            });
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método GET para consultar as inscrições!"
            });
        }
    }
}
