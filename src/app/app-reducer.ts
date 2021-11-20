import {Dispatch} from "redux";
import {authApi} from "../api/todolists-api";
import {serverErrorHandling, serverErrorNetworkHandling} from "../utils/errorHelper";
import {makeAuth} from "../components/Login/login-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const InitialState: InitialAppStateType = {
    status: 'IDLE',
    error: null,
    initialized: false
}

const slice = createSlice({
    name:'app',
    initialState:InitialState,
    reducers:{
        setAppStatus(state,action:PayloadAction<{status:InitialAppStatuses}>){
            state.status = action.payload.status
        },
        setAppError(state,action:PayloadAction<{error: string | null}>){
            state.error = action.payload.error
        },
        setAppInitialized(state,action:PayloadAction<{initialized: boolean}>){
            state.initialized = action.payload.initialized
        }
    }
})

export const appReducer = slice.reducer
export const {setAppStatus,setAppError,setAppInitialized} = slice.actions


//thunk
export const setAppInitializedChecker = () => (dispatch: Dispatch) => {
    authApi.checkAuth().then((res) => {
        if (res.data.resultCode === 0) {
            dispatch(makeAuth({value:true}))
            dispatch(dispatch(setAppStatus({status:'succeeded'})))
        } else {
            serverErrorHandling(res.data, dispatch)
        }
        dispatch(setAppInitialized({initialized:true}))

    }).catch((error) => {
        serverErrorNetworkHandling(error, dispatch)
    })
}
//types
export type InitialAppStatuses = 'IDLE' | 'loading' | 'succeeded' | 'failed'
export type InitialAppStateType = { status: InitialAppStatuses, error: string | null, initialized: boolean }
type ActionType =
    ReturnType<typeof setAppError>
    | ReturnType<typeof setAppStatus>
    | ReturnType<typeof setAppInitialized>