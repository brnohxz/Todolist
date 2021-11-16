import {todolistsAPI, TodolistType} from '../api/todolists-api'
import {Dispatch} from "redux";


export const todolistsReducer = (state: Array<TodolistDomainType> = [], action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {

        case "SET-TODOS": {
            return action.todos.map(tl => ({...tl, filter: 'all'}))
        }
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            let copyState = [...state]
            return [{...action.todolist, filter: 'all'}, ...copyState]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                todolist.title = action.title;
            }
            return [...state]
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                todolist.filter = action.filter;
            }
            return [...state]
        }
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

//thunk
export const setTodosThunk = () => (dispatch: Dispatch) => {
    todolistsAPI.getTodolists().then((res) => {
        dispatch(setTodosAC(res.data))
    })
}
export const addTodoListOnServer = (title: string) => (dispatch: Dispatch) => {
    todolistsAPI.createTodolist(title).then((res) => {
        dispatch(addTodolistAC(res.data.data.item))
    })
}
export const removeTodoFromServer = (todolistId: string) => (dispatch: Dispatch) => {
    todolistsAPI.deleteTodolist(todolistId).then((res) => {
        dispatch(removeTodolistAC(todolistId))
    })
}
export const changeTodolistTitleOnServer = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    todolistsAPI.updateTodolist(todolistId, title).then((res) => {
        dispatch(changeTodolistTitleAC(todolistId, title))
    })
}

//types
type ActionsType =
    ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof setTodosAC>

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}