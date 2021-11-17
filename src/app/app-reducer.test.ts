import {appReducer, InitialAppStateType, setAppError, setAppStatus} from "./app-reducer";

let startState: InitialAppStateType;

beforeEach(() => {
    startState = {
        status: 'IDLE',
        error: null
    }
})


test('Check error message', () => {
const endState = appReducer(startState,setAppError('404'))
    expect(endState.error).toBe('404')
})

test('Check app status', () => {
    const endState = appReducer(startState,setAppStatus('loading'))
    expect(endState.status).toBe('loading')
})