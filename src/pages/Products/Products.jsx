import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getVentes, fetchProducts, createProduct, updateProduct,deleteProduct } from '../../services/data';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import TablePagination from '@mui/material/TablePagination';

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const Products = () => {
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
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      const rowsData = await fetchProducts();
      setRows(rowsData);
      setFilteredRows(rowsData);
    };

    fetchProduct();
  }, []);

  useEffect(() => {
    const filtered = rows.filter(row =>
      String(row.name)?.toLowerCase().includes(filterQuery.toLowerCase())
    );
    setFilteredRows(filtered);
  }, [filterQuery, rows]);

  const handleFilterChange = (event) => {
    setFilterQuery(event.target.value);
  };

  const handleCreateNewItem = () => {
    setEditMode(false);
    setNewProduct({
      name: '',
      price: '',
      prix_achat: ''
    });
    setOpenDialog(true);
  };

  const handleClickOpenEdit = (id,index) => {

    setSelectedIndex(index)
   

    const item = rows.find(row => row.id === id);
    setNewProduct(item);
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
    setSelectedProduct(rows[index-1]);
    setOpenDeleteDialog(true);
  };

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    prix_achat: '',
    quantity:''
  });

  const handleClose = () => {
    setNewProduct({
      name: '',
      price: '',
      prix_achat: '',
      quantity:''

    });
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddProduct = async () => {
    try {
      const addedProduct = await createProduct(newProduct);
      setRows(prevData => [...prevData, addedProduct]);
      console.log('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
    }

    handleClose();
  };

  const handleEditProduct = async () => {
    try {
      const updatedProduct = await updateProduct(newProduct.id, newProduct);

      setRows(prevData =>
        prevData.map((product, i) =>
          i === selectedIndex ? updatedProduct : product
        )
      );

      console.log('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
    }

    setSelectedIndex(null)
    setNewProduct(null)
    handleClose();
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async() => {
    console.log(selectedProduct)
    await deleteProduct(selectedProduct.id)
    setRows(prevData => prevData.filter((row) => row.id !== selectedProduct.id));
    setOpenDeleteDialog(false);
  };

  // Paginate filtered rows
  const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mt={2}>
        <TextField
          label="يحث"
          variant="outlined"
          value={filterQuery}
          onChange={handleFilterChange}
          sx={{ width: '50%' }}
        />
        <Button variant="contained" color="primary" onClick={handleCreateNewItem}>
          إضافة سلعة جديدة
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>إسم المنتج</TableCell>
              <TableCell align="">الكمية</TableCell>
              <TableCell align="">سعر الشراء</TableCell>

              <TableCell align="">سعر البيع</TableCell>
              <TableCell align="">العمليات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, index) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="">{row.quantity}</TableCell>
                <TableCell align="">{row.prix_achat}</TableCell>
                
                <TableCell align="">{row.price}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleClickOpenEdit(row.id,index)}
                    variant="contained"
                    color="primary"
                  >
                    تعديل
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


  <Dialog open={openDialog}>
    <DialogTitle>{editMode ? "تعديل بيانات المنتح" : "إضافة منتج جديد"}</DialogTitle>
    <DialogContent>
      <DialogContentText>
        {editMode ? "تعديل بيانات المنتج." : "رجاءا قم بملئ بيانات المنتج"}
      </DialogContentText>
      <TextField
        autoFocus
        margin="dense"
        label="إسم المنتج"
        name="name"
        fullWidth
        defaultValue={newProduct.name}
        onChange={handleChange}
      />
      <TextField
        margin="dense"
        label="الكمية"
        name="quantity"
        type="number"
        fullWidth
        defaultValue={newProduct.quantity}
        onChange={handleChange}
      />
      <TextField
        margin="dense"
        label="سعر الشراء"
        name="prix_achat"
        type="number"
        fullWidth
        defaultValue={newProduct.prix_achat}
        onChange={handleChange}
      />
      <TextField
        margin="dense"
        label="نسبة الزيادة"
        name="percentage"
        type="number"
        fullWidth
        defaultValue={newProduct.percentage}
        onChange={(e) => {
          handleChange(e);
          const newPercentage = e.target.value / 100;
          setNewProduct(prevState => ({
            ...prevState,
            price: (prevState.prix_achat * newPercentage).toFixed(2),
          }));
        }}
      />
      <TextField
        margin="dense"
        label="سعر البيع"
        name="price"
        type="number"
        fullWidth
        value={newProduct.price}
        disabled
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">
        إلغاء
      </Button>
      <Button onClick={editMode ? handleEditProduct : handleAddProduct} color="primary">
        {editMode ? "تعديل" : "إضافة"}
      </Button>
    </DialogActions>
</Dialog>




    </>
  );
};

export default Products;
