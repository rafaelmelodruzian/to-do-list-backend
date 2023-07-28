# to-do-list-backendDocumentação do Backend para Lista de Tarefas
Visão Geral
Este é o backend de uma aplicação simples de Lista de Tarefas. O backend fornece um conjunto de endpoints para gerenciar usuários e suas tarefas. Utiliza o Express.js como servidor web, o Knex.js como query builder para o banco de dados e o SQLite como banco de dados.


# Tecnologias Utilizadas
TypeScript
Node.js
Express.js
Knex.js
SQLite


# Endpoints
# Usuários
1) GET /usuarios
Recupera uma lista de todos os usuários ou busca usuários pelo nome.

Parâmetros:
q (opcional): Termo de busca para filtrar usuários pelo nome.

Respostas:
200 OK: Retorna um array de objetos de usuário se a busca for bem-sucedida.
500 Internal Server Error: Retorna uma mensagem de erro se ocorrer um erro inesperado durante a busca.


2) POST /usuarios
Cria um novo usuário.

Corpo da Requisição:
id (string, obrigatório): ID do usuário (deve ser único e 4 caracteres).
nome (string, obrigatório): Nome do usuário (deve ter pelo menos 2 caracteres).
email (string, obrigatório): E-mail do usuário (deve ser único).
senha (string, obrigatório): Senha do usuário (deve ter de 8 a 12 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais).

Respostas:
201 Created: Retorna uma mensagem de sucesso e o novo objeto de usuário criado.
400 Bad Request: Retorna uma mensagem de erro se o corpo da requisição for inválido.
500 Internal Server Error: Retorna uma mensagem de erro se ocorrer um erro inesperado durante a criação do usuário.


3) DELETE /usuarios/:id
Deleta um usuário pelo ID.

Parâmetros:
id (string, obrigatório): ID do usuário a ser deletado (deve iniciar com a letra 'f').

Respostas:
200 OK: Retorna uma mensagem de sucesso se o usuário for deletado com sucesso.
400 Bad Request: Retorna uma mensagem de erro se o ID fornecido for inválido.
404 Not Found: Retorna uma mensagem de erro se o usuário com o ID fornecido não for encontrado.
500 Internal Server Error: Retorna uma mensagem de erro se ocorrer um erro inesperado durante a deleção do usuário.


# Tarefas
4) GET /tarefas
Recupera uma lista de todas as tarefas ou busca tarefas pelo título ou descrição.

Parâmetros:
q (opcional): Termo de busca para filtrar tarefas pelo título ou descrição.

Respostas:
200 OK: Retorna um array de objetos de tarefa se a busca for bem-sucedida.
500 Internal Server Error: Retorna uma mensagem de erro se ocorrer um erro inesperado durante a busca.


5) POST /tarefas
Cria uma nova tarefa.

Corpo da Requisição:
id (string, obrigatório): ID da tarefa (deve ser único e ter pelo menos 4 caracteres).
titulo (string, obrigatório): Título da tarefa (deve ter pelo menos 2 caracteres).
descricao (string, obrigatório): Descrição da tarefa.

Respostas:
201 Created: Retorna uma mensagem de sucesso e o novo objeto de tarefa criado.
400 Bad Request: Retorna uma mensagem de erro se o corpo da requisição for inválido.
500 Internal Server Error: Retorna uma mensagem de erro se ocorrer um erro inesperado durante a criação da tarefa.


6) PUT /tarefas/:id
Atualiza uma tarefa pelo ID.

Parâmetros:
id (string, obrigatório): ID da tarefa a ser atualizada.

Corpo da Requisição (pelo menos um, restante é opcional):
id (string): Novo ID da tarefa (deve ser único e ter pelo menos 4 caracteres).
titulo (string): Novo título da tarefa (deve ter pelo menos 2 caracteres).
descricao (string): Nova descrição da tarefa.
createdAt (string): Nova data de criação da tarefa (formato: AAAA-MM-DD HH:MM:SS).
status (number): Novo status da tarefa (0 para incompleta, 1 para completa).

Respostas:
200 OK: Retorna uma mensagem de sucesso e o objeto de tarefa atualizado.
400 Bad Request: Retorna uma mensagem de erro se o corpo da requisição ou o ID fornecido forem inválidos.
404 Not Found: Retorna uma mensagem de erro se a tarefa com o ID fornecido não for encontrada.
500 Internal Server Error: Retorna uma mensagem de erro se ocorrer um erro inesperado durante a atualização da tarefa.


7) DELETE /tarefas/:id
Deleta uma tarefa pelo ID.

Parâmetros:
id (string, obrigatório): ID da tarefa a ser deletada (deve iniciar com a letra 't').

Respostas:
200 OK: Retorna uma mensagem de sucesso se a tarefa for deletada com sucesso.
400 Bad Request: Retorna uma mensagem de erro se o ID fornecido for inválido.
404 Not Found: Retorna uma mensagem de erro se a tarefa com o ID fornecido não for encontrada.
500 Internal Server Error: Retorna uma mensagem de erro se ocorrer um erro inesperado durante a deleção da tarefa.


# Tarefas Atribuídas

8) POST /tarefas/:tarefaId/usuarios/:usuarioId
Este endpoint é responsável por atribuir um usuário a uma tarefa específica.

Parâmetros:
tarefaId (string, obrigatório): ID da tarefa à qual o usuário será atribuído (deve começar com a letra 't').
usuarioId (string, obrigatório): ID do usuário que será atribuído à tarefa (deve começar com a letra 'f').

Respostas:
201 Created: Retorna uma mensagem de sucesso indicando que o usuário foi atribuído à tarefa com sucesso.
400 Bad Request: Retorna uma mensagem de erro se os IDs fornecidos forem inválidos ou se a tarefa ou usuário não forem encontrados.
500 Internal Server Error: Retorna uma mensagem de erro se ocorrer um erro inesperado durante o processo de atribuição.


9) DELETE /tarefas/:tarefaId/usuarios/:usuarioId
Este endpoint permite remover a atribuição de um usuário de uma tarefa específica.

Parâmetros:
tarefaId (string, obrigatório): ID da tarefa da qual o usuário será removido (deve começar com a letra 't').
usuarioId (string, obrigatório): ID do usuário a ser removido da tarefa (deve começar com a letra 'f').

Respostas:
200 OK: Retorna uma mensagem de sucesso indicando que o usuário foi removido da tarefa com sucesso.
400 Bad Request: Retorna uma mensagem de erro se os IDs fornecidos forem inválidos ou se a tarefa ou usuário não forem encontrados.
500 Internal Server Error: Retorna uma mensagem de erro se ocorrer um erro inesperado durante o processo de remoção.


10) GET /tarefas/usuarios
Este endpoint recupera uma lista de todas as tarefas, juntamente com os usuários atribuídos a cada tarefa.

Respostas:
200 OK: Retorna um array de objetos de tarefa, onde cada objeto contém informações sobre a tarefa, bem como uma lista de usuários atribuídos a essa tarefa.
500 Internal Server Error: Retorna uma mensagem de erro se ocorrer um erro inesperado durante a busca das informações.
Esses endpoints permitem que os usuários atribuam e removam tarefas de seus respectivos usuários, além de recuperar informações sobre as tarefas e seus atributos associados. Eles são partes essenciais do projeto To-Do List, facilitando a gestão e organização das tarefas entre os usuários do sistema.

# Documentação e passo a passo
https://documenter.getpostman.com/view/27736274/2s9XxsVwdJ