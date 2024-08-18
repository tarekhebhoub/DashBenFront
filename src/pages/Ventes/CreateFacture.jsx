import React, { useEffect, useState } from 'react';
import { createInvoice, fetchCustomers, fetchProducts } from '../../services/data';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/lab/Autocomplete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';

const CreateFacture = () => {

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0'); // Pad single digit days

    return `${year}-${month}-${day}`;
  }

  const now=new Date()
  const formattedDate = now.toISOString().split('.')[0] + 'Z';
  const [invoiceData, setInvoiceData] = useState({
    customer: '',
    created_at: getCurrentDate(),
    date_dub: '',
    remise: '0.00',
    init_amount: '0.00',
    installment_period: '10', // Default to 10
    products: [],
  });

  const [product, setProduct] = useState({
    product_id: '',
    quantity: '',
    price: '',
    total_price: '',
  });

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersData = await fetchCustomers();
        const productsData = await fetchProducts();
        setCustomers(customersData);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {


    const updatedDate = new Date(invoiceData.created_at);
    updatedDate.setMonth(updatedDate.getMonth() + 1);



    setInvoiceData(prevData => ({
      ...prevData,
      date_dub: updatedDate.toISOString().split('T')[0]
    }));
  }, [invoiceData.created_at]);

  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setInvoiceData(prevData => ({
      ...prevData,
      created_at: date,
    }));
  };

  const handleDateDebChange = (date) => {
    setInvoiceData(prevData => ({
      ...prevData,
      date_dub: date,
    }));
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevProduct => {
      const updatedProduct = { ...prevProduct, [name]: value };
      console.log(name,value)
      if (name === 'product_id') {
        const selectedProduct = products.find(p => p.id === value);
        if (selectedProduct) {
          updatedProduct.price = selectedProduct.price;
        }
      }

      if (name === 'quantity') {
            const selectedProduct = products.find(p => p.id === updatedProduct.product_id);
            if (selectedProduct && value > selectedProduct.quantity) {
                alert(`Quantity exceeds available stock (${selectedProduct.quantity})`);
                return prevProduct; // Return the previous state without updating
            }
        }

      if (name === 'quantity' || name === 'price') {
        const quantity = parseFloat(updatedProduct.quantity) || 0;
        const price = parseFloat(updatedProduct.price) || 0;

        updatedProduct.total_price = (quantity * price).toFixed(2);
        console.log(updatedProduct)

      }
      return updatedProduct;
    });
  };

  const addProduct = () => {
    // console.log(product)
    if (!product.product_id) {
      alert('Please select a product before adding.');
      return;
    }

    setInvoiceData(prevData => ({
      ...prevData,
      products: [...prevData.products, product],
    }));
    

    setProducts(prevProducts => {
        return prevProducts.map(x => {
            if (x.id === product.product_id) {
                return { ...x, quantity: x.quantity - product.quantity };
            }
            return x;
        });
    });


    // Clear product state
    setProduct({
      product_id: '',
      quantity: '', // Set default quantity
      price: '0.00',
      total_price: '0.00',
    });
  };

  const deleteProduct = (index) => {
    setInvoiceData(prevData => ({
      ...prevData,
      products: prevData.products.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    try {

      await createInvoice(invoiceData);
      alert('Invoice created successfully');
      navigate('/Ventes');

    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Error creating invoice');
    }
  };

  const calculateTotalPrice = () => {
    return invoiceData.products.reduce((total, product) => {
      return total + parseFloat(product.total_price || 0);
    }, 0).toFixed(2);
  };

  const getFinalPrice = () => {
    const totalPrice = parseFloat(calculateTotalPrice());
    const initAmount = parseFloat(invoiceData.init_amount || 0);
    const remise = parseFloat(invoiceData.remise || 0);
    return (totalPrice - initAmount - remise).toFixed(2);
  };

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'right' }} >إنشاء فاتورة جديدة</Typography>
      <Paper elevation={3} style={{ padding: '16px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <Autocomplete
                options={customers}
                getOptionLabel={(option) => `${option.name} (${option.ccp})`}
                value={customers.find((customer) => customer.id === invoiceData.customer) || null}
                onChange={(event, newValue) => {
                  handleInvoiceChange({
                    target: { name: 'customer', value: newValue ? newValue.id : '' },
                  });
                }}
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
                    label="الزبون"
                    variant="outlined"
                    
                  />
                )}
              />
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="تاريخ البيع"
                value={invoiceData.created_at}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
                inputFormat="yyyy-MM-dd"
              />
            </LocalizationProvider>
            <TextField
              label="تخفيض"
              name="remise"
              value={invoiceData.remise}
              onChange={handleInvoiceChange}
              fullWidth
              margin="normal"
              type="number"
              InputProps={{ inputProps: { min: 0 } }} // Add min value
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="دفع مقدم"
              name="init_amount"
              value={invoiceData.init_amount}
              onChange={handleInvoiceChange}
              fullWidth
              margin="normal"
              type="number"
              InputProps={{ inputProps: { min: 0 } }} // Add min value
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="تاريخ البدأ"
                value={invoiceData.date_dub}
                onChange={handleDateDebChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
                inputFormat="yyyy-MM-dd"
              />
            </LocalizationProvider>

            <TextField
              label="عدد الأقساط"
              name="installment_period"
              value={invoiceData.installment_period}
              onChange={handleInvoiceChange}
              fullWidth
              margin="normal"
              type="number"
              defaultValue={10}
              InputProps={{ inputProps: { min: 1 } }} // Add min value
            />
          </Grid>
        </Grid>
      </Paper>

      <Box mt={4}  sx={{ textAlign: 'right' }}>
        <Typography variant="h6" gutterBottom sx={{ textAlign: 'right' }}>تفاصيل السلع</Typography>
        <Paper elevation={3} style={{ padding: '16px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="السعر"
                name="price"
                value={product.price}
                fullWidth
                margin="normal"
                type="number"
                step="0.01"
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="الكمية"
                name="quantity"
                value={product.quantity}
                onChange={handleProductChange}
                fullWidth
                margin="normal"
                type="number"
                InputProps={{ inputProps: { min: 1 } }} // Add min value
              />
            </Grid>
            <Grid item xs={12} sm={4}>
          

              <FormControl fullWidth margin="normal">
                <InputLabel>المنتج</InputLabel>
                <Select
                  name="product_id"
                  value={product.product_id}
                  onChange={handleProductChange}
                >
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button  onClick={addProduct} variant="contained" color="primary" style={{ marginTop: '20px' }}>
            إضافة الى السلة
          </Button>
        </Paper>
      </Box>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>السلة</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>إسم المنتج</TableCell>
                <TableCell>الكيمة</TableCell>
                <TableCell>السعر</TableCell>
                <TableCell>السعر الإجمالي</TableCell>
                <TableCell>العمليات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoiceData.products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {products.find(p => p.id === product.product_id)?.name || ''}
                  </TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.total_price}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => deleteProduct(index)}
                      variant="contained"
                      color="secondary"
                    >
                      إزالة
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box mt={2}>
          <Typography variant="h6" sx={{ textAlign: 'right' }} >السعر الإجمالي: {calculateTotalPrice()}</Typography>
          <Typography variant="h6"  sx={{ textAlign: 'right' }} >السعر النهائي: {getFinalPrice()}</Typography>
        </Box>
      </Box>

      <Box mt={4}  sx={{ textAlign: 'right' }}>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          إنشاء الفاتورة
        </Button>
      </Box>
    </Box>
  );
};

export default CreateFacture;
