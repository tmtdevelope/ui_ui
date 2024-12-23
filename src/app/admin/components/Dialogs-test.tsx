'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Container, CircularProgress, Snackbar, Card, CardHeader, CardContent, TableContainer, Grid, Button, Table, TableBody, TableHead, TableRow, TableCell, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import adminUserService from '@utils/service/adminUserService';

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
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [items, setItems] = useState<User[]>([]);
    const [addDialogStatus, setAddDialogStatus] = useState<boolean>(false);
    const [editDialogStatus, setEditDialogStatus] = useState<boolean>(false);
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [formData, setFormData] = useState<FormData>({ name: '', email: '', organizationName: '', phoneNumber: '' });
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [successMsg, setSuccessMsg] = useState<string>('');
    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await adminUserService.getUsers();
            setItems(response.data.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const saveUser = async () => {
        setIsButtonLoading(true);
        try {
            await adminUserService.createUser(formData);
            setSuccessMsg('User added successfully!');
            setAddDialogStatus(false);
            fetchUsers();
        } catch (error) {
            setErrorMsg('Failed to save user.');
        } finally {
            setIsButtonLoading(false);
        }
    };

    return (
        <Container>
            <Snackbar open={!!successMsg} autoHideDuration={3000} onClose={() => setSuccessMsg('')} message={successMsg} />
            {isLoading ? (
                <CircularProgress />
            ) : (
                <Card>
                    <CardHeader title="Users" />
                    <CardContent>
                        <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => setAddDialogStatus(true)}>Add New</Button>
                        <TableContainer>
                            <Table>
                                {/* Table contents */}
                            </Table>
                        </TableContainer>

                        {/* Add User Dialog */}
                        <Dialog open={addDialogStatus} fullScreen={isMobile} onClose={() => { }}>
                            <DialogTitle>Add New User</DialogTitle>
                            <DialogContent>
                                {/* Input Fields */}
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setAddDialogStatus(false)} color="secondary" sx={{ fontWeight: 'bold' }}>Cancel</Button>
                                <Button onClick={saveUser} color="success" variant="contained" disabled={isButtonLoading} startIcon={isButtonLoading && <CircularProgress size={20} />}>
                                    {isButtonLoading ? 'Saving...' : 'Save'}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </CardContent>
                </Card>
            )}
        </Container>
    );
};

export default Users;
