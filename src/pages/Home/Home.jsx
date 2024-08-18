import React, { useState,useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControlLabel, Checkbox } from '@mui/material';
import { fetchDashboardData, handleDownloadPDF, handleDownloadPDF1 } from '../../services/data'; // Adjust this import based on where you fetch your data
import { Download } from '@mui/icons-material';

const Home = () => {
  const [data, setData] = useState({
    numClents: 0,
    numVentes: 0,
    restAPayer: 0,
    mentantPayed: 0,
  });
  const [open, setOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDashboardData(); // Replace with your API call
        setData(response);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  

  const handleDownload1=async()=>{
    await handleDownloadPDF1();
  }


  const handleDownload =async () => {

    const data={
      'dateFrom':dateFrom,
      'dateTo':dateTo
    }
    // Your logic to handle the download based on the date range or selecting all
    await handleDownloadPDF(data);
    handleClose();
  };
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                عدد الزبائن
              </Typography>
              <Typography variant="h4" component="div">
                {data?.numClients}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                عدد البيعات
              </Typography>
              <Typography variant="h4" component="div">
                {data?.numVentes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                قيمة الأموال الغير مدفوعة
              </Typography>
              <Typography variant="h4" component="div">
                {data?.restAPayer.toFixed(2)} DZD
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                قيمة الأموال المدفوعة
              </Typography>
              <Typography variant="h4" component="div">
                {data?.mentantPayed.toFixed(2)} DZD
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} mt={2} justifyContent="center">
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpen}
            startIcon={<Download />}
            style={{ minWidth: '200px' }}
          >
            تحميل قائمة المبيعات الغير منتهية من إلى
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDownload1}
            startIcon={<Download />}
            style={{ minWidth: '200px', marginLeft: '16px' }}
          >
            تحميل قائمة المبيعات الغير منتهية
          </Button>
        </Grid>
      </Grid>


      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>اختر نطاق التواريخ</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="التاريخ من (عدد الأيام)"
            type="number"
            fullWidth
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            disabled={selectAll}
          />
          <TextField
            margin="dense"
            label="التاريخ إلى (عدد الأيام)"
            type="number"
            fullWidth
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            disabled={selectAll}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            إلغاء
          </Button>
          <Button onClick={handleDownload} color="primary">
            تحميل
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Home;