const axios = require('axios');

const templateURL = 'http://127.0.0.1:8000/api/text/';

const getTemplateData = async () => {
  const templateData = await axios.get(templateURL);
  console.log(templateData);
};

document.addEventListener('DOMContentLoaded', () => {
  getTemplateData();
});
