import React, {useCallback, useEffect} from 'react';
import Grid from "@mui/material/Grid";
import {AddItemForm} from "../../components/AddItemForm";
import Paper from "@mui/material/Paper";
import {Todolist} from "../../components/Todolist/Todolist";
import {
    addTodoListOnServer,
    changeTodolistFilterAC, changeTodolistTitleOnServer,
    FilterValuesType,
    removeTodoFromServer,
    setTodosThunk,
    TodolistDomainType
} from "../../state/todolists-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {
    addTaskToServer,
    changeTaskStatusOnServer,
    changeTaskTitleOnServer,
    removeTaskFromServer, TasksStateType
} from "../../state/tasks-reducer";
import {TaskStatuses} from "../../api/todolists-api";

export const TodolistsList = () => {

    useEffect(()=>{
        dispatch(setTodosThunk())
    },[])

    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const dispatch = useDispatch();

    const removeTask = useCallback(function (id: string, todolistId: string) {
        dispatch(removeTaskFromServer(id,todolistId))
    }, []);

    const addTask = useCallback(function (title: string, todolistId: string) {
        dispatch(addTaskToServer(title,todolistId));
    }, []);

    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        dispatch(changeTaskStatusOnServer(id, todolistId,status));
    }, []);

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        dispatch(changeTaskTitleOnServer(todolistId,id ,newTitle));
    }, []);

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        const action = changeTodolistFilterAC(todolistId, value);
        dispatch(action);
    }, []);

    const removeTodolist = useCallback(function (id: string) {
        dispatch(removeTodoFromServer(id));
    }, []);

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        dispatch(changeTodolistTitleOnServer(id, title));
    }, []);

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodoListOnServer(title));
    }, [dispatch]);


    return (
        <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
    <Grid container spacing={3}>
        {
            todolists.map(tl => {
                let allTodolistTasks = tasks[tl.id];

                return <Grid item key={tl.id}>
                    <Paper style={{padding: '10px'}}>
                        <Todolist
                            todolist={tl}
                            tasks={allTodolistTasks}
                            removeTask={removeTask}
                            changeFilter={changeFilter}
                            addTask={addTask}
                            changeTaskStatus={changeStatus}
                            removeTodolist={removeTodolist}
                            changeTaskTitle={changeTaskTitle}
                            changeTodolistTitle={changeTodolistTitle}
                        />
                    </Paper>
                </Grid>
            })
        }
    </Grid>
        </>
    );
};

