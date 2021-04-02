import { Response } from 'express';
import { db } from './config/config';

type TodoType = {
    title: string,
    body: string
}

type RequestType = {
    body: TodoType,
    params: { todoId: string }
}

const addTodo = async (req: RequestType, res: Response) => {
    const { title, body } = req.body;

    try {
        const todo = db.collection('todos').doc();

        const objectData = {
            id: todo.id,
            title,
            body
        }

        await todo.set(objectData);

        return res.status(200).json({
            status: 'Success',
            message: `Todo '${objectData.title}' added successfully!`,
            data: objectData
        });
    } catch(err) {
        return res.status(500).json(err.message);
    }
}

const getAllTodos = async (req: RequestType, res: Response) => {
    try {
        const todos: TodoType[] = [];
        const querySnapshot = db.collection('todos').get();

        (await querySnapshot).forEach((doc: any) => todos.push(doc.data()));
        return res.status(200).json(todos);
    } catch (err) {
        return res.status(500).json(err.message);
    }
}

const updateTodo = async (req: RequestType, res: Response) => {
    const { body: { title, body}, params: { todoId }} = req;

    try {
        const todo = db.collection('todos').doc(todoId);
        const curTodo = (await todo.get()).data() || {};

        const objectData = {
            id: todoId,
            title: title || curTodo.title,
            body: body || curTodo.body
        };

        todo.set(objectData);

        return res.status(200).json({
            status: 'Success',
            message: 'Todo updated Successfully',
            data: objectData
        });
    } catch (err) {
        return res.status(500).json(err.message);
    }
}

const deleteTodo = async (req: RequestType, res: Response) => {
    const { todoId } = req.params;

    try {
        const todo = db.collection('todos').doc(todoId);

        todo.delete();
        return res.status(200).json({
            status: 'Success',
            message: 'Todo deleted successfully'
        });
    } catch (err) {
        return res.status(500).json(err.message);
    }
}

export { addTodo, getAllTodos, updateTodo, deleteTodo };