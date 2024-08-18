import React, { useEffect, useState } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { getInvoiceById, postPaiment, deleteInvoice } from '../../services/data';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import html2pdf from 'html2pdf.js';
import { Divider } from '@mui/material';


// Create styles for print


const VenteDetails = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [formData, setFormData] = useState({
    datePaiement: new Date(),
    prixPaiement: '',
  });

  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const [printOpen, setPrintOpen] = useState(false);


  const navigate = useNavigate();




  useEffect(() => {
    const fetchInvoice = async () => {
      const invoiceData = await getInvoiceById(id);
      setInvoice(invoiceData);
    };

    fetchInvoice();
  }, [id]);

  if (!invoice) {
    return <Typography>Loading...</Typography>;
  }

  const handleInputChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      prixPaiement: value,
    }));
  };

  const handleDateChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClickOpen = (installment) => {
    setSelectedInstallment(installment);
    setFormData((prevData) => ({
      ...prevData,
      datePaiement: installment.dateVente,
      prixPaiement: installment.mententPrelvement,
    }));
    setOpen(true);
  };

  const handleAnnuler = () => {
    setOpen(false);
    setSelectedInstallment(null);
  };

  const handleSubmit = async () => {
    const data = {
      invoice: selectedInstallment.invoice,
      payment_date: formData.datePaiement,
      amount: formData.prixPaiement,
    };
    try {
      await postPaiment(data,selectedInstallment.id);
      
      setPrintOpen(true);

     // window.location.reload();

      console.log('Data sent successfully');
    } catch (error) {
      console.error('Error sending data:', error);
    }
    setOpen(false);
    setSelectedInstallment(null);

    
  };

  const handlePrint = () => {
    const element = document.getElementById('printableArea1');
    element.style.display = 'block';
    const options = {
      margin: [10, 10, 10, 10],
      filename: 'invoice.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().from(element).set(options).save().then(() => {
    // Revert element to its original display state
      element.style.display = 'none';
  });
  };

