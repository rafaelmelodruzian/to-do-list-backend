export type UsarioTipo = {
    id: string,
    nome: string,
    email: string,
    senha: string
}

export type TarefaTipo = {
    id: string,
    titulo: string,
    descricao: string,
    criado_em: string,
    situacao: number
}

export type TarefaAtribuidaTipo = {
    usuario_id: string,
    tarefa_id: string
}

export type TarefaAtribuidaCompletaTipo = {
    id: string,
    titulo: string,
    descricao: string,
    criado_em: string,
    situacao: number,
    responsaveis: UsarioTipo[]
}