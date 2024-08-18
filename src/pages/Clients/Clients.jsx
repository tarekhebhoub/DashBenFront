import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {  fetchCustomers, CreateClient, updateClient,deleteClient } from '../../services/data';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import TablePagination from '@mui/material/TablePagination';

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const Clients = () => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      const rowsData = await fetchCustomers();
      setRows(rowsData);
      setFilteredRows(rowsData);
    };

    fetchClients();
  }, []);

  useEffect(() => {
    const filtered = rows.filter(row =>
      String(row.name)?.toLowerCase().includes(filterQuery.toLowerCase()) ||
      String(row.ccp)?.toLowerCase().includes(filterQuery.toLowerCase())
    );
    setFilteredRows(filtered);
  }, [filterQuery, rows]);

  const handleFilterChange = (event) => {
    setFilterQuery(event.target.value);
  };

  const handleCreateNewItem = () => {
    setEditMode(false);
    setNewClient({
      name: '',
      ccp: '',
      phone: '',
      numCard: '',
      willaya: '',
      ville: ''
    });
    setOpenDialog(true);
  };

  const handleClickOpenEdit = (index) => {
    setSelectedIndex(index);
    setSelectedClient(rows[index]);
    setNewClient(rows[index]);
    setEditMode(true);
    setOpenDialog(true);
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickDeleteOpen = (index) => {
    setSelectedIndex(index);
    setOpenDeleteDialog(true);
  };

  const [newClient, setNewClient] = useState({
    name: '',
    ccp: '',
    phone: '',
    numCard: '',
    willaya: '',
    ville: ''
  });

  const handleClose = () => {
    setNewClient({
      name: '',
      ccp: '',
      phone: '',
      numCard: '',
      willaya: '',
      ville: ''
    });
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewClient(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddClient = async () => {
    try {
      const addedClient = await CreateClient(newClient);
      setRows(prevData => [...prevData, addedClient]);
      console.log('Data sent successfully');
    } catch (error) {
      console.error('Error sending data:', error);
    }

    handleClose();
  };

  const handleEditClient = async () => {
    try { 
      const updatedClient = await updateClient(selectedClient.id, newClient);
      setRows(prevData =>
        prevData.map((client, i) =>
          i === selectedIndex ? updatedClient : client
        )
      );
      console.log('Data updated successfully');
    } catch (error) {
      console.error('Error updating data:', error);
    }

    handleClose();
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async() => {
    await deleteClient(rows[selectedIndex].id);
    setRows(prevData => prevData.filter((_, i) => i !== selectedIndex));
    setOpenDeleteDialog(false);
  };

  // Paginate filtered rows
  const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mt={2}>
        <TextField
          label="بحث"
          variant="outlined"
          value={filterQuery}
          onChange={handleFilterChange}
          sx={{ width: '50%' }}
        />
        <Button variant="contained" color="primary" onClick={handleCreateNewItem}>
          إضافة عميل جديد
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>الإسم واللقب</TableCell>
              <TableCell align="">رقم الحساب البريدي</TableCell>
              <TableCell align="">رقم الهاتف</TableCell>
              <TableCell align="">رقم بطاقة التعريف الوطني</TableCell>
              <TableCell align="">ولاية الإقامة</TableCell>
              <TableCell align="">بلدية الإقامة</TableCell>
              <TableCell align="">العمليات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, index) => (
              <TableRow
                key={row.ccp}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>

                <TableCell align="">{row.ccp}</TableCell>
                <TableCell align="">0{row.phone}</TableCell>
                <TableCell align="">{row.numCard}</TableCell>
                <TableCell align="">{row.willaya}</TableCell>
                <TableCell align="">{row.ville}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleClickOpenEdit(index)}
                    variant="contained"
                    color="primary"
                  >
                    تعديل
                  </Button>
                  <Button
                    onClick={() => handleClickDeleteOpen(index)}
                    variant="contained"
                    color="secondary"
                  >
                    إزالة
                  </Button>
                </TableCell>

              </TableRow>
            ))}
            {/* Totals Row */}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteClose}
      >

        <DialogTitle>{"تأكيد الحذف"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            هل أنت متأكد من إزالة هذا الزبون
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            إلغاء
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary" autoFocus>
            إزالة
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>{editMode ? "تعديل بيانات العميل" : "إضافة عميل جديد"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {editMode ? "تعديل بيانات العميل." : "رجاءا قم بملئ معلومات العميل."}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="الإسم واللقب"
            name="name"
            fullWidth
            value={newClient.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="رقم الحساب البريدي"
            name="ccp"
            type="number"
            fullWidth
            value={newClient.ccp}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="رقم الهاتف"
            type="number"
            name="phone"
            fullWidth
            value={newClient.phone}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="رقم بطاقة التعريف الوطني"
            name="numCard"
            type="number"
            fullWidth
            value={newClient.numCard}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="ولاية الإقامة"
            name="willaya"
            fullWidth
            value={newClient.willaya}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="بلدية الإقامة"
            name="ville"
            fullWidth
            value={newClient.ville}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={editMode ? handleEditClient : handleAddClient} color="primary">
            {editMode ? "تعديل" : "إضافة"}
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
};

export default Clients;
