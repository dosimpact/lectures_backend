import axios from 'axios';

export const host = process.env.REACT_APP_SERVER_URI || 'http://localhost:4000';

export const hostStaticUrl = `${host}/api/static`;
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
