import React from 'react'
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
import {useSelector} from "react-redux";
import {AppRootStateType} from "./store";
import {InitialAppStatuses} from "./app-reducer";
import {BrowserRouter, Route} from "react-router-dom";
import {Login} from "../components/Login/Login";


function App() {
    const status = useSelector<AppRootStateType, InitialAppStatuses>(state => state.app.status)
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
