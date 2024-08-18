import axios from 'axios';
import { saveAs } from 'file-saver';

const url = process.env.REACT_APP_API_URL;
const token=localStorage.getItem('token')
const config = {
    headers: {
    	'Authorization': `Token ${token}`,
    }
}


export const getVentes = async () => {
    try {
        const res = await axios.get(`${url}getVentes/`, config);
        return res.data;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const getInvoiceById=async(id)=>{
	try{
		const res=await axios.get(`${url}getVenteDetails/${id}/`, config)
		return res.data
	}catch(e){
		console.log(e.data)
		return null
	}
}


export const postPaiment = async (data,id) => {
  try {
    const response = await axios.put(`${url}payments/${id}/`, data,config);
    return response.data;
  } catch (error) {
    console.error('Error sending data:', error);
    throw error;
  }
};


// services/data.js


export const createInvoice = async (data) => {
  try {
  	console.log(data)
    const response = await axios.post(`${url}createInvoice/`, data,config);
    return response.data;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};






export const CreateClient = async (data) => {
  try {
  	console.log(data)
    const response = await axios.post(`${url}customers/`, data,config);
    return response.data;
  } catch (error) {
    console.error('Error creating invoice:', error.data);
    throw error;
  }
};



export const updateClient = async (id, data) => {
  try {
    console.log('Updating client:', id, data);
    const response = await axios.put(`${url}customers/${id}/`, data, config);
    return response.data;
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
};

export const deleteClient=async(id)=>{
	try{
		const response=await axios.delete(`${url}customers/${id}/`,config);
		return response.data;
	}catch(error){
		console.log(error)
		throw error;
	}
}

export const fetchCustomers = async () => {
  try {
    const response = await axios.get(`${url}customers/`,config);
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${url}products/`,config);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};


export const createProduct=async(data)=>{
	try {
		console.log(data)
	    const response = await axios.post(`${url}products/`,data,config);
	    return response.data;
	  } catch (error) {
	    console.error('Error fetching products:', error);
	    throw error;
	}
}
export const updateProduct=async(id,data)=>{
	try {
	    const response = await axios.put(`${url}products/${id}/`,data,config);
	    return response.data;
	  } catch (error) {
	    console.error('Error fetching products:', error);
	    throw error;
	}
}

export const deleteProduct=async(idProduct)=>{
	try {
	    const response = await axios.delete(`${url}products/${idProduct}/`,config);
	    return response.data;
	  } catch (error) {
	    console.error('Error delete products:', error);
	    throw error;
	}
}







export const deleteInvoice = async (invoiceId) => {
  try {
    const response = await axios.delete(`${url}invoices/${invoiceId}/`,config);
    return response.data;
  } catch (error) {
    throw new Error('Error deleting the invoice');
  }
};


export const fetchDashboardData=async()=>{
	try {
	    const response = await axios.get(`${url}dashboardData/`,config);
	    console.log(response.data)
	    return response.data;
	} catch (error) {
	    throw new Error('Error fetching Data');
	  }
}


export const handleDownloadPDF = async(data) => {
  try {
    const response = await axios.get(`${url}getFileData/`, { // Adjust the URL to your Django view
      responseType: 'blob', // Important to handle the file response
      params: data,  // Send data as query parameters
      ...config,
    });

    // Create a Blob from the response
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Use FileSaver to download the file
    saveAs(blob, 'clients_with_rest.xlsx');
  } catch (error) {
    console.error('Error downloading the Excel file:', error);
  }
};


export const handleDownloadPDF1 = async() => {
  try {
    const response = await axios.get(`${url}ventes-en-cours/`, { // Adjust the URL to your Django view
      responseType: 'blob', // Important to handle the file respons
      ...config,
    });

    // Create a Blob from the response
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Use FileSaver to download the file
    saveAs(blob, 'clients_with_rest.xlsx');
  } catch (error) {
    console.error('Error downloading the Excel file:', error);
  }
};