const handlePrintBonDeCommande = () => {
  const element = document.getElementById('bonDeCommandeArea');
  
  // Ensure element is visible
  element.style.display = 'block';

  const options = {
    margin: [10, 10, 10, 10],
    filename: 'bon_de_commande.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };

  html2pdf().from(element).set(options).save().then(() => {
    // Revert element to its original display state
    element.style.display = 'none';
  });
};


  const handleDeleteVente = async () => {
    const userConfirmed = window.confirm('Are you sure you want to delete this vente?');

    if (!userConfirmed) {
      return; // Exit the function if the user cancels the action
    }


    try {
      await deleteInvoice(id);
      console.log('Vente deleted successfully');
      navigate('/Ventes');
 // Navigate to another page after deletion
    } catch (error) {
      console.error('Error deleting vente:', error);
    }
  };

  const getRowStyle = (mententPrelvement, amount) => {
    if (parseFloat(mententPrelvement) === parseFloat(amount)) {
      return { backgroundColor: 'lightgreen' };
    } else if (amount !== null && amount !== '' && parseFloat(amount) < parseFloat(mententPrelvement)) {
      return { backgroundColor: 'orange' };
    } else {
      return {};
    }
  };


  const handlePaymentReceipt=()=>{
    const element = document.getElementById('paymentReceipt');
  
    // Ensure element is visible
    element.style.display = 'block';

    const options = {
      margin: [10, 10, 10, 10],
      filename: 'payment_receipt.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().from(element).set(options).save().then(() => {
      // Revert element to its original display state
      element.style.display = 'none';
      // Close the print dialog if it's open
      setPrintOpen(false);
      
      // Refresh the page
      window.location.reload();

    });
    // window.location.reload();
   // setPrintOpen(false);

  }

  const handlePrintClose = () => {
    setPrintOpen(false);
    window.location.reload();
  };

  return (
    <Box p={2}>
      <Box mb={4} id="printableArea">
        <Typography variant="h5" gutterBottom  sx={{ textAlign: 'right' }} >تفاصيل الفاتورة</Typography>
        <br />

        <Paper elevation={3} sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>

              <Typography variant="h6" sx={{ textAlign: 'right' }}>
                السعر النهائي: {invoice.prix_Final}
              </Typography>
              <Typography variant="h6" sx={{ textAlign: 'right' }}>
                قيمة القسط: {invoice.mententPrelvement}
              </Typography>
              <Typography variant="h6" sx={{ textAlign: 'right' }}>
                عدد الأقساط: {invoice.installment_period}
              </Typography>
              <Typography variant="h6" sx={{ textAlign: 'right' }}>
                المبلغ المتبقي: {invoice.rest}
              </Typography>
              <Typography variant="h6" sx={{ textAlign: 'right' }}>
                تاريخ البدأ: {invoice.date_dub}
              </Typography>
              <Typography variant="h6" sx={{ textAlign: 'right' }}>
                تاريخ الإنتهاء: {invoice.date_fin}
              </Typography>


            </Grid>
            <Grid item xs={12} sm={6}>

            <Typography variant="h6" sx={{ textAlign: 'right' }}>
                الإسم واللقب: {invoice.customer_Name}
              </Typography>
              <Typography variant="h6" sx={{ textAlign: 'right' }}>
                رقم الحساب البريدي: {invoice.customer_CCP}
              </Typography>
              <Typography variant="h6" sx={{ textAlign: 'right' }}>
                تاريخ البيع: {invoice.created_at}
              </Typography>
              <Typography variant="h6" sx={{ textAlign: 'right' }}>
                السعر الأولي: {invoice.prix_Vente}
              </Typography>
              <Typography variant="h6" sx={{ textAlign: 'right' }}>
                الخصم: {invoice.remise}
              </Typography>
              <Typography variant="h6" sx={{ textAlign: 'right' }}>
                الدفع المسبق: {invoice.init_amount}
              </Typography>





              
            </Grid>
          </Grid>
        </Paper>


        <br /> 
         <Typography variant="h5" gutterBottom  sx={{ textAlign: 'right' }} >تفاصيل السلع</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>إسم المنتج</TableCell>
                  <TableCell>الكمية</TableCell>
                  <TableCell>السعر</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoice.products && invoice.products.length > 0 ? (
                  invoice.products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.product_name}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.total_price}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3}>لا يوجد أي منتجات</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <br />

        <Button variant="contained" color="primary" onClick={handlePrint}>
          طباعة
        </Button>
        <Button variant="contained" color="secondary" onClick={handlePrintBonDeCommande} style={{ marginLeft: 10 }}>
          طباعة وصل البيع
        </Button>
        <Button variant="contained" color="error" onClick={handleDeleteVente} style={{ marginLeft: 10 }}>
          حذف الفاتورة
        </Button>

        
        <Typography variant="h5" gutterBottom  sx={{ textAlign: 'right' }} >الأقساط</Typography>
        
        <br /><br />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>تاريخ دفع القسط</TableCell>
                <TableCell>قيمة القسط</TableCell>
                <TableCell>تاريخ الدفع</TableCell>
                <TableCell>القيمة المدفوعة</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoice.installments?.map((installment) => (
                <TableRow
                  key={installment.id}
                  onClick={() => handleClickOpen(installment)}
                  style={getRowStyle(installment.mententPrelvement, installment.amount)}
                >
                  <TableCell>{installment.dateVente}</TableCell>
                  <TableCell>{installment.mententPrelvement}</TableCell>
                  <TableCell>{installment.payment_date}</TableCell>
                  <TableCell>{installment.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      
      <Dialog open={open}>
        <DialogTitle>تفاصيل الدفع</DialogTitle>
        <DialogContent>
          {selectedInstallment && (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TextField
                label="Montant de Prélèvement"
                name="montantPrelevement"
                value={selectedInstallment.mententPrelvement}
                fullWidth
                margin="normal"
                type="number"
                disabled
              />
              <DatePicker
                label="Date de Paiement"
                value={formData.datePaiement}
                onChange={(date) => handleDateChange('datePaiement', date)}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                inputFormat="yyyy-MM-dd"
              />
              <TextField
                label="Prix de Paiement"
                name="prixPaiement"
                onChange={handleInputChange}
                value={formData.prixPaiement}
                fullWidth
                margin="normal"
                type="number"
                inputProps={{ inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]{0,2}' }}
              />
            </LocalizationProvider>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAnnuler} color="primary">
            الغاء
          </Button>
          <Button onClick={handleSubmit} color="primary">
            تأكيد
          </Button>
        </DialogActions>
      </Dialog>





     <Box 
        mb={4} 
        id="printableArea1"
        sx={{
        display: 'none', // Hide content by default
        '@media print': {
          display: 'block', // Show content when printing
        },
        }}>
        <Typography variant="h5" gutterBottom>Invoice Details</Typography>
        <br />
        <Paper elevation={3} p={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Nom de Client: {invoice.customer_Name}</Typography>
              <Typography variant="h6">CCP: {invoice.customer_CCP}</Typography>
              <Typography variant="h6">Date de Vente: {invoice.created_at}</Typography>
              <Typography variant="h6">Prix Initiale: {invoice.prix_Vente}</Typography>
              <Typography variant="h6">Prix de Remise: {invoice.remise}</Typography>
              <Typography variant="h6">Init Apport: {invoice.init_amount}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Prix Final: {invoice.prix_Final}</Typography>
              <Typography variant="h6">Mentent de prélèvement: {invoice.mententPrelvement}</Typography>
              <Typography variant="h6">Nombre d'échéance: {invoice.installment_period}</Typography>
              <Typography variant="h6">Rest a Payer: {invoice.rest}</Typography>
              <Typography variant="h6">Date Debut: {invoice.date_dub}</Typography>
              <Typography variant="h6">Date Fin: {invoice.date_fin}</Typography>
            </Grid>
          </Grid>
        </Paper>
        <br />
         <Typography variant="h5" gutterBottom>Product Details</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Quantité</TableCell>
                  <TableCell>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoice.products && invoice.products.length > 0 ? (
                  invoice.products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.product_name}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.total_price}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3}>No product details available.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <br />

        
        <Typography variant="h5" gutterBottom>Les Prélèvements</Typography>
        

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date de Prélèvement</TableCell>
                <TableCell>Mentent de Prélèvement</TableCell>
                <TableCell>Date de Paiement</TableCell>
                <TableCell>Prix de Paiement</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoice.installments?.map((installment) => (
                <TableRow
                  key={installment.id}
                  onClick={() => handleClickOpen(installment)}
                  style={getRowStyle(installment.mententPrelvement, installment.amount)}
                >
                  <TableCell>{installment.dateVente}</TableCell>
                  <TableCell>{installment.mententPrelvement}</TableCell>
                  <TableCell>{installment.payment_date}</TableCell>
                  <TableCell>{installment.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>



      <Box 
        id="bonDeCommandeArea"
        sx={{
        display: 'none', // Hide content by default
        '@media print': {
          display: 'block', // Show content when printing
        },
      }}>

          <Typography variant="h5" gutterBottom>Bon de Commande</Typography>
          <Paper elevation={3} p={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Nom de Client: {invoice.customer_Name}</Typography>
                <Typography variant="h6">CCP: {invoice.customer_CCP}</Typography>
                <Typography variant="h6">Date de Vente: {invoice.created_at}</Typography>
                <Typography variant="h6">Prix Initiale: {invoice.prix_Vente}</Typography>
                <Typography variant="h6">Prix de Remise: {invoice.remise}</Typography>
                <Typography variant="h6">Init Apport: {invoice.init_amount}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Prix Final: {invoice.prix_Final}</Typography>
                <Typography variant="h6">Mentent de prélèvement: {invoice.mententPrelvement}</Typography>
                <Typography variant="h6">Nombre d'échéance: {invoice.installment_period}</Typography>
                <Typography variant="h6">Rest a Payer: {invoice.rest}</Typography>
                <Typography variant="h6">Date Debut: {invoice.date_dub}</Typography>
                <Typography variant="h6">Date Fin: {invoice.date_fin}</Typography>
              </Grid>
            </Grid>
          </Paper>
          <br />

          <Typography variant="h5" gutterBottom>Product Details</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Quantité</TableCell>
                  <TableCell>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoice.products && invoice.products.length > 0 ? (
                  invoice.products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.product_name}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.total_price}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3}>No product details available.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <br />
        </Box>

        <Dialog open={printOpen} onClose={handlePrintClose}>
          <DialogTitle align='center'>طباعة وصل الدفع</DialogTitle>
          <DialogContent>
            {/* Content for the receipt preview */}
            <p>هل تريد طباعة وصل الدفع</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePrintClose} color="primary">
              إلغاء
            </Button>
            <Button onClick={handlePaymentReceipt} color="primary">
              طباعة
            </Button>
          </DialogActions>
        </Dialog>




      <Box 
        id="paymentReceipt"
        sx={{
        display: 'none', // Hide content by default
        '@media print': {
          display: 'block', // Show content when printing
        },
      }}>
      <Paper elevation={3} sx={{ padding: 3, marginTop: 5 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Payment Receipt
        </Typography>
        
        <Divider sx={{ marginY: 2 }} />

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h6">Nom & Prénom:</Typography>
          <Typography variant="body1">{invoice.customer_Name}</Typography>
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h6">CCP:</Typography>
          <Typography variant="body1">{invoice.customer_CCP}</Typography>
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h6">Payment Amount:</Typography>
          <Typography variant="body1">{formData.prixPaiement} DZD</Typography>
        </Box>

        <Divider sx={{ marginY: 2 }} />

        <Typography variant="body2" align="center" color="textSecondary">
          Thank you for your payment!
        </Typography>
      </Paper>
    </Box>



    </Box>
  );
};

export default VenteDetails;


