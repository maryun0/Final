import Candidato from "../Modelo/canditato.js";
import Vaga from "../Modelo/vaga.js";

export default class CandidatoCtrl {

    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const nome = dados.nome;
            const cpf = dados.cpf;
            const idade = dados.idade;
            const telefone = dados.telefone;
            const vagaCodigo = dados.vaga.codigo;

            if (nome && cpf && idade && telefone && vagaCodigo > 0) {
                const vaga = new Vaga(vagaCodigo);
                const candidato = new Candidato(0, nome, cpf, idade, telefone, vaga);
                candidato.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": candidato.codigo,
                        "mensagem": "Candidato incluído com sucesso!"
                    });
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao registrar o candidato: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados do candidato conforme a documentação da API!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método POST para cadastrar um candidato!"
            });
        }
    }

    atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const nome = dados.nome;
            const cpf = dados.cpf;
            const idade = dados.idade;
            const telefone = dados.telefone;
            const vagaCodigo = dados.vaga.codigo;

            if (codigo && nome && cpf && idade && telefone && vagaCodigo > 0) {
                const vaga = new Vaga(vagaCodigo);
                const candidato = new Candidato(codigo, nome, cpf, idade, telefone, vaga);
                candidato.alterar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Candidato atualizado com sucesso!"
                    });
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao atualizar o candidato: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados do candidato conforme a documentação da API!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize os métodos PUT ou PATCH para atualizar um candidato!"
            });
        }
    }

    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            if (codigo) {
                const candidato = new Candidato(codigo);
                candidato.excluir().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Candidato excluído com sucesso!"
                    });
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao excluir o candidato: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código do candidato!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método DELETE para excluir um candidato!"
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
            const candidato = new Candidato();
            candidato.consultar(termo).then((listaCandidatos) => {
                resposta.json({
                    status: true,
                    listaCandidatos
                });
            })
            .catch((erro) => {
                resposta.json({
                    status: false,
                    mensagem: "Não foi possível obter os candidatos: " + erro.message
                });
            });
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método GET para consultar candidatos!"
            });
        }
    }
}
