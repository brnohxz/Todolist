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

export const setError = (error:string | null)=>{
    return {type:'APP_SET_ERROR',error} as const
}

export const setStatus = (status:InitialAppStatuses)=>{
    return {type:'APP_SET_STATUS',status} as const
}


//types
export type InitialAppStatuses = 'IDLE' | 'loading' | 'succeeded' | 'failed'
export type InitialAppStateType = {
    status : InitialAppStatuses,
    error : string | null
}

type ActionType = any