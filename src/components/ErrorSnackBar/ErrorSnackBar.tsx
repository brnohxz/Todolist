import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {AlertProps} from '@mui/material/Alert';


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
//error | warning | info | success
export const ErrorSnackBar = () => {

    const [open, setOpen] = React.useState(true)

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        setOpen(false)
    };

    return (<Stack spacing={2} sx={{width: '100%'}}>
        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={open} autoHideDuration={6000}
                  onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{width: '100%'}} children={'This is a successmessage'}/>
        </Snackbar>
    </Stack>)
}
