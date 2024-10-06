// Controle/candidatoCtrl.js
import Candidato from "../Modelo/canditato.js";
import Vaga from "../Modelo/vaga.js";

export default class CandidatoCtrl {
    async gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const { nome, email, telefone, vagaCodigo } = dados;
            if (nome && email) {
                let vagas = [];
                if (vagaCodigo) {
                    if (Array.isArray(vagaCodigo)) {
                       
                        vagas = vagaCodigo.map(codigo => new Vaga(codigo));
                    } else {
                       
                        vagas = [new Vaga(vagaCodigo)];
                    }
                }
                const candidato = new Candidato(0, nome, email, telefone, vagas);
                try {
                    await candidato.gravar();
                    resposta.status(200).json({
                        status: true,
                        codigoGerado: candidato.codigo,
                        mensagem: "Candidato incluído com sucesso!"
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao registrar o candidato: " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Por favor, informe o nome e o email do candidato!"
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Por favor, utilize o método POST com 'Content-Type: application/json' para cadastrar um candidato!"
            });
        }
    }

    async atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const { codigo, nome, email, telefone, vagaCodigo } = dados;
            if (codigo && nome && email) {
                let vagas = [];
                if (vagaCodigo) {
                    if (Array.isArray(vagaCodigo)) {
                        vagas = vagaCodigo.map(cod => new Vaga(cod));
                    } else {
                        vagas = [new Vaga(vagaCodigo)];
                    }
                }
                const candidato = new Candidato(codigo, nome, email, telefone, vagas);
                try {
                    await candidato.atualizar();
                    resposta.status(200).json({
                        status: true,
                        mensagem: "Candidato atualizado com sucesso!"
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao atualizar o candidato: " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Por favor, informe o código, nome e email do candidato!"
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Por favor, utilize os métodos PUT ou PATCH com 'Content-Type: application/json' para atualizar um candidato!"
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const { codigo } = dados;
            if (codigo) {
                const candidato = new Candidato(codigo);
                try {
                    await candidato.excluir();
                    resposta.status(200).json({
                        status: true,
                        mensagem: "Candidato excluído com sucesso!"
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao excluir o candidato: " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Por favor, informe o código do candidato!"
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Por favor, utilize o método DELETE com 'Content-Type: application/json' para excluir um candidato!"
            });
        }
    }

    async consultar(requisicao, resposta) {
        resposta.type('application/json');
        let parametro = requisicao.params.termo || '';
        if (requisicao.method === "GET") {
            const candidato = new Candidato();
            try {
                const listaCandidatos = await candidato.consultar(parametro);
                resposta.json({
                    status: true,
                    listaCandidatos: listaCandidatos.map(c => c.toJSON())
                });
            } catch (erro) {
                resposta.status(500).json({
                    status: false,
                    mensagem: "Não foi possível obter os candidatos: " + erro.message
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Por favor, utilize o método GET para consultar candidatos!"
            });
        }
    }
}
