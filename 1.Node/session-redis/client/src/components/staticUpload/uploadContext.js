import React, { useContext, useEffect, useState, useCallback } from 'react';
import { GET, SERVER_URI_STATIC, DownloadDiaglog } from '../../apis';
import { normalize, join } from 'path-browserify';

export const UploadContext = React.createContext({
  currentDirectory: '/',
  setCurrentDirectory: () => {},
});

export const useFetchDirectory = () => {
  const { currentDirectory } = useContext(UploadContext);
  const [data, setData] = useState();
  const [dirList, setDirList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const fetchData = useCallback(async () => {
    const res = await GET.readDirectory(currentDirectory);
    setData(res.data);
    if (res.data?.ls) {
      const ls = res.data?.ls;
      setDirList(ls.filter((file) => file.isDirectory));
      setFileList(ls.filter((file) => !file.isDirectory));
    }
  }, [currentDirectory]);
  useEffect(() => {
    fetchData();
    return () => {};
  }, [fetchData]);

  return { data, dirList, fileList, fetchData };
};

export const useSubscribeCurrentDirectory = () => {};

export const useChangeDirectory = () => {
  const { currentDirectory, setCurrentDirectory } = useContext(UploadContext);
  const handleChangeDirectory = useCallback(
    (suffix) => {
      setCurrentDirectory(join(currentDirectory, suffix));
    },
    [currentDirectory, setCurrentDirectory],
  );
  return { handleChangeDirectory };
};

export const useDonwloadFile = () => {
  const { currentDirectory } = useContext(UploadContext);
  const handleDownload = (suffix) => {
    const requestUrl =
      SERVER_URI_STATIC + normalize(join(currentDirectory, suffix));
    DownloadDiaglog(requestUrl);
  };
  return { handleDownload };
};
