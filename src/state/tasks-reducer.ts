import {
    addTodolistAC,
    removeTodolistAC, setTodosAC,
} from './todolists-reducer';
import {TaskStatuses, TaskType, todolistsAPI} from '../api/todolists-api'
import {Dispatch} from "redux";
import {AppRootStateType, store} from "../app/store";
import {setAppError, setAppStatus} from "../app/app-reducer";
import {serverErrorHandling, serverErrorNetworkHandling} from "../utils/errorHelper";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


const slice = createSlice({
    name:'task',
    initialState: {} as TasksStateType,
    reducers:{
        removeTaskAC(state,action:PayloadAction<{taskId: string, todolistId: string}>){
            state[action.payload.todolistId] = state[action.payload.todolistId].filter(t => t.id !== action.payload.taskId)
        },
        addTaskAC(state,action:PayloadAction<{task: TaskType}>){
            state[action.payload.task.todoListId] = [action.payload.task,...state[action.payload.task.todoListId]]
        },
        changeTaskStatusAC(state,action:PayloadAction<{taskId: string, status: TaskStatuses, todolistId: string}>){
            state[action.payload.todolistId].map(task=>task.id === action.payload.taskId ? {
                ...task,
                status: action.payload.status
            } : task)
        },
        changeTaskTitleAC(state,action:PayloadAction<{taskId: string, title: string, todolistId: string}>){
            state[action.payload.todolistId].map(t => t.id === action.payload.taskId ? {...t, title: action.payload.title} : t)
        },
        setTasksFromTodo(state,action:PayloadAction<{tasks: Array<TaskType>, todolistID: string}>){
            state[action.payload.todolistID] = action.payload.tasks
        },
    }
})
export const tasksReducer = slice.reducer
export const {removeTaskAC,addTaskAC,changeTaskStatusAC,changeTaskTitleAC,setTasksFromTodo} = slice.actions

// export const tasksReducer = (state: TasksStateType = {}, action: ActionsType): TasksStateType => {
//     switch (action.type) {
//         case "SET-TODOS": {
//             const stateCopy = {...state}
//             action.todos.forEach(td => {
//                 stateCopy[td.id] = []
//             })
//             return stateCopy
//         }
//         case 'REMOVE-TASK': {
//             return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
//         }
//         case 'ADD-TASK': {
//             return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
//         }
//         case 'CHANGE-TASK-STATUS': {
//             return {
//                 ...state,
//                 [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {
//                     ...t,
//                     status: action.status
//                 } : t)
//             };
//
//         }
//         case 'CHANGE-TASK-TITLE': {
//             let todolistTasks = state[action.todolistId];
//             todolistTasks = todolistTasks.map(t => t.id === action.taskId ? {...t, title: action.title} : t);
//             state[action.todolistId] = todolistTasks;
//             return ({...state});
//         }
//         case 'ADD-TODOLIST': {
//             return {...state, [action.todolist.id]: []}
//         }
//         case 'REMOVE-TODOLIST': {
//             const copyState = {...state};
//             delete copyState[action.id];
//             return copyState;
//         }
//         case "SET-TASKS": {
//             const copyState = {...state}
//             copyState[action.todolistID] = action.tasks
//             return copyState
//         }
//         default:
//             return state;
//     }
// }


//actions



//thunk
export const getTasksFromServer = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatus({status:'loading'}))
    todolistsAPI.getTasks(todolistId).then((res) => {
        dispatch(setTasksFromTodo({tasks:res.data.items, todolistID:todolistId}))
        dispatch(setAppStatus({status:'succeeded'}))
    }).catch((error) => {
        serverErrorNetworkHandling(error, dispatch)
    })
}
export const removeTaskFromServer = (id: string, todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatus({status:'loading'}))
    todolistsAPI.deleteTask(todolistId, id).then((res) => {
        if (res.data.resultCode === 0) {
            dispatch(removeTaskAC({taskId:id, todolistId:todolistId}))
            dispatch(setAppStatus({status:'succeeded'}))
        } else {
            serverErrorHandling(res.data, dispatch)
        }
    }).catch((error) => {
        serverErrorNetworkHandling(error, dispatch)
    })
}
export const addTaskToServer = (title: string, todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatus({status:'loading'}))
    todolistsAPI.createTask(todolistId, title).then((res) => {
        if (res.data.resultCode === 0) {
            dispatch(addTaskAC({task:res.data.data.item}))
            dispatch(setAppStatus({status:'succeeded'}))
        } else {
            serverErrorHandling(res.data, dispatch)
        }
    }).catch((error) => {
        serverErrorNetworkHandling(error, dispatch)
    })
}
export const changeTaskStatusOnServer = (taskId: string, todolistId: string, status: TaskStatuses) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const task = getState().tasks[todolistId].find(t => t.id === taskId)
    if (task) {
        dispatch(setAppStatus({status:'loading'}))
        todolistsAPI.updateTask(todolistId, taskId, {
            title: task.title,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            status
        }).then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(changeTaskStatusAC({
                    taskId:res
                    .data.data.item.id,
                    status:res
                    .data.data.item.status,
                    todolistId:res
                    .data.data.item.todoListId
                }))
                dispatch(setAppStatus({status:'succeeded'}))
            } else {
                serverErrorHandling(res.data, dispatch)
            }
        }).catch((error) => {
            serverErrorNetworkHandling(error, dispatch)
        })
    }
}
export const changeTaskTitleOnServer = (todoID: string, taskID: string, title: string) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const task = getState().tasks[todoID].find(t => t.id === taskID)
    if (task) {
        dispatch(setAppStatus({status:'loading'}))
        todolistsAPI.updateTask(todoID, taskID, {
            title,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            status: task.status
        }).then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(changeTaskTitleAC({
                    taskId:res
                    .data.data.item.id,
                    title:res
                    .data.data.item.title,
                    todolistId:res
                    .data.data.item.todoListId
                }))
                dispatch(setAppStatus({status:'succeeded'}))
            }  else {
                serverErrorHandling(res.data, dispatch)
            }
        }).catch((error) => {
            serverErrorNetworkHandling(error, dispatch)
        })
    }
}

//types
export type ActionsType = ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof setTodosAC>
    | ReturnType<typeof setTasksFromTodo>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeTaskStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | ReturnType<typeof setTasksFromTodo>
    | ReturnType<typeof setAppError>
    | ReturnType<typeof setAppStatus>

export type TasksStateType = {
    [key: string]: Array<TaskType>
}