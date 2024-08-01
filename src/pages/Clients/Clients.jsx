import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getVentes,fetchCustomers,CreateClient } from '../../services/data';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import TablePagination from '@mui/material/TablePagination';


import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';


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
    console.log('Ajouter une Vente');
    navigate('/CreateClient');
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
    phoneNumber: '',
    numCard: '',
    willaya: '',
    ville: ''
  });

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setNewClient({
      name: '',
      ccp: '',
      phoneNumber: '',
      numCard: '',
      willaya: '',
      ville: ''      
    })
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
      const addedClient=await CreateClient(newClient);
      setRows(prevData => [...prevData, addedClient]);


      

      console.log('Data sent successfully');
    } catch (error) {
      console.error('Error sending data:', error);
    }

    setOpenDialog(false);
      setNewClient({
        name: '',
        ccp: '',
        phoneNumber: '',
        numCard: '',
        willaya: '',
        ville: ''
      });
      
  };


   











  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = () => {
    setRows(prevData => prevData.filter((_, i) => i !== selectedIndex));
    setOpenDeleteDialog(false);
  };


  // Paginate filtered rows
  const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mt={2}>
        <TextField
          label="Filter"
          variant="outlined"
          value={filterQuery}
          onChange={handleFilterChange}
          sx={{ width: '50%' }}
        />
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Ajouter une Client
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nom de Client</TableCell>
              <TableCell align="">CCP</TableCell>
              <TableCell align="">Phone Number</TableCell>
              <TableCell align="">Numéro de Cart National</TableCell>
              <TableCell align="">Willaya</TableCell>
              <TableCell align="">Ville</TableCell>
              <TableCell align="">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row,index) => (
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
                <TableCell align="">{row.city}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleClickDeleteOpen(index)}
                    variant="contained"
                    color="secondary"
                  >
                    Delete
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
      
      <DialogTitle>{"Confirm Delete"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this client?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeleteClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirmDelete} color="secondary" autoFocus>
          Delete
        </Button>
      </DialogActions>
      </Dialog>


      <Dialog open={openDialog}>
        <DialogTitle>Add New Client</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill out the form to add a new client.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Nom de Client"
            name="name"
            fullWidth
            value={newClient.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="CCP"
            name="ccp"
            fullWidth
            value={newClient.ccp}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Phone Number"
            name="phoneNumber"
            fullWidth
            value={newClient.phoneNumber}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Numéro de Cart National"
            name="numCard"
            fullWidth
            value={newClient.numCard}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Willaya"
            name="willaya"
            fullWidth
            value={newClient.willaya}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Ville"
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
          <Button onClick={handleAddClient} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    
    </>
  );
};

export default Clients;
