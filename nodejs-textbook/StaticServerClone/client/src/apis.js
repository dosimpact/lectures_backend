import axios from 'axios';
import { basename, normalize } from 'path-browserify';

const fetchBlob = async (url) => {
  return axios({
    url,
    method: 'GET',
    responseType: 'blob',
  });
};

export const SERVER_URI =
  process.env.REACT_APP_SERVER_URI || 'http://localhost:4000';

export const SERVER_URI_STATIC = `${SERVER_URI}/api/static`;

export const DownloadDiaglog = async (requestUrl) => {
  try {
    const response = await fetchBlob(requestUrl);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', basename(requestUrl));
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error('Fail download as blob', error);
  }
};

export const GET = {
  readDirectory: async (subDir) => {
    console.log('-->subDir', subDir);
    return axios.get(`${SERVER_URI}` + normalize(`/api/static/${subDir}`));
  },
};

export const POST = {
  uploadFile: async (formData, suffix) => {
    const requestUrl = normalize(`/api/static/${suffix}`);
    return axios.post(SERVER_URI + requestUrl, formData, {
      headers: { 'content-type': 'multipart/form-data' },
    });
  },
  makeDirectory: async (subDir) => {
    return axios.post(`${SERVER_URI}` + normalize(`/api/static/${subDir}`));
  },
};
