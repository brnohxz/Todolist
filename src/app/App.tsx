import React, {useEffect} from 'react'
import './App.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {Menu} from '@mui/icons-material';
import {TodolistsList} from "../pages/Todolists/TodolistsList";
import {LinearProgress} from "@mui/material";
import {ErrorSnackBar} from "../components/ErrorSnackBar/ErrorSnackBar";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./store";
import {InitialAppStatuses, setAppInitializedChecker} from "./app-reducer";
import {BrowserRouter, Route} from "react-router-dom";
import {Login} from "../components/Login/Login";


function App() {
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(setAppInitializedChecker())
    },[])
    const status = useSelector<AppRootStateType, InitialAppStatuses>(state => state.app.status)
    const init = useSelector<AppRootStateType, boolean>(state => state.app.initialized)
    if (!init) {
        return <div style={{
            height: '100vh',
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            flexDirection:'column',
            alignItems: 'center'
        }}>
            <Typography variant="h2" component="div" gutterBottom>
                Todolist
            </Typography>
            <div style={{width:'30%'}}><LinearProgress color="inherit"/></div>
        </div>
    }


    return (<BrowserRouter>
            <div className="App">
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <Menu/>
                        </IconButton>
                        <Typography variant="h6">
                            Todolist
                        </Typography>
                    </Toolbar>
                    {status === 'loading' && <LinearProgress/>}
                </AppBar>
                <ErrorSnackBar/>
                <Container fixed>
                    <Route exact path={'/'}>
                        <TodolistsList/>
                    </Route>
                    <Route path={'/login'}>
                        <Login/>
                    </Route>
                </Container>
            </div>
        </BrowserRouter>
    );
}

export default App;
