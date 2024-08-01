import axios from 'axios';

export const login = (username,password) => {
  const url = process.env.REACT_APP_API_URL;
  
  const data1={
    username: username,
    password: password,
  };
  const config = {
    headers: {
     
    }
  }
  console.log(data1)
  axios.post(url+'api-token-auth/',data1)
    .then((res) => {
      console.log(res)
      localStorage.setItem('token',res.data.token)
      return res.data
  })
  .catch((e) => {
    alert('Invalid credentials');
  });
};

