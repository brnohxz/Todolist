import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import {useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const ErrorSnackBar = () => {

    const error = useSelector<AppRootStateType,string | null>(state => state.app.error)
    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
    };


    return (<Stack spacing={2} sx={{width: '100%'}}>
        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={!!error} autoHideDuration={6000}
                  onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{width: '100%'}} children={error}/>
        </Snackbar>
    </Stack>)
}

//error | warning | info | success - types of alert
