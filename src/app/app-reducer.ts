import {Dispatch} from "redux";
import {authApi} from "../api/todolists-api";
import {serverErrorHandling, serverErrorNetworkHandling} from "../utils/errorHelper";
import {makeAuth} from "../components/Login/login-reducer";

const InitialState: InitialAppStateType = {
    status: 'IDLE',
    error: null,
    initialized: false
}

export const appReducer = (state: InitialAppStateType = InitialState, action: ActionType): InitialAppStateType => {
    switch (action.type) {
        case 'APP_SET_STATUS' :
            return {...state, status: action.status}
        case 'APP_SET_ERROR' :
            return {...state, error: action.error}
        case "APP_SET_INIT":
            return {...state, initialized: action.initialized}
        default :
            return state
    }
}

//actions
export const setAppStatus = (status: InitialAppStatuses) => ({type: 'APP_SET_STATUS', status} as const)
export const setAppError = (error: string | null) => ({type: 'APP_SET_ERROR', error} as const)
export const setAppInitialized = (initialized: boolean) => {
    return {type: 'APP_SET_INIT', initialized} as const
}
//thunk
export const setAppInitializedChecker = () => (dispatch: Dispatch) => {
    authApi.checkAuth().then((res) => {
        if (res.data.resultCode === 0) {
            dispatch(makeAuth(true))
            dispatch(dispatch(setAppStatus('succeeded')))
        } else {
            serverErrorHandling(res.data, dispatch)
        }
        dispatch(setAppInitialized(true))

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