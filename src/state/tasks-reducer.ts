import {TasksStateType} from '../App';
import { AddTodolistActionType, RemoveTodolistActionType, SetTodosAC} from './todolists-reducer';
import { TaskStatuses, TaskType, todolistsAPI} from '../api/todolists-api'
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    todolistId: string
    taskId: string
}

export type AddTaskActionType = {
    type: 'ADD-TASK',
    task: TaskType
}

export type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS',
    todolistId: string
    taskId: string
    status: TaskStatuses
}

export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE',
    todolistId: string
    taskId: string
    title: string
}

export type SetTasksFromTodoType = ReturnType<typeof setTasksFromTodo>

type ActionsType = RemoveTaskActionType | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodosAC
    | SetTasksFromTodoType

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case "SET-TODOS": {
            const stateCopy = {...state}
            action.todos.forEach(td => {
                stateCopy[td.id] = []
            })
            return stateCopy
        }
        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todolistId];
            const newTasks = tasks.filter(t => t.id !== action.taskId);
            stateCopy[action.todolistId] = newTasks;
            return stateCopy;
        }
        case 'ADD-TASK': {
            const stateCopy = {...state}
            // const newTask: TaskType = {
            //     id: v1(),
            //     title: action.title,
            //     status: TaskStatuses.New,
            //     todoListId: action.todolistId, description: '',
            //     startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
            // }
            const tasks = stateCopy[action.task.todoListId];
            const newTasks = [action.task, ...tasks];
            stateCopy[action.task.todoListId] = newTasks;
            return stateCopy;
        }
        case 'CHANGE-TASK-STATUS': {
            let todolistTasks = state[action.todolistId];
            let newTasksArray = todolistTasks
                .map(t => t.id === action.taskId ? {...t, status: action.status} : t);

            state[action.todolistId] = newTasksArray;
            return ({...state});
        }
        case 'CHANGE-TASK-TITLE': {
            let todolistTasks = state[action.todolistId];
            // найдём нужную таску:
            let newTasksArray = todolistTasks
                .map(t => t.id === action.taskId ? {...t, title: action.title} : t);

            state[action.todolistId] = newTasksArray;
            return ({...state});
        }
        case 'ADD-TODOLIST': {
            debugger
            return {
                ...state,
                [action.todolist.id]: []
            }
        }
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        case "SET-TASKS": {
            const copyState = {...state}
            copyState[action.todolistID] = action.tasks
            return copyState
        }
        default:
            return state;
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId}
}
export const addTaskAC = (task: TaskType): AddTaskActionType => {
    return {type: 'ADD-TASK', task}
}
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string): ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS', status, todolistId, taskId}
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string): ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', title, todolistId, taskId}
}

export const setTasksFromTodo = (tasks: Array<TaskType>, todolistID: string) => {
    return {type: 'SET-TASKS', todolistID, tasks} as const
}

export const getTasksFromServer = (todolistId: string) => (dispatch: Dispatch) => {
    todolistsAPI.getTasks(todolistId).then((res) => {
        dispatch(setTasksFromTodo(res.data.items, todolistId))
    })
}

export const removeTaskFromServer = (id: string, todolistId: string) => (dispatch:Dispatch)=>{
    todolistsAPI.deleteTask(todolistId,id).then((res)=>{
        const action = removeTaskAC(id, todolistId);
        dispatch(action);
    })
}

export const addTaskToServer = (title:string,todolistId:string)=>(dispatch:Dispatch)=>{
    todolistsAPI.createTask(todolistId,title).then((res)=>{
        dispatch(addTaskAC(res.data.data.item))
    })
}

export const changeTaskStatusOnServer = (taskId:string,todolistId:string,status:TaskStatuses) => (dispatch:Dispatch,getState:()=>AppRootStateType)=>{
    const allTasksFromSTate = getState().tasks
    const taskFromCurrentTodo = allTasksFromSTate[todolistId]
    const task = taskFromCurrentTodo.find(t=> {
        return t.id === taskId
    })

    if(task){
        todolistsAPI.updateTask(todolistId,taskId,{
            title:task.title,
            description:task.description,
            priority:task.priority,
            startDate:task.startDate,
            deadline:task.deadline,
            status
        }).then((res)=>{
            dispatch(changeTaskStatusAC(res.data.data.item.id,res.data.data.item.status,res.data.data.item.todoListId))
        })
    }
}

export const changeTaskTitleOnServer = (todoID:string,taskID:string,title:string)=>(dispatch:Dispatch,getState:()=>AppRootStateType)=>{
    debugger
    const task = getState().tasks[todoID].find(t=> {
        debugger
        return t.id === taskID
    })
    if (task){
        debugger
        todolistsAPI.updateTask(todoID,taskID,{
            title,
            description:task.description,
            priority:task.priority,
            startDate:task.startDate,
            deadline:task.deadline,
            status:task.status
        }).then((res)=>{
            dispatch(changeTaskTitleAC(res.data.data.item.id,res.data.data.item.title,res.data.data.item.todoListId))
        })
    }
}