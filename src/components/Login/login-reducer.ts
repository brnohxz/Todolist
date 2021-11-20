import {Dispatch} from "redux";
import { setAppStatus} from "../../app/app-reducer";
import {authApi, loginPayloadType} from "../../api/todolists-api";
import {serverErrorHandling, serverErrorNetworkHandling} from "../../utils/errorHelper";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initState = {
    isAuth: false
}

const slice = createSlice({
    name:'login',
    initialState: initState,
    reducers:{
        makeAuth(state,action:PayloadAction<{value:boolean}>){
            state.isAuth = action.payload.value
        }
    }
})


export const loginReducer = slice.reducer
export const {makeAuth} = slice.actions

//thunk
export const makeAuthThunk = (payload: loginPayloadType) => (dispatch: Dispatch) => {
    dispatch(setAppStatus('loading'))
    authApi.login(payload).then((res) => {
        if (res.data.resultCode === 0) {
            dispatch(makeAuth({value:true}))
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
            dispatch(makeAuth({value:false}))
            dispatch(setAppStatus('succeeded'))
        } else {

            serverErrorHandling(res.data, dispatch)
        }
    }).catch((error) => {

        serverErrorNetworkHandling(error, dispatch)
    })
}