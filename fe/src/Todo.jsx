import { useState } from "react";
import * as React from "react";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import {
  X,
  Calendar as CalendarIcon,
  Plus,
  ArrowUpCircle,
  CheckCircle2,
  Circle,
  Clock9,
  AlertCircle,
  Check,
  Filter,
} from "lucide-react";
import { getAllTodos, addTodo, deleteTodo } from "./lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./components/Command";
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
import { Toaster, toast } from "sonner";
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
  TableCaption,
} from "./components/Table";
import { Separator } from "./components/Seperator";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState("");
  const [date, setDate] = React.useState();
  const [priority, setPriority] = useState("Normal");
  const remainingTasksCount = todos.filter((todo) => !todo.completed).length;
  const [open, setOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);

  const toggleDone = useCallback((id) => {
    setTodos((prev) => {
      const index = prev.findIndex((todo) => todo.id === id);
      const updatedTodos = [...prev];
      updatedTodos[index].completed = !updatedTodos[index].completed;
      return [...prev];
    });
  }, []);

  const isOverdue = (deadline) => {
    return deadline && new Date(deadline) < new Date();
  };

  const filteredTasks = selectedStatus
    ? todos.filter((todo) => {
        if (selectedStatus.value === "todo") {
          return true;
        } else if (selectedStatus.value === "in progress") {
          return !todo.completed && !isOverdue(todo.deadline);
        } else if (selectedStatus.value === "done") {
          return todo.completed;
        } else if (
          selectedStatus.value === "low priority" &&
          todo.priority === "Low"
        ) {
          return true;
        } else if (
          selectedStatus.value === "normal priority" &&
          todo.priority === "Normal"
        ) {
          return true;
        } else if (
          selectedStatus.value === "high priority" &&
          todo.priority === "High"
        ) {
          return true;
        }
        return false;
      })
    : todos;

  const handlePriorityChange = (selectedPriority) => {
    setSelectedPriority(selectedPriority);
  };

  const handleFetchTodos = async () => {
    const fetchedTodos = await getAllTodos();
    setTodos(() => {
      fetchedTodos.sort((a, b) => {
        if (
          a.completed === b.completed &&
          isOverdue(a.deadline) === isOverdue(b.deadline)
        ) {
          const priorityOrder = { Low: 2, Normal: 1, High: 0 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }

        return isOverdue(a.deadline) ? -1 : 1;
      });

      return fetchedTodos;
    });
  };

  useEffect(() => {
    handleFetchTodos();
  }, []);

  const statuses = [
    {
      value: "todo",
      label: "Todo",
      icon: Circle,
    },
    {
      value: "in progress",
      label: "In Progress",
      icon: ArrowUpCircle,
    },
    {
      value: "done",
      label: "Done",
      icon: CheckCircle2,
    },
    {
      value: "low priority",
      label: "Low Priority",
      icon: Check,
    },
    {
      value: "normal priority",
      label: "Normal Priority",
      icon: Clock9,
    },
    {
      value: "high priority",
      label: "High Priority",
      icon: AlertCircle,
    },
  ];

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
      <div className=" min-h-screen bg-white">
        <nav className=" p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">Todo List</h1>
          </div>
        </nav>
        <Separator className="" />
        <div className="container mx-auto p-6">
          <Toaster />
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
                      toast.promise(
                        addTodo({
                          title: todoInput,
                          completed: false,
                          deadline: date,
                          priority,
                        }),
                        "Task successfully created!"
                      );
                      setTodoInput("");
                      setDate(null);
                      setPriority("Normal");
                      setOpen(false);
                      handleFetchTodos();
                    }}
                  >
                    Create Task
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="ml-2 justify-start">
                {selectedStatus ? (
                  <>
                    <selectedStatus.icon className="mr-2 h-4 w-4 shrink-0" />
                    {selectedStatus.label}
                  </>
                ) : (
                  <>
                    <Filter size={"16"} className="mr-1" />
                    Filter
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" side="right" align="start">
              <Command>
                <CommandInput placeholder="Select Filter" />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {statuses.map((status) => (
                      <CommandItem
                        key={status.value}
                        value={status.value}
                        onSelect={() => {
                          setSelectedStatus(status);
                          setOpen(false);
                        }}
                      >
                        <status.icon
                          className={cn(
                            "mr-2 h-4 w-4",
                            status.value === selectedStatus?.value
                              ? "opacity-100"
                              : "opacity-40"
                          )}
                        />
                        <span>{status.label}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {filteredTasks.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <p className="text-xl text-gray-500">No tasks</p>
            </div>
          )}
          {filteredTasks.length > 0 && (
            <div className="mb-6">
              <Table className="">
                <TableCaption>{`${remainingTasksCount} ${
                  remainingTasksCount === 1 ? "task" : "tasks"
                } remaining.`}</TableCaption>
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
                  {filteredTasks
                    .filter((todo) => {
                      if (selectedStatus && selectedStatus.value === "todo") {
                        // Filter based on priority for Todo status
                        if (
                          selectedPriority &&
                          todo.priority !== selectedPriority
                        ) {
                          return false;
                        }
                      }
                      return true;
                    })
                    .map((todo, index) => (
                      <TableRow
                        key={todo.id}
                        className={`${todo.id % 2 === 0 ? "bg-gray-100" : ""} ${
                          isOverdue(todo.deadline)
                            ? "text-red-500 font-bold"
                            : ""
                        } `}
                      >
                        <TableCell className="mx-auto">
                          <Checkbox
                            id={`task-${todo.id}`}
                            checked={todo.completed}
                            onCheckedChange={() => {
                              toggleDone(todo.id);
                            }}
                          />
                        </TableCell>
                        <TableCell
                          className={`${todo.completed && "line-through"}`}
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell
                          className={`${todo.completed && "line-through"}`}
                        >
                          {todo.title}
                        </TableCell>
                        <TableCell
                          className={`${todo.completed && "line-through"}`}
                        >
                          {todo.priority}
                        </TableCell>
                        <TableCell
                          className={`${todo.completed && "line-through"}`}
                        >
                          {todo?.deadline
                            ? format(new Date(todo.deadline), "dd/MM/yyyy")
                            : ""}
                          <div className="text-sm text-gray-500">
                            {getTimeRemaining(todo.deadline)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {todo.completed ? "Done" : "Pending"}
                        </TableCell>
                        <TableCell className="float-right">
                          <Button
                            onClick={() => {
                              toast.promise(
                                deleteTodo(todo.id),
                                handleFetchTodos(),
                                "Task removed successfully!"
                              );
                            }}
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
