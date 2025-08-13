CREATE TABLE "Sindplast".usuarios (
    "IdUsuarios" SERIAL PRIMARY KEY,
    "Nome" VARCHAR(300) NOT NULL,
    "CPF" VARCHAR(14) UNIQUE,
    "Email" VARCHAR(400) UNIQUE,
    "Usuario" VARCHAR(400) UNIQUE,
    "Senha" VARCHAR(400) NOT NULL,
    "Cadastrante" VARCHAR(400),
    "DataCadastro" TIMESTAMP
); 