'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import {
    Container,
    CircularProgress,
    Snackbar,
    Card,
    CardHeader,
    CardContent,
    TableContainer,
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
    Button,
    Box,
    TableSortLabel,
    TablePagination,
} from '@mui/material';
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

const Users: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [items, setItems] = useState<User[]>([]);
    const [filteredItems, setFilteredItems] = useState<User[]>([]);
    const [addDialogStatus, setAddDialogStatus] = useState<boolean>(false);
    const [editDialogStatus, setEditDialogStatus] = useState<boolean>(false);
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', organizationName: '', phoneNumber: '' });
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [successMsg, setSuccessMsg] = useState<string>('');
    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Sorting
    const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState<keyof User>('name');

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await adminUserService.getUsers();
            setItems(response.data.data);
            setFilteredItems(response.data.data);
        } catch (error) {
            setErrorMsg('Error fetching users.');
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

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = items.filter((user) =>
            user.name.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term) ||
            user.organizationName?.toLowerCase().includes(term) ||
            user.phoneNumber?.toLowerCase().includes(term)
        );
        setFilteredItems(filtered);
    };

    const handleSort = (property: keyof User) => {
        const isAsc = orderBy === property && orderDirection === 'asc';
        setOrderDirection(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        const sortedData = [...filteredItems].sort((a, b) => {
            if (a[property] < b[property]) return isAsc ? -1 : 1;
            if (a[property] > b[property]) return isAsc ? 1 : -1;
            return 0;
        });
        setFilteredItems(sortedData);
    };

    const handleDelete = async () => {
        setIsButtonLoading(true);
        try {
            await adminUserService.deleteUser(userToDelete!.id);
            setSuccessMsg('User deleted successfully!');
            fetchUsers();
            setConfirmDeleteDialogOpen(false);
        } catch (error) {
            setErrorMsg('Failed to delete user.');
        } finally {
            setIsButtonLoading(false);
        }
    };

    return (
        <Container sx={{ width: '100%', padding: isMobile ? '0' : 'inherit' }}>
            {successMsg && <Snackbar open autoHideDuration={3000} onClose={() => setSuccessMsg('')} message={successMsg} />}
            {errorMsg && <Alert severity="error" onClose={() => setErrorMsg('')}>{errorMsg}</Alert>}

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', height: '50vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Card>
                    <CardHeader title="Users" />
                    <CardContent>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 2,
                            alignItems: 'center' // Add this to vertically center
                        }}>
                            <TextField
                                label="Search"
                                variant="outlined"
                                value={searchTerm}
                                onChange={handleSearch}
                                sx={{
                                    // Adjust font size, padding, and line height as needed
                                    // fontSize: '16px',
                                    //padding: '10px',
                                    lineHeight: '1.5',


                                }}
                                size="small"
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setAddDialogStatus(true)}
                            /* sx={{
                                // Adjust font size, padding, and line height as needed
                                fontSize: '16px',
                                padding: '10px',
                                lineHeight: '1.5'
                            }} */
                            >
                                Add New
                            </Button>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {['name', 'email', 'organizationName', 'phoneNumber'].map((column) => (
                                            <TableCell key={column}>
                                                <TableSortLabel
                                                    active={orderBy === column}
                                                    direction={orderBy === column ? orderDirection : 'asc'}
                                                    onClick={() => handleSort(column as keyof User)}
                                                >
                                                    {column.charAt(0).toUpperCase() + column.slice(1)}
                                                </TableSortLabel>
                                            </TableCell>
                                        ))}
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.organizationName}</TableCell>
                                            <TableCell>{user.phoneNumber}</TableCell>
                                            <TableCell>
                                                <IconButton color="primary" onClick={() => { setEditDialogStatus(true); setFormData(user); }}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton color="error" onClick={() => { setConfirmDeleteDialogOpen(true); setUserToDelete(user); }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            component="div"
                            count={filteredItems.length}
                            page={page}
                            onPageChange={(e, newPage) => setPage(newPage)}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
                        />
                    </CardContent>
                </Card>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={confirmDeleteDialogOpen} fullWidth disableEscapeKeyDown>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Box sx={{ typography: 'body1', fontWeight: 'bold', color: 'blue' }}>
                        Are you sure you want to delete <span>{userToDelete?.name}</span>?
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteDialogOpen(false)} color="secondary" variant="outlined">Cancel</Button>
                    <Button onClick={handleDelete} color="error" variant="contained" disabled={isButtonLoading}>
                        {isButtonLoading ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Users;
