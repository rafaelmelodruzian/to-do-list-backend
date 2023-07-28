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
