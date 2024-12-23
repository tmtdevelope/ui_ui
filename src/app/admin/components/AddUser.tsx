import React, { ChangeEvent, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert, TextField } from '@mui/material';

interface AddUserDialogProps {
    open: boolean;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    onConfirm?: () => void;
    disableBackdropClose?: boolean;
    confirmLabel?: string,
}
const [errorMsg, setErrorMsg] = useState<string>('');
const [formData, setFormData] = useState<FormData>({
    id: '',
    name: '',
    email: '',
    organizationName: '',
    phoneNumber: '',
});
const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
};
const resetForm = () => {
    setFormData({
        id: '',
        name: '',
        email: '',
        organizationName: '',
        phoneNumber: '',
    });
    setErrorMsg('');
};
interface User {
    id: string;
    name: string;
    email: string;
    organizationName: string;
    phoneNumber: string;
    createdAt: string;
}

interface FormData {
    id?: string;
    name: string;
    email: string;
    organizationName: string;
    phoneNumber: string;
}

const AddUser: React.FC<AddUserDialogProps> = ({
    open,
    title,
    children,
    onClose,
    onConfirm,
    disableBackdropClose = true,
    confirmLabel = "confirm",
}) => {

    const handleClose = (_: unknown, reason: 'backdropClick' | 'escapeKeyDown') => {
        if (disableBackdropClose && (reason === 'backdropClick' || reason === 'escapeKeyDown')) return;
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{title}</DialogTitle>
            {/*      <DialogTitle>Add New User</DialogTitle> */}
            <DialogContent>
                <Alert
                    severity="error"
                    style={{ display: errorMsg ? 'block' : 'none' }}
                >
                    {errorMsg}
                </Alert>
                <TextField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Organization Name"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                {onConfirm && <Button onClick={onConfirm} variant="contained">{confirmLabel}</Button>}
            </DialogActions>
        </Dialog>
    );
};

export default AddUser;
