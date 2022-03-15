import axios from 'axios';
import { basename } from 'path-browserify';

export const host = process.env.REACT_APP_SERVER_URI || 'http://localhost:4000';

export const hostStaticUrl = `${host}/api/static`;

const fetchBlob = async (url) => {
  return axios({
    url,
    method: 'GET',
    responseType: 'blob',
  });
};

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
  readDirectory: (subDir) => {
    return axios.get(`${host}/api/static/${subDir}`);
  },
};

export const POST = {
  uploadFile: () => {},
  makeDirectory: () => {},
};
export default {
  GET,
  POST,
};
