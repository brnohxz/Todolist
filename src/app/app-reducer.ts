const InitialState:InitialAppStateType = {
    status:'IDLE',
    error:null
}

export const appReducer = (state:InitialAppStateType = InitialState, action:ActionType):InitialAppStateType => {
    switch (action.type) {
        case 'APP_SET_STATUS' : return {...state,status:action.status}
        case 'APP_SET_ERROR' : return {...state,error:action.error}
        default : return state
    }
}

//actions
export const setStatus = (status:InitialAppStatuses)=>({type:'APP_SET_STATUS',status} as const)
export const setError = (error:string | null)=>({type:'APP_SET_ERROR',error} as const)

//types
export type InitialAppStatuses = 'IDLE' | 'loading' | 'succeeded' | 'failed'
export type InitialAppStateType = {status : InitialAppStatuses, error : string | null}
type ActionType = ReturnType<typeof setError> | ReturnType<typeof setStatus>