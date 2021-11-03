import {todolistsAPI, TodolistType} from '../api/todolists-api'
import {Dispatch} from "redux";

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST',
    id: string
}
export type AddTodolistActionType = {
    type: 'ADD-TODOLIST',
    todolist:TodolistType
}
export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE',
    id: string
    title: string
}
export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER',
    id: string
    filter: FilterValuesType
}

type ActionsType = RemoveTodolistActionType | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType | SetTodosAC

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
            return action.todos.map(tl=>{
                return {...tl,filter:'all'}
            })
        }
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            debugger
            let copyState = [...state]
            return [{...action.todolist,filter:'all'},...copyState]
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

export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return {type: 'REMOVE-TODOLIST', id: todolistId}
}
export const addTodolistAC = (todolist:TodolistType): AddTodolistActionType => {
    debugger
    return {type: 'ADD-TODOLIST', todolist}
}
export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: id, title: title}
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return {type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter}
}
export const setTodosAC = (todos:Array<TodolistType>) => {
    return {type: 'SET-TODOS',todos} as const
}

export type  SetTodosAC = ReturnType<typeof setTodosAC>


//THUNK

export const setTodosThunk = ()=>{
    return (dispatch:Dispatch) => {
        return todolistsAPI.getTodolists().then((res)=>{
            dispatch(setTodosAC(res.data))
        })
    }
}

export const addTodoListOnServer = (title:string)=>(dispatch:Dispatch)=>{
    debugger
    todolistsAPI.createTodolist(title).then((res)=>{
        debugger
        dispatch(addTodolistAC(res.data.data.item))
    })
}

export const removeTodoFromServer = (todolistId:string)=>(dispatch:Dispatch)=>{
    todolistsAPI.deleteTodolist(todolistId).then((res)=>{
        dispatch(removeTodolistAC(todolistId))
    })
}

export const changeTodolistTitleOnServer = (todolistId:string,title:string) => (dispatch:Dispatch)=>{
    todolistsAPI.updateTodolist(todolistId,title).then((res)=>{
        dispatch(changeTodolistTitleAC(todolistId,title))
    })
}