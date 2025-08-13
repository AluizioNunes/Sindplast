CREATE TABLE IF NOT EXISTS "Sindplast"."Perfil" (
    "IdPerfil" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "Nome" VARCHAR(50) UNIQUE NOT NULL,
    "Descricao" VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS "Sindplast"."Permissoes" (
    "IdPermissao" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "Nome" VARCHAR(50) UNIQUE NOT NULL,
    "Descricao" VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS "Sindplast"."PerfilPermissao" (
    "IdPerfil" INTEGER REFERENCES "Sindplast"."Perfil"("IdPerfil") ON DELETE CASCADE,
    "IdPermissao" INTEGER REFERENCES "Sindplast"."Permissoes"("IdPermissao") ON DELETE CASCADE,
    PRIMARY KEY ("IdPerfil", "IdPermissao")
); 