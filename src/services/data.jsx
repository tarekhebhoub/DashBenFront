import axios from 'axios';
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


export const postPaiment = async (data) => {
  try {
    const response = await axios.post(`${url}payments/`, data,config);
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
    console.error('Error creating invoice:', error);
    throw error;
  }
};

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
