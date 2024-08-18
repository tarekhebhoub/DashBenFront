import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getVentes, fetchCustomers } from '../../services/data';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import TablePagination from '@mui/material/TablePagination';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/lab/Autocomplete';

const Ventes = () => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedRows, setPaginatedRows] = useState([]);

  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVentes = async () => {
      const customersData = await fetchCustomers();
      const rowsData = await getVentes();
      setRows(rowsData);
      setCustomers(customersData);

      setFilteredRows(rowsData);
    };

    fetchVentes();
  }, []);

  useEffect(() => {
    // Paginate filtered rows whenever page, rowsPerPage, or filteredRows changes
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    setPaginatedRows(filteredRows.slice(start, end));
  }, [page, rowsPerPage, filteredRows]);

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

  const handleCustomerChange = (event, newValue) => {
    setSelectedCustomer(newValue ? newValue.id : null);
  };

  const handleSalesChange = () => {
    if (!selectedCustomer) {
      alert('Please select a customer first');
      return;
    }

    const filteredVentes = rows.filter((vente) => vente.customer_id === selectedCustomer);
    setFilteredRows(filteredVentes);
    setPage(0); // Reset pagination to the first page
  };

  return (
    <>
      <Box display="flex" alignItems="center" mb={2} mt={2} gap={2}>
        <FormControl sx={{ width: '50%' }}>
          <Autocomplete
            options={customers}
            getOptionLabel={(option) => `${option.name} (${option.ccp})`}
            value={customers.find((customer) => customer.id === selectedCustomer) || null}
            onChange={handleCustomerChange}
            filterOptions={(options, { inputValue }) => {
              return options.filter(
                (option) =>
                  option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                  option.ccp.toString().includes(inputValue)
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Customer"
                variant="outlined"
              />
            )}
          />
        </FormControl>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSalesChange}
            sx={{ ml: 2 }} // Margin left to separate from the Autocomplete field
          >
            البحث
          </Button>
          <Button variant="contained" color="primary" onClick={handleCreateNewItem} sx={{ ml: 2 }}>
            إنشاء فاتورة جديدة
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>الإسم واللقب</TableCell>
              <TableCell align="left">Relevé</TableCell>
              <TableCell align="left">رقم الحساب البريدي</TableCell>
              <TableCell align="left">رقم الهاتف</TableCell>
              <TableCell align="left">تاريخ البيع</TableCell>
              <TableCell align="left">السعر النهائي</TableCell>
              <TableCell align="left">قيمة القسط</TableCell>
              <TableCell align="left">عدد الأقساط</TableCell>
              <TableCell align="left">المبلغ المتبقي</TableCell>
              <TableCell align="left">تاريخ البدأ</TableCell>
              <TableCell align="left">تاريخ الإنتهاء</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.customer_Name}
                </TableCell>
                <TableCell align="left">
                  <a href={`${window.location.href}/${row.id}`} target="_blank" rel="noopener noreferrer">Relevé</a>
                </TableCell>
                <TableCell align="left">{row.customer_CCP}</TableCell>
                <TableCell align="left">0{row.phone}</TableCell>
                <TableCell align="left">{row.created_at}</TableCell>
                <TableCell align="left">{row.prix_Final}</TableCell>
                <TableCell align="left">{row.mententPrelvement}</TableCell>
                <TableCell align="left">{row.installment_period}</TableCell>
                <TableCell align="left">{row.rest}</TableCell>
                <TableCell align="left">{row.date_dub}</TableCell>
                <TableCell align="left">{row.date_fin}</TableCell>
              </TableRow>
            ))}
            {/* Totals Row */}
            <TableRow>
              <TableCell colSpan={4} />
              <TableCell align="left"><strong>Total:</strong></TableCell>
              <TableCell align="left">{totalPrixFinal.toFixed(2)}</TableCell>
              <TableCell colSpan={2} />
              <TableCell align="left">{totalRestAPayer.toFixed(2)}</TableCell>
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
