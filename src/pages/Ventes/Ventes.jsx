import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getVentes } from '../../services/data';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import TablePagination from '@mui/material/TablePagination';

const Ventes = () => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVentes = async () => {
      const rowsData = await getVentes();
      setRows(rowsData);
      setFilteredRows(rowsData);
    };

    fetchVentes();
  }, []);

  useEffect(() => {
    const filtered = rows.filter(row =>
      String(row.customer_Name)?.toLowerCase().includes(filterQuery.toLowerCase()) ||
      String(row.customer_CCP)?.toLowerCase().includes(filterQuery.toLowerCase())
    );
    setFilteredRows(filtered);
  }, [filterQuery, rows]);

  const handleFilterChange = (event) => {
    setFilterQuery(event.target.value);
  };

  const handleCreateNewItem = () => {
    console.log('Ajouter une Vente');
    navigate('/CreateVente');
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate totals
  const totalPrixFinal = filteredRows.reduce((total, row) => total + (parseFloat(row.prix_Final) || 0), 0);
  const totalRestAPayer = filteredRows.reduce((total, row) => total + (parseFloat(row.rest) || 0), 0);

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
        <Button variant="contained" color="primary" onClick={handleCreateNewItem}>
          Ajouter une Vente
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nom de Client</TableCell>
              <TableCell align="">Relevé</TableCell>
              <TableCell align="">CCP</TableCell>
              <TableCell align="">Date de Vente</TableCell>
              <TableCell align="">Prix Initiale</TableCell>
              <TableCell align="">Prix de Remise</TableCell>
              <TableCell align="">Init Apport</TableCell>
              <TableCell align="">Prix Final</TableCell>
              <TableCell align="">Mentent de prélèvement</TableCell>
              <TableCell align="">Nombre d'échéance</TableCell>
              <TableCell align="">Rest a Payer</TableCell>
              <TableCell align="">Date Debut</TableCell>
              <TableCell align="">Date Fin</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row) => (
              <TableRow
                key={row.customer_Name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.customer_Name}
                </TableCell>
                <TableCell align="">
                  <a href={`${window.location.href}/${row.id}`} target="_blank" rel="noopener noreferrer">Relevé</a>
                </TableCell>
                <TableCell align="">{row.customer_CCP}</TableCell>
                <TableCell align="">{row.created_at}</TableCell>
                <TableCell align="">{row.prix_Vente}</TableCell>
                <TableCell align="">{row.remise}</TableCell>
                <TableCell align="">{row.init_amount}</TableCell>
                <TableCell align="">{row.prix_Final}</TableCell>
                <TableCell align="">{row.mententPrelvement}</TableCell>
                <TableCell align="">{row.installment_period}</TableCell>
                <TableCell align="">{row.rest}</TableCell>
                <TableCell align="">{row.date_dub}</TableCell>
                <TableCell align="">{row.date_fin}</TableCell>
              </TableRow>
            ))}
            {/* Totals Row */}
            <TableRow>
              <TableCell colSpan={6} />
              <TableCell align=""><strong>Total:</strong></TableCell>
              <TableCell align="">{totalPrixFinal.toFixed(2)}</TableCell>
              <TableCell colSpan={2} />
              <TableCell align="">{totalRestAPayer.toFixed(2)}</TableCell>
              <TableCell colSpan={2} />
            </TableRow>
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
    </>
  );
};

export default Ventes;
