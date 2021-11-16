const InitialState:InitialStateType = {
    status:'IDLE',
    error:null
}

export const appReducer = (state:InitialStateType = InitialState,action:ActionType):InitialStateType => {
    switch (action.type) {
        case 'APP_SET_STATUS' : return {...state,status:action.status}
        case 'APP_SET_ERROR' : return {...state,error:action.error}
        default : return state
    }
}




//types
type InitialStateType = {
    status : 'IDLE' | 'loading' | 'succeeded' | 'failed',
    error : string | null
}

type ActionType = any