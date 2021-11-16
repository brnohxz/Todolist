import {
    addTodolistAC,
    removeTodolistAC, setTodosAC,
} from './todolists-reducer';
import {TaskStatuses, TaskType, todolistsAPI} from '../api/todolists-api'
import {Dispatch} from "redux";
import {AppRootStateType} from "../app/store";
import {setError, setStatus} from "../app/app-reducer";

export const tasksReducer = (state: TasksStateType = {}, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case "SET-TODOS": {
            const stateCopy = {...state}
            action.todos.forEach(td => {
                stateCopy[td.id] = []
            })
            return stateCopy
        }
        case 'REMOVE-TASK': {
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        }
        case 'ADD-TASK': {
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        }
        case 'CHANGE-TASK-STATUS': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {
                    ...t,
                    status: action.status
                } : t)
            };

        }
        case 'CHANGE-TASK-TITLE': {
            let todolistTasks = state[action.todolistId];
            todolistTasks = todolistTasks.map(t => t.id === action.taskId ? {...t, title: action.title} : t);
            state[action.todolistId] = todolistTasks;
            return ({...state});
        }
        case 'ADD-TODOLIST': {
            return {...state, [action.todolist.id]: []}
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


//actions
export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {type: 'REMOVE-TASK', taskId, todolistId} as const
}
export const addTaskAC = (task: TaskType) => {
    return {type: 'ADD-TASK', task} as const
}
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string) => {
    return {type: 'CHANGE-TASK-STATUS', status, todolistId, taskId} as const
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => {
    return {type: 'CHANGE-TASK-TITLE', title, todolistId, taskId} as const
}
export const setTasksFromTodo = (tasks: Array<TaskType>, todolistID: string) => {
    return {type: 'SET-TASKS', todolistID, tasks} as const
}


//thunk
export const getTasksFromServer = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setStatus('loading'))
    todolistsAPI.getTasks(todolistId).then((res) => {
        dispatch(setTasksFromTodo(res.data.items, todolistId))
        dispatch(setStatus('succeeded'))
    })
}
export const removeTaskFromServer = (id: string, todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setStatus('loading'))
    todolistsAPI.deleteTask(todolistId, id).then(() => {
        dispatch(removeTaskAC(id, todolistId))
        dispatch(setStatus('succeeded'))
    })
}
export const addTaskToServer = (title: string, todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setStatus('loading'))
    todolistsAPI.createTask(todolistId, title).then((res) => {
        if (res.data.resultCode === 0) {
            dispatch(addTaskAC(res.data.data.item))
            dispatch(setStatus('succeeded'))
        } else {
            if (res.data.messages.length) {
                dispatch(setError(res.data.messages[0]))
            } else {
                dispatch(setError('Some error occurred. Message me to solve this problem'))
            }
        }
    })
}
export const changeTaskStatusOnServer = (taskId: string, todolistId: string, status: TaskStatuses) => (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
    const task = getState().tasks[todolistId].find(t => t.id === taskId)
    if (task) {
        dispatch(setStatus('loading'))
        todolistsAPI.updateTask(todolistId, taskId, {
            title: task.title,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            status
        }).then((res) => {
            dispatch(changeTaskStatusAC(res.data.data.item.id, res.data.data.item.status, res.data.data.item.todoListId))
            dispatch(setStatus('succeeded'))
        })
    }
}
export const changeTaskTitleOnServer = (todoID: string, taskID: string, title: string) => (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
    const task = getState().tasks[todoID].find(t => t.id === taskID)
    if (task) {
        dispatch(setStatus('loading'))
        todolistsAPI.updateTask(todoID, taskID, {
            title,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            status: task.status
        }).then((res) => {
            dispatch(changeTaskTitleAC(res.data.data.item.id, res.data.data.item.title, res.data.data.item.todoListId))
            dispatch(setStatus('succeeded'))
        })
    }
}

//types
type ActionsType = ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof setTodosAC>
    | ReturnType<typeof setTasksFromTodo>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeTaskStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | ReturnType<typeof setTasksFromTodo>
    | ReturnType<typeof setError>
    | ReturnType<typeof setStatus>

export type TasksStateType = {
    [key: string]: Array<TaskType>
}