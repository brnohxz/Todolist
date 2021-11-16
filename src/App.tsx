import React from 'react'
import './App.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {Menu} from '@mui/icons-material';
import {TodolistsList} from "./pages/Todolists/TodolistsList";
import {LinearProgress} from "@mui/material";
import {ErrorSnackBar} from "./components/ErrorSnackBar/ErrorSnackBar";





function App() {
    return (
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
                <LinearProgress />
            </AppBar>
            <ErrorSnackBar/>
            <Container fixed>
                <TodolistsList/>
            </Container>
        </div>
    );
}

export default App;
