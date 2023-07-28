-- Active: 1690320151409@@127.0.0.1@3306

-- Criar tabelas 
CREATE TABLE usuarios (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    nome TEXT NOT NULL,
		email TEXT UNIQUE NOT NULL,
		senha TEXT NOT NULL
);
CREATE TABLE tarefas  (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    titulo TEXT NOT NULL,
		descricao TEXT NOT NULL,
		criado_em TEXT DEFAULT (DATETIME()) NOT NULL,
		 situação INTEGER DEFAULT (0) NOT NULL
);
CREATE TABLE usuarios_tarefas (
		usuario_id TEXT NOT NULL,
		tarefa_id TEXT NOT NULL,
		FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
		FOREIGN KEY (tarefa_id) REFERENCES tarefas (id)
);

--popular tabelas para implementar os end-points
INSERT INTO usuarios (id, nome, email, senha)
VALUES
	('usu001', 'Fulano', 'fulano@email.com', 'fulano123'),
	('usu002', 'Beltrana', 'beltrana@email.com', 'beltrana00');

INSERT INTO tarefas (id, titulo, descricao)
VALUES
	('tar001', 'Implementar o header', 'Criar o componente Header do site'),
	('tar002', 'Implementar o footer', 'Criar o componente Footer do site'),
	('tar003', 'Testar site', 'Teste de usabilidade de todo o site'),
	('tar004', 'Deploy do site', 'Subir o site no surge');

INSERT INTO usuarios_tarefas (usuario_id, tarefa_id)
VALUES
	('usu001', 'tar001'),
	('usu002', 'tar002'),
	('usu001', 'tar003'),
	('usu002', 'tar003');


-- Vizualizar tabelas
SELECT * FROM usuarios;
SELECT * FROM tarefas;
SELECT * FROM usuarios_tarefas;
SELECT * FROM tarefas
LEFT JOIN usuarios_tarefas
ON usuarios_tarefas.tarefa_id = tarefa_id
LEFT JOIN usuarios
ON usuarios_tarefas.usuario_id = usuario_id;



