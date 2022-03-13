import React, { useContext, useEffect, useState, useCallback } from 'react';
import { GET, hostStaticUrl } from '../../api/apis';

export const UploadContext = React.createContext({
  currentDirectory: '/',
  setCurrentDirectory: () => {},
});

const normalizeUrl = (str) => String(str).replace(/[/]{2,}/g, '/');

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

export const useChangeDirectory = () => {
  const { currentDirectory, setCurrentDirectory } = useContext(UploadContext);
  const handleChangeDirectory = useCallback(
    (prefix) => {
      if (!String(prefix).startsWith('/')) {
        prefix = '/' + prefix;
      }
      setCurrentDirectory(currentDirectory + prefix);
    },
    [currentDirectory],
  );
  return { handleChangeDirectory };
};
export const useDonwloadFile = () => {
  const { currentDirectory, setCurrentDirectory } = useContext(UploadContext);
  const handleDownload = (prefix) => {
    const aTag = document.createElement('a');
    const href = hostStaticUrl + normalizeUrl(currentDirectory + prefix);
    console.log('-->href', href);
    aTag.href = hostStaticUrl + currentDirectory + prefix;
    aTag.style = 'display:none';
    aTag.download = hostStaticUrl + currentDirectory + prefix;
    document.body.appendChild(aTag);
    aTag.click();
    document.body.removeChild(aTag);
  };
  return { handleDownload };
};
