import Vaga from "../Modelo/vaga.js";
import Candidato from "../Modelo/canditato.js";

export default class VagaCtrl {
    async gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const { titulo, descricao, localizacao, salario } = dados;
            if (titulo) {
                const vaga = new Vaga(0, titulo, descricao, localizacao, salario);
                try {
                    await vaga.gravar();
                    resposta.status(200).json({
                        status: true,
                        codigoGerado: vaga.codigo,
                        mensagem: "Vaga incluída com sucesso!"
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao registrar a vaga: " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Por favor, informe todos os dados da vaga conforme a documentação da API!"
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Por favor, utilize o método POST para cadastrar uma vaga!"
            });
        }
    }

    async atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const codigo = requisicao.params.codigo;
            const dados = requisicao.body;
            const { titulo, descricao, localizacao, salario } = dados;
            if (codigo && titulo) {
                const vaga = new Vaga(codigo, titulo, descricao, localizacao, salario);
                try {
                    await vaga.atualizar();
                    resposta.status(200).json({
                        status: true,
                        mensagem: "Vaga atualizada com sucesso!"
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao atualizar a vaga: " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Por favor, informe todos os dados da vaga conforme a documentação da API!"
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Por favor, utilize os métodos PUT ou PATCH para atualizar uma vaga!"
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE') {
            const codigo = requisicao.params.codigo;
            if (codigo) {
                const vaga = new Vaga(codigo);
                try {
                    await vaga.excluir();
                    resposta.status(200).json({
                        status: true,
                        mensagem: "Vaga excluída com sucesso!"
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao excluir a vaga: " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Por favor, informe o código da vaga!"
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Por favor, utilize o método DELETE para excluir uma vaga!"
            });
        }
    }

    async consultar(requisicao, resposta) {
        resposta.type('application/json');
        let parametro = requisicao.params.codigo || requisicao.params.termo || '';
        if (requisicao.method === "GET") {
            const vaga = new Vaga();
            try {
                const listaVagas = await vaga.consultar(parametro);
                resposta.json({
                    status: true,
                    listaVagas
                });
            } catch (erro) {
                resposta.status(500).json({
                    status: false,
                    mensagem: "Não foi possível obter as vagas: " + erro.message
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Por favor, utilize o método GET para consultar vagas!"
            });
        }
    }

    async obterCandidatos(requisicao, resposta) {
        resposta.type('application/json');
        const vagaCodigo = requisicao.params.codigo;
        if (requisicao.method === 'GET') {
            if (vagaCodigo) {
                const vaga = new Vaga(vagaCodigo);
                try {
                    const listaCandidatos = await vaga.obterCandidatos();
                    resposta.json({
                        status: true,
                        listaCandidatos
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Não foi possível obter os candidatos da vaga: " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Por favor, informe o código da vaga!"
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Por favor, utilize o método GET para obter os candidatos da vaga!"
            });
        }
    }
}
