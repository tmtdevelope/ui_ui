'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { makeStyles } from '@mui/styles';
import {
    Container,
    CircularProgress,
    Snackbar,
    Card,
    CardHeader,
    CardContent,
    TableContainer,
    Grid,
    Button,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import adminUserService from '@utils/service/adminUserService';

const useStyles = makeStyles(() => ({
    progressContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
    },
}));

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

const Users: React.FC = () => {
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [snackbar, setSnackbar] = useState<boolean>(false);
    const [successMsg, setSuccessMsg] = useState<string>('');
    const [items, setItems] = useState<User[]>([]);
    const [addDialogStatus, setAddDialogStatus] = useState<boolean>(false);
    const [editDialogStatus, setEditDialogStatus] = useState<boolean>(false);
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const handleDeleteConfirmation = (user: User) => {
        setUserToDelete(user);
        setConfirmDeleteDialogOpen(true);
    };
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [formData, setFormData] = useState<FormData>({
        id: '',
        name: '',
        email: '',
        organizationName: '',
        phoneNumber: '',
    });

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

    const openAddDialog = () => {
        resetForm();
        setAddDialogStatus(true);
    };

    const closeAddDialog = () => {


        setAddDialogStatus(false);
    };

    const openEditDialog = (user: User) => {
        setFormData(user);
        setEditDialogStatus(true);
    };

    const closeEditDialog = () => {
        resetForm();
        setEditDialogStatus(false);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await adminUserService.getUsers();
            const data = response.data.data;
            setItems(
                data.map((user: User) => ({
                    ...user,
                    createdAt: new Date(user.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                }))
            );
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);

    const saveUser = async () => {
        try {
            const response = await adminUserService.createUser(formData);
            const data = response.data;
            setSuccessMsg(data.message);
            setSnackbar(true);
            setAddDialogStatus(false);
            fetchUsers(); // Fetch updated user list
        } catch (error: any) {
            console.error('Error saving user:', error);
            if (error.response?.data?.errors) {
                setErrorMsg(error.response.data.errors[0]);
            } else {
                setErrorMsg(error.message);
            }
        }
    };

    const updateUser = async () => {
        try {
            const response = await adminUserService.updateUser(formData.id as string, formData);
            const data = response.data;
            setSuccessMsg(data.message);
            setSnackbar(true);
            setEditDialogStatus(false);
            fetchUsers(); // Fetch updated user list
        } catch (error: any) {
            console.error('Error updating user:', error);
            if (error.response?.data?.errors) {
                setErrorMsg(error.response.data.errors[0]);
            } else {
                setErrorMsg(error.message);
            }
        }
    };


    const deleteUser = async (id: string) => {

        try {
            await adminUserService.deleteUser(id);
            setSuccessMsg('User deleted successfully');
            setSnackbar(true);
            fetchUsers(); // Fetch updated user list
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }

    return (
        <Container>
            {/*     <div
                className={classes.progressContainer}
                style={{ display: isLoading ? 'flex' : 'none' }}
            >
                <CircularProgress />
            </div> */}

            <Snackbar
                open={snackbar}
                autoHideDuration={3000}
                onClose={() => setSnackbar(false)}
                message={successMsg}
            />
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', height: '50vh' }}>
                    <CircularProgress size={50} color="primary" />
                </div>
            ) : (
                <Card>
                    <CardContent>
                        <CardHeader title="Users" />
                        <Grid container spacing={2}>
                            <Grid
                                item
                                xs={12}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                }}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={openAddDialog}
                                >
                                    Add New
                                </Button>
                            </Grid>
                        </Grid>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {[
                                            'Name',
                                            'Email',
                                            'Organization Name',
                                            'Phone Number',
                                            'Created',
                                            'Actions',
                                        ].map((title, index) => (
                                            <TableCell key={index}>{title}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.email}</TableCell>
                                            <TableCell>{item.organizationName}</TableCell>
                                            <TableCell>{item.phoneNumber}</TableCell>
                                            <TableCell>{item.createdAt}</TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => openEditDialog(item)}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton onClick={() => handleDeleteConfirmation(item)}>                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Add User Dialog */}
                        <Dialog open={addDialogStatus} onClose={(_, reason) => {
                            // Prevent closing on "backdropClick" or "escapeKeyDown"
                            if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
                            closeAddDialog();
                        }}
                        >
                            <DialogTitle>Add New User</DialogTitle>
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
                                <Button onClick={closeAddDialog} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={saveUser} color="primary">
                                    Save
                                </Button>
                            </DialogActions>
                        </Dialog>

                        {/* Edit User Dialog */}
                        <Dialog open={editDialogStatus} onClose={closeEditDialog}>
                            <DialogTitle>Edit User</DialogTitle>
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
                                <Button onClick={closeEditDialog} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={updateUser} color="primary">
                                    Update
                                </Button>
                            </DialogActions>
                        </Dialog>
                        {/* Confirm Delete Dialog */}
                        <Dialog open={confirmDeleteDialogOpen} onClose={() => setConfirmDeleteDialogOpen(false)}>
                            <DialogTitle>Confirm Delete</DialogTitle>
                            <DialogContent>
                                Are you sure you want to delete {userToDelete?.name}?
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setConfirmDeleteDialogOpen(false)}>Cancel</Button>
                                <Button onClick={() => {
                                    deleteUser(userToDelete?.id ?? '');
                                    setConfirmDeleteDialogOpen(false);
                                }}>Delete</Button>
                            </DialogActions>
                        </Dialog>
                    </CardContent>
                </Card>
            )}
        </Container>
    );
};

export default Users;

