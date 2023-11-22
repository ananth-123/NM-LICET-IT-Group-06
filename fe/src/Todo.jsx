import { useState } from "react";
import * as React from "react";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { X } from "lucide-react";
import { Checkbox } from "./components/Checkbox";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "./lib/utils";
import { Calendar } from "./components/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./components/Popover";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState("");
  const [deadline, setDeadline] = useState("");

  const addTodo = () => {
    if (todoInput.trim() !== "") {
      setTodos([...todos, { text: todoInput, done: false, deadline }]);
      setTodoInput("");
      setDeadline("");
    }
  };

  const removeTodo = (index) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  const toggleDone = (index) => {
    const newTodos = [...todos];
    newTodos[index].done = !newTodos[index].done;
    setTodos(newTodos);
  };

  const isOverdue = (deadline) => {
    return deadline && new Date(deadline) < new Date();
  };

  // const [date, setDate] = React.useState<Date>();

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-ab w-[50%]">
        <h1 className="text-2xl font-bold mb-4">Todo List</h1>

        <form onSubmit={handleSubmit}>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="Add a new todo"
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
            />
            {/* <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover> */}
          </div>
          <ul>
            {todos.map((todo, index) => (
              <li
                key={index}
                className={`flex justify-between items-center border-b py-2 ${
                  todo.done && "line-through"
                } ${isOverdue(todo.deadline) ? "text-red-500" : ""}`}
              >
                <span>
                  <Checkbox
                    id="terms"
                    checked={todo.done}
                    onChange={() => toggleDone(index)}
                  />

                  <span className="ml-2 text-md font-medium leading-none">
                    {todo.text}
                  </span>
                  {todo.deadline && (
                    <span className="ml-2">
                      Deadline: {new Date(todo.deadline).toLocaleDateString()}
                    </span>
                  )}
                </span>
                <Button onClick={() => removeTodo(index)} variant="ghost">
                  <X className="p-1" />
                </Button>
              </li>
            ))}
          </ul>

          <Button type="submit" className="mt-4">
            Add Todo
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Todo;
