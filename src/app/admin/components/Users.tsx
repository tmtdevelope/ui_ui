"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
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
  Typography,
  Paper,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import adminUserService from "@utils/service/adminUserService";

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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    organizationName: "",
    phoneNumber: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    email: "",
  });
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] = useState<keyof User>("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await adminUserService.getUsers();

      setItems(response.data.data);
      setFilteredItems(response.data.data);
    } catch (error) {
      setErrorMsg("Error fetching users.");
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
    // Filter based on all user fields (case-insensitive)
    const filtered = items.filter((user) => {
      // Improved type safety with optional chaining and nullish coalescing
      const userValues = Object.values(user) || []; // Handle potential undefined user
      return userValues.some((field) =>
        field?.toString().toLowerCase().includes(term)
      );
    });

    setFilteredItems(filtered);
  };

  const validateForm = () => {
    const errors = { name: "", email: "" };
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    setValidationErrors(errors);
    return !errors.name && !errors.email;
  };
  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      email: "",
      organizationName: "",
      phoneNumber: "",
    });
    setValidationErrors({ name: "", email: "" });
    setErrorMsg("");
  };
  const handleSave = async () => {
    if (!validateForm()) return;
    setIsButtonLoading(true);
    try {
      await adminUserService.createUser(formData);
      setSuccessMsg("User added successfully!");
      fetchUsers();
      resetForm();
      setAddDialogStatus(false);
    } catch (error) {
      setErrorMsg("Failed to save user.");
    } finally {
      setIsButtonLoading(false);
    }
  };

  const handleUpdate = async () => {
    //if (!validateForm()) return;
    setIsButtonLoading(true);
    try {
      await adminUserService.updateUser(formData.id, formData);
      // setSnackbar({ open: true, message: 'User updated successfully' });
      setSuccessMsg("User updated successfully!");
      fetchUsers();
      resetForm();
      setEditDialogStatus(false);
    } catch (error) {
      setErrorMsg("Failed to update user.");
    } finally {
      setIsButtonLoading(false);
    }
  };

  /*   const handleSaveOrUpdate = async () => {
          try {
              if (dialogState.type === 'edit') {
                  await adminUserService.updateUser(dialogState.data.id, dialogState.data);
                  setSnackbar({ open: true, message: 'User updated successfully' });
              } else {
                  await adminUserService.createUser(dialogState.data);
                  setSnackbar({ open: true, message: 'User created successfully' });
              }
              fetchUsers();
              setDialogState({ open: false, type: '', data: {} as User });
          } catch (error: any) {
              setErrorMsg(error.response?.data?.errors?.[0] || error.message);
          }
      }; */

  const handleDelete = async () => {
    setIsButtonLoading(true);
    try {
      await adminUserService.deleteUser(selectedUser!.id);
      //const response = await adminUserService.updateUser(formData.id as string, formData);

      setSuccessMsg("User deleted successfully!");
      fetchUsers();
      setConfirmDeleteDialogOpen(false);
    } catch (error) {
      setErrorMsg("Failed to delete user.");
    } finally {
      setIsButtonLoading(false);
    }
  };

  const handleSort = (property: keyof User) => {
    const isAsc = orderBy === property && orderDirection === "asc";
    setOrderDirection(isAsc ? "desc" : "asc");
    setOrderBy(property);
    const sortedData = [...filteredItems].sort((a, b) => {
      if (a[property] < b[property]) return isAsc ? -1 : 1;
      if (a[property] > b[property]) return isAsc ? 1 : -1;
      return 0;
    });
    setFilteredItems(sortedData);
  };
  const columnHeaders: { [key: string]: string } = {
    id: "ID",
    name: "Name",
    email: "Email",
    organizationName: "Organization",
    phoneNumber: "Phone",
    createdAt: "Created At",
  };

  return (
    /*         <Container sx={{ width: '100%', padding: isMobile ? '0' : 'inherit', display: 'flex', justifyContent: 'center' }}>
     */
    <Box>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Card>
          <CardHeader title="Users" />
          <CardContent>
            {successMsg && (
              <Snackbar
                open
                autoHideDuration={3000}
                onClose={() => setSuccessMsg("")}
                message={successMsg}
              />
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column-reverse" : "row",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <TextField
                label="Search"
                size="small"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearch}
                fullWidth={isMobile}
                sx={{ mb: isMobile ? 1 : 0 }}
              />
              <Button
                variant="contained"
                color="primary"
                size="medium"
                onClick={() => {
                  resetForm();
                  setAddDialogStatus(true);
                }}
                sx={{ mb: isMobile ? 3 : 0 }}
              >
                Add New User
              </Button>
            </Box>
            <TableContainer>
              <Table
                sx={{ minWidth: 650, minHeight: "30vh" }}
                stickyHeader
                aria-label="sticky table"
              >
                <TableHead>
                  <TableRow>
                    {Object.keys(columnHeaders).map((column) => (
                      <TableCell key={column}>
                        <TableSortLabel
                          active={orderBy === column}
                          direction={
                            orderBy === column ? orderDirection : "asc"
                          }
                          onClick={() => handleSort(column as keyof User)}
                        >
                          <Typography variant="subtitle2" fontWeight="bold">
                            {columnHeaders[column]}
                          </Typography>
                        </TableSortLabel>
                      </TableCell>
                    ))}
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Actions
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredItems
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell sx={{ maxWidth: 200 }}>
                          {user.organizationName}
                        </TableCell>
                        <TableCell>{user.phoneNumber}</TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => {
                              setEditDialogStatus(true);
                              setFormData(user);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => {
                              setConfirmDeleteDialogOpen(true);
                              setSelectedUser(user);
                            }}
                          >
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
              onRowsPerPageChange={(e) =>
                setRowsPerPage(parseInt(e.target.value, 10))
              }
            />
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      {/* Add User Dialog */}
      <Dialog
        open={addDialogStatus}
        //onClose={() => setAddDialogStatus(false)}
        fullScreen={isMobile}
        onClose={() => {}}
      >
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={!!validationErrors.name}
            helperText={validationErrors.name}
            autoFocus
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={!!validationErrors.email}
            helperText={validationErrors.email}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Organization"
            name="organizationName"
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Phone"
            name="phoneNumber"
            onChange={handleInputChange}
          />

          {/* Add other fields as needed */}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setAddDialogStatus(false)}
            variant="contained"
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            disabled={isButtonLoading}
          >
            {isButtonLoading ? <CircularProgress size={20} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog
        open={editDialogStatus}
        // onClose={() => setEditDialogStatus(false)}
        onClose={() => {}}
        fullScreen={isMobile}
        disableEscapeKeyDown
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {errorMsg && (
            <Alert severity="error" onClose={() => setErrorMsg("")}>
              {errorMsg}
            </Alert>
          )}
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={!!validationErrors.name}
            helperText={validationErrors.name}
            autoFocus
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={!!validationErrors.email}
            helperText={validationErrors.email}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Organization"
            name="organizationName"
            value={formData.organizationName || ""}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Phone"
            name="phoneNumber"
            value={formData.phoneNumber || ""}
            onChange={handleInputChange}
          />

          {/* Add other fields */}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditDialogStatus(false)}
            variant="contained"
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            color="primary"
            disabled={isButtonLoading}
          >
            {isButtonLoading ? <CircularProgress size={20} /> : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDeleteDialogOpen}
        //onClose={() => setConfirmDeleteDialogOpen(false)}
        /*  fullScreen={isMobile} */
        onClose={() => {}}
      >
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <Box sx={{ fontSize: "1.1rem", color: "blue" }}>
            Are you sure you want to delete user{" "}
            <strong>{selectedUser?.name}</strong> ?
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDeleteDialogOpen(false)}
            variant="contained"
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={isButtonLoading}
          >
            {isButtonLoading ? <CircularProgress size={20} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
