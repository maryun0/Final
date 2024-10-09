
CREATE TABLE IF NOT EXISTS vaga (
    vaga_codigo INT NOT NULL AUTO_INCREMENT,
    vaga_cargo VARCHAR(100) NOT NULL,
    vaga_salario DECIMAL(10, 2) NOT NULL,
    vaga_cidade VARCHAR(100) NOT NULL,
    CONSTRAINT pk_vaga PRIMARY KEY (vaga_codigo)
);


CREATE TABLE IF NOT EXISTS candidato (
    cand_codigo INT NOT NULL AUTO_INCREMENT,
    cand_nome VARCHAR(200) NOT NULL,
    cand_cpf VARCHAR(20) NOT NULL,
    cand_idade INT NOT NULL,
    cand_telefone VARCHAR(20) NOT NULL,
    vaga_codigo INT NOT NULL,
    cand_data_inscricao DATE NOT NULL,
    cand_horario_inscricao TIME NOT NULL,
    CONSTRAINT pk_candidato PRIMARY KEY (cand_codigo),
    CONSTRAINT fk_candidato_vaga FOREIGN KEY (vaga_codigo) REFERENCES vaga(vaga_codigo)
);
