import {todolistsAPI, TodolistType} from '../api/todolists-api'
import {Dispatch} from "redux";


type ActionsType =
    ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof setTodosAC>

const initialState: Array<TodolistDomainType> = [
    /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
    {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {

        case "SET-TODOS": {
            return action.todos.map(tl => {
                return {...tl, filter: 'all'}
            })
        }
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            debugger
            let copyState = [...state]
            return [{...action.todolist, filter: 'all'}, ...copyState]
            // return [{
            //     id: action.todolistId,
            //     title: action.title,
            //     filter: 'all',
            //     addedDate: '',
            //     order: 0
            // }, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.title = action.title;
            }
            return [...state]
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.filter = action.filter;
            }
            return [...state]
        }

        default:
            return state;
    }
}

export const removeTodolistAC = (todolistId: string) => {
    return {type: 'REMOVE-TODOLIST', id: todolistId} as const
}
export const addTodolistAC = (todolist: TodolistType) => {
    return {type: 'ADD-TODOLIST', todolist} as const
}
export const changeTodolistTitleAC = (id: string, title: string) => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: id, title: title} as const
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => {
    return {type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter} as const
}
export const setTodosAC = (todos: Array<TodolistType>) => {
    return {type: 'SET-TODOS', todos} as const
}

//THUNK

export const setTodosThunk = () => {
    return (dispatch: Dispatch) => {
        return todolistsAPI.getTodolists().then((res) => {
            dispatch(setTodosAC(res.data))
        })
    }
}

export const addTodoListOnServer = (title: string) => (dispatch: Dispatch) => {
    debugger
    todolistsAPI.createTodolist(title).then((res) => {
        debugger
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