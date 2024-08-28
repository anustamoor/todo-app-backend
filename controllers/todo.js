import { ObjectId } from "mongodb";
import { getTodosCollection } from "../db.js";

export const getAllTodos = async (req, res) => {
  const todosCollection = getTodosCollection();
  try {
    const todos = await todosCollection.find().toArray();
    const todosWithId = todos.map((todo) => ({
      id: todo._id.toString(), // Convert ObjectId to string
      ...todo,
    }));
    todosWithId.forEach((todo) => delete todo._id); // Remove _id from each todo
    res.send(todosWithId);
  } catch (err) {
    res.status(500).send({ message: "Error fetching todos" });
  }
};

export const createTodo = async (req, res) => {
  const todosCollection = getTodosCollection();

  try {
    const todo = req.body;
    if (todo.completed === undefined) {
      todo.completed = false; 
    }

    const result = await todosCollection.insertOne(todo);
    const newTodo = await todosCollection.findOne({ _id: result.insertedId });
    
    const todoWithId = {
      id: newTodo._id.toString(),
      ...newTodo,
    };
    delete todoWithId._id; // Remove _id from the todo
    
    // Send the success response
    res.status(201).send({ message: "Todo created successfully", todo: todoWithId });
  } catch (err) {
    // Send the error response
    res.status(500).send({ message: "Error creating todo" });
  }
};


export const getTodoById = async (req, res) => {
  const todosCollection = getTodosCollection();
  try {
    const id = req.params.id;
    const todo = await todosCollection.findOne({ _id: new ObjectId(id) });
    if (!todo) {
      res.status(404).send({ message: "Todo not found" });
    } else {
      const todoWithId = {
        id: todo._id.toString(), // Convert ObjectId to string
        ...todo,
      };
      delete todoWithId._id; // Remove _id from the todo
      res.send(todoWithId);
    }
  } catch (err) {
    res.status(500).send({ message: "Error fetching todo" });
  }
};

export const updateTodo = async (req, res) => {
  const todosCollection = getTodosCollection();
  try {
    const id = req.params.id;
    const updatedTodo = req.body;
    const result = await todosCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedTodo }
    );
    if (result.matchedCount === 0) {
      res.status(404).send({ message: "Todo not found" });
      return;
    }
    const updatedTodoData = await todosCollection.findOne({
      _id: new ObjectId(id),
    });
    const todoWithId = {
      id: updatedTodoData._id.toString(), // Convert ObjectId to string
      ...updatedTodoData,
    };
    delete todoWithId._id; // Remove _id from the todo
    res.send({ message: "Todo updated successfully", todo: todoWithId });
  } catch (err) {
    res.status(500).send({ message: "Error updating todo" });
  }
};

export const completeTodo = async (req, res) => {
  const todosCollection = getTodosCollection();
  try {
    const id = req.params.id;
    const { completed } = req.body;
    const result = await todosCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { completed: completed } }
    );
    if (result.matchedCount === 0) {
      res.status(404).send({ message: "Todo not found" });
      return;
    }
    const updatedTodoData = await todosCollection.findOne({
      _id: new ObjectId(id),
    });
    const todoWithId = {
      id: updatedTodoData._id.toString(), // Convert ObjectId to string
      ...updatedTodoData,
    };
    delete todoWithId._id; // Remove _id from the todo
    res.send({ message: "Todo updated successfully", todo: todoWithId });
  } catch (err) {
    res.status(500).send({ message: "Error updating todo" });
  }
};

export const deleteTodo = async (req, res) => {
  const todosCollection = getTodosCollection();
  try {
    const id = req.params.id;
    const result = await todosCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      res.status(404).send({ message: "Todo not found" });
      return;
    }
    res.send({ message: "Todo deleted successfully", id });
  } catch (err) {
    res.status(500).send({ message: "Error deleting todo" });
  }
};
