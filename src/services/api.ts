import axios from 'axios';

const api = axios.create({
  baseURL: 'https://nodedeploy.hannahmartin.com.br',
});

export default api;
