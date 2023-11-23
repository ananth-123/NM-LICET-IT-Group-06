import { useState } from "react";
import * as React from "react";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { X, Calendar as CalendarIcon, Plus } from "lucide-react";
import { Checkbox } from "./components/Checkbox";
import { format } from "date-fns";
import { useEffect, useCallback } from "react";
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
} from "./components/Select";
import { cn } from "./lib/utils";
import { Calendar } from "./components/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./components/Popover";
import { Label } from "./components/Label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./components/Dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "./components/Table";
import { Separator } from "./components/Seperator";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState("");
  const [date, setDate] = React.useState();
  const [priority, setPriority] = useState("Normal");

  const addTodo = useCallback(() => {
    if (todoInput.trim() !== "") {
      setTodos((prev) => {
        const newTodo = {
          text: todoInput,
          done: false,
          deadline: date,
          priority,
        };
        const updatedTodos = [...prev, newTodo];

        // Sort todos based on done status first, then overdue, and finally priority
        updatedTodos.sort((a, b) => {
          if (
            a.done === b.done &&
            isOverdue(a.deadline) === isOverdue(b.deadline)
          ) {
            const priorityOrder = { Low: 2, Normal: 1, High: 0 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          }

          // Sort by overdue status first (overdue items come first)
          return isOverdue(a.deadline) ? -1 : 1;
        });

        return updatedTodos;
      });
      setTodoInput("");
      setDate("");
      setPriority(""); // Reset priority
    }
  }, [date, priority, todoInput]); // Add empty array as the second argument to useCallback

  const removeTodo = (index) => {
    setTodos((prev) => {
      prev.splice(index, 1);
      return [...prev];
    });
  };

  const toggleDone = useCallback((index) => {
    setTodos((prev) => {
      prev[index].done = !prev[index].done;

      return [...prev];
    });
  }, []);

  const isOverdue = (deadline) => {
    return deadline && new Date(deadline) < new Date();
  };

  const handleSubmit = () => {
    addTodo();
  };

  const handlePriorityChange = (selectedPriority) => {
    setPriority(selectedPriority);
  };

  useEffect(() => {
    setTodos((prev) => {
      // Sorting moved into the setTodos callback
      prev.sort((a, b) => {
        if (
          a.done === b.done &&
          isOverdue(a.deadline) === isOverdue(b.deadline)
        ) {
          const priorityOrder = { Low: 2, Normal: 1, High: 0 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }

        // Sort by overdue status first (overdue items come first)
        return isOverdue(a.deadline) ? -1 : 1;
      });

      return prev;
    });
  }, [addTodo, toggleDone]);

  const getTimeRemaining = (deadline) => {
    if (!deadline) return "";

    const now = new Date();
    const deadlineDate = new Date(deadline);
    const timeDifference = deadlineDate - now;
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    if (daysRemaining === 0) {
      return "Today";
    } else if (daysRemaining === 1) {
      return "Tomorrow";
    } else if (daysRemaining < 0) {
      return "Overdue";
    } else {
      return `${daysRemaining} days left`;
    }
  };

  return (
    <>
      <div className="z-10 min-h-screen bg-white">
        <nav className="z-20 p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">Todo List</h1>
          </div>
        </nav>
        <Separator className="" />
        <div className="container mx-auto p-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus size={"16"} className="mr-1" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>New Task</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 items-center">
                  <div className=" rounded-lg">
                    <div class="relative">
                      <Input
                        type="text"
                        id="taskName"
                        name="taskName"
                        className="peer bg-transparent h-10 w-full rounded-lg text-gray-800 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                        placeholder="Task Name"
                        value={todoInput}
                        onChange={(e) => setTodoInput(e.target.value)}
                      />
                      <label
                        for="taskName"
                        className="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-white mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
                      >
                        Task Name
                      </label>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 items-center">
                  <Select
                    value={priority}
                    onValueChange={(val) => handlePriorityChange(val)}
                  >
                    <SelectTrigger className="w-auto">
                      <SelectValue placeholder="Select a priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Priority</SelectLabel>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Normal">Normal</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 items-center mx-full gap-1">
                  <Label htmlFor="datepick" className="text-left">
                    Choose Deadline
                  </Label>
                  <Popover>
                    <PopoverTrigger className="w-full" asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
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
                  </Popover>
                </div>
              </div>
              <DialogFooter>
                <DialogClose>
                  <Button
                    type="submit"
                    className=""
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    Create Task
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {todos.length > 0 && (
            <div className="mb-6">
              <Table className="">
                <TableHeader>
                  <TableRow className="">
                    <TableHead className="w-[5%]">Done</TableHead>
                    <TableHead className="w-[5%]">S.No</TableHead>
                    <TableHead className="w-[35%]">Task</TableHead>
                    <TableHead className="w-[15%]">Priority</TableHead>
                    <TableHead className="">Deadline</TableHead>
                    <TableHead className="">Status</TableHead>
                    <TableHead className=""></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todos.map((todo, index) => (
                    <TableRow
                      key={index}
                      className={`${index % 2 === 0 ? "bg-gray-100" : ""} ${
                        isOverdue(todo.deadline) ? "text-red-500 font-bold" : ""
                      } `}
                    >
                      <TableCell className="mx-auto">
                        <Checkbox
                          id={`task-${index}`}
                          checked={todo.done}
                          onCheckedChange={() => {
                            toggleDone(index);
                          }}
                        />
                      </TableCell>
                      <TableCell className={`${todo.done && "line-through"}`}>
                        {index + 1}
                      </TableCell>
                      <TableCell className={`${todo.done && "line-through"}`}>
                        {todo.text}
                      </TableCell>
                      <TableCell className={`${todo.done && "line-through"}`}>
                        {todo.priority}
                      </TableCell>
                      <TableCell className={`${todo.done && "line-through"}`}>
                        {todo?.deadline
                          ? format(new Date(todo.deadline), "dd/MM/yyyy")
                          : ""}
                        <div className="text-sm text-gray-500">
                          {getTimeRemaining(todo.deadline)}
                        </div>
                      </TableCell>
                      <TableCell>{todo.done ? "Done" : "Pending"}</TableCell>
                      <TableCell className="float-right">
                        <Button
                          onClick={() => removeTodo(index)}
                          variant="ghost"
                          className="ml-2"
                        >
                          <X />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Todo;
