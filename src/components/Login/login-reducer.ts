import {Dispatch} from "redux";
import {setAppError, setAppStatus} from "../../app/app-reducer";
import {authApi, loginPayloadType} from "../../api/todolists-api";
import {serverErrorHandling, serverErrorNetworkHandling} from "../../utils/errorHelper";
const initState: initStateLoginState = {
    isAuth: false
}

export const loginReducer = (state: initStateLoginState = initState, action: loginReducerActionTypes) => {
    switch (action.type) {
        case 'MAKE_AUTH' :
            return {...state, isAuth: action.isAuth}
        default:
            return state

    }
}

//thunk
export const makeAuthThunk = (payload: loginPayloadType) => (dispatch: Dispatch) => {
    dispatch(setAppStatus('loading'))
    authApi.login(payload).then((res) => {
        if (res.data.resultCode === 0) {
            dispatch(makeAuth(true))
            dispatch(setAppStatus('succeeded'))
        } else {
            serverErrorHandling(res.data, dispatch)
        }
    }).catch((error) => {
        serverErrorNetworkHandling(error, dispatch)
    })
}

export const makeLogOut = () => (dispatch:Dispatch) =>{
    dispatch(setAppStatus('loading'))
    authApi.logOut().then((res) => {

        if (res.data.resultCode === 0) {
            dispatch(makeAuth(false))
            dispatch(setAppStatus('succeeded'))
        } else {

            serverErrorHandling(res.data, dispatch)
        }
    }).catch((error) => {

        serverErrorNetworkHandling(error, dispatch)
    })
}

//actions
export const makeAuth = (isAuth: boolean) => {
    return {type: 'MAKE_AUTH', isAuth} as const
}
//types
export type initStateLoginState = {
    isAuth: boolean
}
export type loginReducerActionTypes = ReturnType<typeof makeAuth>
export type thunkDispatch = Dispatch<ReturnType<typeof setAppError> | ReturnType<typeof setAppStatus> | loginReducerActionTypes>