CREATE TABLE IF NOT EXISTS vaga (
    vag_codigo INT NOT NULL AUTO_INCREMENT,
    vag_titulo VARCHAR(200) NOT NULL,
    vag_descricao TEXT,
    vag_localizacao VARCHAR(100),
    vag_salario DECIMAL(10,2),
    CONSTRAINT pk_vaga PRIMARY KEY (vag_codigo)
);



CREATE TABLE IF NOT EXISTS candidato (
    can_codigo INT NOT NULL AUTO_INCREMENT,
    can_nome VARCHAR(100) NOT NULL,
    can_email VARCHAR(100) NOT NULL,
    can_telefone VARCHAR(20),
    CONSTRAINT pk_candidato PRIMARY KEY (can_codigo)
);


CREATE TABLE IF NOT EXISTS candidato_vaga (
    can_codigo INT NOT NULL,
    vag_codigo INT NOT NULL,
    CONSTRAINT pk_candidato_vaga PRIMARY KEY (can_codigo, vag_codigo),
    CONSTRAINT fk_candidato_vaga_candidato FOREIGN KEY (can_codigo) REFERENCES candidato (can_codigo) ON DELETE CASCADE,
    CONSTRAINT fk_candidato_vaga_vaga FOREIGN KEY (vag_codigo) REFERENCES vaga (vag_codigo) ON DELETE CASCADE
);
