import Vaga from "../Modelo/vaga.js";
export default class VagaCtrl {

    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const { cargo, salario, cidade } = dados;
            if (cargo && salario && cidade) {
                const vaga = new Vaga(0, cargo, salario, cidade);
                // resolver a promise
                vaga.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": vaga.codigo,
                        "mensagem": "Vaga incluída com sucesso!"
                    });
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao registrar a vaga: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados da vaga (cargo, salário, cidade)!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método POST para cadastrar uma vaga!"
            });
        }
    }

    atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const { codigo, cargo, salario, cidade } = dados;
            if (codigo && cargo && salario && cidade) {
                const vaga = new Vaga(codigo, cargo, salario, cidade);
                // resolver a promise
                vaga.atualizar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Vaga atualizada com sucesso!"
                    });
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao atualizar a vaga: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código e todos os dados da vaga (cargo, salário, cidade)!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize os métodos PUT ou PATCH para atualizar uma vaga!"
            });
        }
    }

    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const { codigo } = dados;
            if (codigo) {
                const vaga = new Vaga(codigo);
                vaga.excluir().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Vaga excluída com sucesso!"
                    });
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao excluir a vaga: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código da vaga!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método DELETE para excluir uma vaga!"
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
            const vaga = new Vaga();
            vaga.consultar(termo).then((listaVagas) => {
                resposta.json({
                    status: true,
                    listaVagas
                });
            })
            .catch((erro) => {
                resposta.json({
                    status: false,
                    mensagem: "Não foi possível obter as vagas: " + erro.message
                });
            });
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método GET para consultar vagas!"
            });
        }
    }
}
