import React, { useContext, useEffect, useState, useCallback } from 'react';
import { GET, hostStaticUrl, DownloadDiaglog } from '../../api/apis';
import axios from 'axios';
import { basename, normalize } from 'path-browserify';

console.log('-->', basename('http://localhost:4000/api/static/sample'));

export const UploadContext = React.createContext({
  currentDirectory: '/',
  setCurrentDirectory: () => {},
});

export const useFetchDirectory = () => {
  const { currentDirectory } = useContext(UploadContext);
  const [data, setData] = useState();
  const [dirList, setDirList] = useState([]);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await GET.readDirectory(currentDirectory);
      setData(res.data);
      if (res.data?.ls) {
        const ls = res.data?.ls;
        setDirList(ls.filter((file) => file.isDirectory));
        setFileList(ls.filter((file) => !file.isDirectory));
      }
    };
    fetchData();
    return () => {};
  }, [currentDirectory]);

  return { data, dirList, fileList };
};

export const useSubscribeCurrentDirectory = () => {};

export const useChangeDirectory = () => {
  const { currentDirectory, setCurrentDirectory } = useContext(UploadContext);
  const handleChangeDirectory = useCallback(
    (prefix) => {
      if (!String(prefix).startsWith('/')) {
        prefix = '/' + prefix;
      }
      setCurrentDirectory(currentDirectory + prefix);
    },
    [currentDirectory, setCurrentDirectory],
  );
  return { handleChangeDirectory };
};

export const useDonwloadFile = () => {
  const { currentDirectory, setCurrentDirectory } = useContext(UploadContext);
  const handleDownload = (prefix) => {
    const requestUrl = hostStaticUrl + normalize(currentDirectory + prefix);
    console.log('-->requestUrl', requestUrl);
    DownloadDiaglog(requestUrl);
  };
  return { handleDownload };
};
