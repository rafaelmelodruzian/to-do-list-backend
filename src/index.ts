import express, {Request, Response} from 'express';                                                                     
import cors from 'cors';
import db from './database/knex';


const app = express();                                                                                                                  
app.use(express.json());
app.use(cors());

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
});


app.get("/eoeo", async (req: Request, res: Response) => {
    try {
        res.status(200).send("Tricolor, Tricolor")
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

app.get("/users", async (req: Request, res: Response) => {
    try {
      const result = await db("users")
      res.status(200).send(result)
    } catch (error: any) {
      console.error(error);
      res.status(500).send(error.message);
    }
  });