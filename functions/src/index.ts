import * as functions from "firebase-functions";
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { validate, ValidationError, Joi } from 'express-validation';
import { addTodo, deleteTodo, getAllTodos, updateTodo } from "./todoController";

const app = express();
app.use(bodyParser.json());

const addTodoValidation = {
    body: Joi.object({
        title: Joi.string().min(4).max(50).required(),
        body: Joi.string().required()
    })
}

app.get('/', (req, res) => res.send('Hey! There you are doing well!'));
app.get('/todos', getAllTodos);
app.post('/todos', validate(addTodoValidation, {keyByField: true}, {}), addTodo);
app.patch('/todos/:todoId', updateTodo);
app.delete('/todos/:todoId', deleteTodo);

app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json(err)
    }
  
    return res.status(500).json(err)
})

exports.app = functions.https.onRequest(app);
