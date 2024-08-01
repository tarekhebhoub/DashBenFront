import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getInvoiceById, postPaiment } from '../../services/data';
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

const VenteDetails = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [formData, setFormData] = useState({
    datePaiement: new Date(),
    prixPaiement: '',
  });

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
      await postPaiment(data);
      console.log('Data sent successfully');
    } catch (error) {
      console.error('Error sending data:', error);
    }
    setOpen(false);
    setSelectedInstallment(null);
  };

  const handlePrint = () => {
  const element = document.getElementById('printableArea');
  const options = {
    margin: [10, 10, 10, 10], // [top, left, bottom, right] margins in mm
    filename: 'invoice.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().from(element).set(options).save();
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

  return (
    <Box p={2}>
      <Box mb={4} id="printableArea">
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
        <Button variant="contained" color="primary" onClick={handlePrint}>
          Imprimer
        </Button>
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
      
      <Dialog open={open}>
        <DialogTitle>Payment Details</DialogTitle>
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
            Annuler
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VenteDetails;
