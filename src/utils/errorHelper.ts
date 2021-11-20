import {ResponseType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {setAppError, setAppStatus} from "../app/app-reducer";
export const serverErrorHandling = <D>(data: ResponseType<D>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(setAppError({error:data.messages[0]}))
    } else {
        dispatch(setAppError({error:'Some error occurred. Message me to solve this problem'}))
    }
    dispatch(setAppStatus({status:'failed'}))

}
export const serverErrorNetworkHandling = (error:{message:string},dispatch:Dispatch) => {
    dispatch(setAppError({error:error.message}))
    dispatch(setAppStatus({status:'failed'}))
}