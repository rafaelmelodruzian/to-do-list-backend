import express, { Request, Response } from 'express'
import cors from 'cors'
import  db from './database/knex'
import { TarefaTipo, TarefaAtribuidaCompletaTipo, UsarioTipo, TarefaAtribuidaTipo } from './types'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

//Bloco usuarios
app.get("/usuarios", async (req: Request, res: Response) => {
    try {
        const searchTerm = req.query.q as string | undefined

        if (searchTerm === undefined) {
            const result = await db("usuarios")
            res.status(200).send(result)
        } else {
            const result = await db("usuarios").where("nome", "LIKE", `%${searchTerm}%`)
            res.status(200).send(result)
        }
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})
app.post("/usuarios", async (req: Request, res: Response) => {
    try {
        const { id, nome, email, senha } = req.body

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        if (id.length < 4) {
            res.status(400)
            throw new Error("'id' deve possuir pelo menos 4 caracteres")
        }

        if (typeof nome !== "string") {
            res.status(400)
            throw new Error("'nome' deve ser string")
        }

        if (nome.length < 2) {
            res.status(400)
            throw new Error("'nome' deve possuir pelo menos 2 caracteres")
        }

        if (typeof email !== "string") {
            res.status(400)
            throw new Error("'email' deve ser string")
        }

        if (!senha.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g)) {
			throw new Error("'senha' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
		}

        const [ usuarioIdAlreadyExists ]:UsarioTipo [] | undefined[] = await db("usuarios").where({ id })

        if (usuarioIdAlreadyExists) {
            res.status(400)
            throw new Error("'id' já existe")
        }

        const [ usuarioEmailAlreadyExists ]: UsarioTipo[] | undefined[] = await db("usuarios").where({ email })

        if (usuarioEmailAlreadyExists) {
            res.status(400)
            throw new Error("'email' já existe")
        }

        const newusuario: UsarioTipo = {
            id,
            nome,
            email,
            senha
        }

        await db("usuarios").insert(newusuario)

        res.status(201).send({
            message: "usuario criado com sucesso",
            usuario: newusuario
        })

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})
app.delete("/usuarios/:id", async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id

        if (idToDelete[0] !== "f") {
            res.status(400)
            throw new Error("'id' deve iniciar com a letra 'f'")
        }

        const [ usuarioIdAlreadyExists ]: UsarioTipo[] | undefined[] = await db("usuarios").where({ id: idToDelete })

        if (!usuarioIdAlreadyExists) {
            res.status(404)
            throw new Error("'id' não encontrado")
        }

        await db("usuarios_tarefas").del().where({ usuario_id: idToDelete })
        await db("usuarios").del().where({ id: idToDelete })

        res.status(200).send({ message: "usuario deletado com sucesso" })

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


//Bloco tarefas
app.get("/tarefas", async (req: Request, res: Response) => {
    try {
        const searchTerm = req.query.q as string | undefined

        if (searchTerm === undefined) {
            const result = await db("tarefas")
            res.status(200).send(result)
        } else {
            const result = await db("tarefas")
                .where("titulo", "LIKE", `%${searchTerm}%`)
                .orWhere("descricao", "LIKE", `%${searchTerm}%`)

            res.status(200).send(result)
        }
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})
app.post("/tarefas", async (req: Request, res: Response) => {
    try {
        const { id, titulo, descricao } = req.body

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        if (id.length < 4) {
            res.status(400)
            throw new Error("'id' deve possuir pelo menos 4 caracteres")
        }

        if (typeof titulo !== "string") {
            res.status(400)
            throw new Error("'titulo' deve ser string")
        }

        if (titulo.length < 2) {
            res.status(400)
            throw new Error("'titulo' deve possuir pelo menos 2 caracteres")
        }

        if (typeof descricao !== "string") {
            res.status(400)
            throw new Error("'descricao' deve ser string")
        }

        const [ tarefaIdAlreadyExists ]: TarefaTipo[] | undefined[] = await db("tarefas").where({ id })

        if (tarefaIdAlreadyExists) {
            res.status(400)
            throw new Error("'id' já existe")
        }

        const newtarefa = {
            id,
            titulo,
            descricao
        }

        await db("tarefas").insert(newtarefa)

        const [ insertedtarefa ]: TarefaTipo[] = await db("tarefas").where({ id })

        res.status(201).send({
            message: "tarefa criada com sucesso",
            tarefa: insertedtarefa
        })

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})
app.put("/tarefas/:id", async (req: Request, res: Response) => {
    try {
        const idToEdit = req.params.id

        const newId = req.body.id
        const newtitulo = req.body.titulo
        const newdescricao = req.body.descricao
        const newCreatedAt = req.body.createdAt
        const newStatus = req.body.status

        if (newId !== undefined) {
            if (typeof newId !== "string") {
                res.status(400)
                throw new Error("'id' deve ser string")
            }
    
            if (newId.length < 4) {
                res.status(400)
                throw new Error("'id' deve possuir pelo menos 4 caracteres")
            }
        }

        if (newtitulo !== undefined) {
            if (typeof newtitulo !== "string") {
                res.status(400)
                throw new Error("'titulo' deve ser string")
            }
    
            if (newtitulo.length < 2) {
                res.status(400)
                throw new Error("'titulo' deve possuir pelo menos 2 caracteres")
            }
        }

        if (newdescricao !== undefined) {
            if (typeof newdescricao !== "string") {
                res.status(400)
                throw new Error("'descricao' deve ser string")
            }
        }

        if (newCreatedAt !== undefined) {
            if (typeof newCreatedAt !== "string") {
                res.status(400)
                throw new Error("'createdAt' deve ser string")
            }
        }

        if (newStatus !== undefined) {
            if (typeof newStatus !== "number") {
                res.status(400)
                throw new Error("'status' deve ser number (0 para incompleta ou 1 para completa)")
            }
        }

        const [ tarefa ]: TarefaTipo[] | undefined[] = await db("tarefas").where({ id: idToEdit })

        if (!tarefa) {
            res.status(404)
            throw new Error("'id' não encontrada")
        }

        const newtarefa: TarefaTipo = {
            id: newId || tarefa.id,
            titulo: newtitulo || tarefa.titulo,
            descricao: newdescricao || tarefa.descricao,
            criado_em: newCreatedAt || tarefa.criado_em,
            situacao: isNaN(newStatus) ? tarefa.situacao : newStatus
        }

        await db("tarefas").update(newtarefa).where({ id: idToEdit })

        res.status(200).send({
            message: "tarefa editada com sucesso",
            tarefa: newtarefa
        })

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})
app.delete("/tarefas/:id", async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id

        if (idToDelete[0] !== "t") {
            res.status(400)
            throw new Error("'id' deve iniciar com a letra 't'")
        }

        const [ tarefaIdToDelete ]: TarefaTipo[] | undefined[] = await db("tarefas").where({ id: idToDelete })

        if (!tarefaIdToDelete) {
            res.status(404)
            throw new Error("'id' não encontrado")
        }

        await db("usuarios_tarefas").del().where({ tarefa_id: idToDelete })
        await db("tarefas").del().where({ id: idToDelete })

        res.status(200).send({ message: "tarefa deletada com sucesso" })

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

