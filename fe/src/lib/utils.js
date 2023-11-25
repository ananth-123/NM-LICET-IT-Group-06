import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import ky from "ky";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const getAllTodos = async () => {
  const response = await ky
    .get(`${process.env.REACT_APP_DATABASE_URL}/todos`)
    .json();
  return response;
};

const addTodo = async (todo) => {
  const response = await ky
    .post(`${process.env.REACT_APP_DATABASE_URL}/todos`, { json: todo })
    .json();
  return response;
};

const deleteTodo = async (id) => {
  const response = await ky.delete(
    `${process.env.REACT_APP_DATABASE_URL}/todos/${id}`
  );
  return response;
};

export { getAllTodos, addTodo, deleteTodo };
