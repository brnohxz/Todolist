const initState:initStateLoginState = {
    login: '',
    password: '',
    rememberMe: false
}

export const loginReducer = (state: initStateLoginState = initState, action: loginReducerActionTypes) => {
    switch (action.type) {
        case 'MAKE_AUTH' :
        default:
            return state

    }
}

//thunk

//actions
export const makeAuth = (login: string, password: string, rememberMe: boolean) => {
    return {type: 'MAKE_AUTH', login, password, rememberMe} as const
}
//types
export type initStateLoginState = {
    login: string,
    password: string,
    rememberMe: boolean
}
export type loginReducerActionTypes = ReturnType<typeof makeAuth>