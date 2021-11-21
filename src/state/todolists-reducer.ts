import {todolistsAPI, TodolistType} from '../api/todolists-api'
import {Dispatch} from "redux";
import {InitialAppStatuses, setAppError, setAppStatus} from "../app/app-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

// export const todolistsReducer = (state: Array<TodolistDomainType> = [], action: ActionsType): Array<TodolistDomainType> => {
//     switch (action.type) {
//         case "SET-TODOS":
//             return action.todos.map(tl => ({...tl, filter: 'all', entityStatus: 'IDLE'}))
//         case 'REMOVE-TODOLIST':
//             return state.filter(tl => tl.id !== action.id)
//         case 'ADD-TODOLIST':
//             return [{...action.todolist, filter: 'all', entityStatus: 'IDLE'}, ...state]
//         case 'CHANGE-TODOLIST-TITLE':
//             return state.map(t => t.id === action.id ? {...t, title: action.title} : t)
//         case 'CHANGE-TODOLIST-FILTER':
//             return state.map(t => t.id === action.id ? {...t, filter: action.filter} : t)
//         case "SET-TODO-STATUS":
//             return state.map(t => t.id === action.id ? {...t, entityStatus: action.status} : t)
//         default:
//             return state;
//     }
// }

const slice = createSlice({
    name:'todos',
    initialState:[] as Array<TodolistDomainType>,
    reducers:{
        removeTodolistAC(state,action:PayloadAction<{id: string}>){
            const index = state.findIndex(tl=>tl.id === action.payload.id)
            if(index > -1){
                state.splice(index,1)
            }
        },
        addTodolistAC(state,action:PayloadAction<{todolist: TodolistType}>){
            state.push({...action.payload.todolist, filter: 'all', entityStatus: 'IDLE'})
        },
        changeTodolistTitleAC(state,action:PayloadAction<{id: string, title: string}>){
            const index = state.findIndex(tl=>tl.id === action.payload.id)
            if(index > -1){
                state[index].title = action.payload.title
            }
        },
        changeTodolistFilterAC(state,action:PayloadAction<{id: string, filter: FilterValuesType}>){
            const index = state.findIndex(tl=>tl.id === action.payload.id)
            if(index > -1){
                state[index].filter = action.payload.filter
            }
        },
        setTodosAC(state,action:PayloadAction<{todos: Array<TodolistType>}>){
            return action.payload.todos.map(tl=>({...tl,filter:'all',entityStatus:'IDLE'}))
        },
        setTodosEntityStatus(state,action:PayloadAction<{id: string, status: InitialAppStatuses}>){
            const index = state.findIndex(tl=>tl.id === action.payload.id)
            if(index > -1){
                state[index].entityStatus = action.payload.status
            }
        },
    }
})

export const todolistsReducer = slice.reducer

//actions
export const {removeTodolistAC,addTodolistAC,changeTodolistTitleAC,changeTodolistFilterAC,setTodosAC,setTodosEntityStatus} = slice.actions
//thunk
export const setTodosThunk = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatus({status:'loading'}))
    todolistsAPI.getTodolists()
        .then((res) => {
            dispatch(setTodosAC({todos:res.data}))
            dispatch(setAppStatus({status:'succeeded'}))
        }).catch((error) => {
        dispatch(setAppError(error.message))
        dispatch(setAppStatus({status:'failed'}))
    })
}
export const addTodoListOnServer = (title: string) => (dispatch: Dispatch<ActionsType>) => {
    debugger
    dispatch(setAppStatus({status:'loading'}))
    todolistsAPI.createTodolist(title).then((res) => {
        dispatch(addTodolistAC({todolist:res.data.data.item}))
        dispatch(setAppStatus({status:'succeeded'}))
    }).catch((error) => {
        dispatch(setAppError(error.message[0]))
        dispatch(setAppStatus({status:'failed'}))
    })
}
export const removeTodoFromServer = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatus({status:'loading'}))
    dispatch(setTodosEntityStatus({id:todolistId, status:'loading'}))
    todolistsAPI.deleteTodolist(todolistId).then(() => {
        dispatch(removeTodolistAC({id:todolistId}))
        dispatch(setAppStatus({status:'succeeded'}))
    }).catch((error) => {
        dispatch(setAppError(error.message))
        dispatch(setAppStatus({status:'failed'}))
    })
}
export const changeTodolistTitleOnServer = (todolistId: string, title: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatus({status:'loading'}))
    todolistsAPI.updateTodolist(todolistId, title).then(() => {
        dispatch(changeTodolistTitleAC({id:todolistId, title:title}))
        dispatch(setAppStatus({status:'succeeded'}))
    }).catch((error) => {
        dispatch(setAppError(error.message))
        dispatch(setAppStatus({status:'failed'}))
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