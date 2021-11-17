import {todolistsAPI, TodolistType} from '../api/todolists-api'
import {Dispatch} from "redux";
import {InitialAppStatuses, setAppError, setAppStatus} from "../app/app-reducer";

export const todolistsReducer = (state: Array<TodolistDomainType> = [], action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case "SET-TODOS":
            return action.todos.map(tl => ({...tl, filter: 'all', entityStatus: 'IDLE'}))
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'all', entityStatus: 'IDLE'}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(t => t.id === action.id ? {...t, title: action.title} : t)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(t => t.id === action.id ? {...t, filter: action.filter} : t)
        case "SET-TODO-STATUS":
            return state.map(t => t.id === action.id ? {...t, entityStatus: action.status} : t)
        default:
            return state;
    }
}

//actions
export const removeTodolistAC = (id: string) =>
    ({type: 'REMOVE-TODOLIST', id} as const)
export const addTodolistAC = (todolist: TodolistType) =>
    ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistTitleAC = (id: string, title: string) =>
    ({type: 'CHANGE-TODOLIST-TITLE', id, title} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) =>
    ({type: 'CHANGE-TODOLIST-FILTER', id, filter} as const)
export const setTodosAC = (todos: Array<TodolistType>) =>
    ({type: 'SET-TODOS', todos} as const)
export const setTodosEntityStatus = (id: string, status: InitialAppStatuses) =>
    ({type: 'SET-TODO-STATUS', id, status} as const)

//thunk
export const setTodosThunk = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatus('loading'))
    todolistsAPI.getTodolists()
        .then((res) => {
            dispatch(setTodosAC(res.data))
            dispatch(setAppStatus('succeeded'))
        }).catch((error) => {
        dispatch(setAppError(error.message))
        dispatch(setAppStatus('failed'))
    })
}
export const addTodoListOnServer = (title: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatus('loading'))
    todolistsAPI.createTodolist(title).then((res) => {
        dispatch(addTodolistAC(res.data.data.item))
        dispatch(setAppStatus('succeeded'))
    }).catch((error) => {
        dispatch(setAppError(error.message))
        dispatch(setAppStatus('failed'))
    })
}
export const removeTodoFromServer = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatus('loading'))
    dispatch(setTodosEntityStatus(todolistId, 'loading'))
    todolistsAPI.deleteTodolist(todolistId).then(() => {
        dispatch(removeTodolistAC(todolistId))
        dispatch(setAppStatus('succeeded'))
    }).catch((error) => {
        dispatch(setAppError(error.message))
        dispatch(setAppStatus('failed'))
    })
}
export const changeTodolistTitleOnServer = (todolistId: string, title: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatus('loading'))
    todolistsAPI.updateTodolist(todolistId, title).then(() => {
        dispatch(changeTodolistTitleAC(todolistId, title))
        dispatch(setAppStatus('succeeded'))
    }).catch((error) => {
        dispatch(setAppError(error.message))
        dispatch(setAppStatus('failed'))
    })
}

//types
type ActionsType =
    ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof setTodosAC>
    | ReturnType<typeof setAppStatus>
    | ReturnType<typeof setTodosEntityStatus>
    | ReturnType<typeof setAppError>

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: InitialAppStatuses
}