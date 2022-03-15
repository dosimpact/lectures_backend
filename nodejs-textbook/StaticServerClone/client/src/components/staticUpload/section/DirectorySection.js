import { useContext, useEffect } from 'react';
import styled from 'styled-components';
import {
  useDonwloadFile,
  useFetchDirectory,
  useChangeDirectory,
} from '../uploadContext';
import axios from 'axios';

const DirectorySection = () => {
  const { dirList, fileList } = useFetchDirectory();
  const { handleChangeDirectory } = useChangeDirectory();
  const { handleDownload } = useDonwloadFile();
  // console.log('-->', dirList, fileList);
  return (
    <DirectorySectionView
      dirList={dirList}
      fileList={fileList}
      handleChangeDirectory={handleChangeDirectory}
      handleDownload={handleDownload}
    />
  );
};

export default DirectorySection;

const DirectorySectionView = ({
  dirList,
  fileList,
  handleChangeDirectory,
  handleDownload,
}) => {
  return (
    <DirectorySectionViewStyled>
      <h2>DirectorySection</h2>
      <div className="utilIcons"></div>
      <div className="directoryRoutes"></div>
      <div className="currentDirectory">
        <ul className="directoryList">
          {dirList.map((dir, idx) => {
            return (
              <li
                className="directoryItem"
                key={dir.name + idx}
                onClick={() => handleChangeDirectory(dir.name)}
              >
                <div href="">/{dir.name}</div>
              </li>
            );
          })}
        </ul>
        <ul className="fileList">
          {fileList.map((file, idx) => {
            return (
              <li
                className="fileItem"
                key={file.name + idx}
                onClick={() => handleDownload(file.name)}
              >
                <div href="">[File] {file.name}</div>
              </li>
            );
          })}
        </ul>
      </div>
    </DirectorySectionViewStyled>
  );
};

const DirectorySectionViewStyled = styled.section`
  .utilIcons {
  }
  .directoryRoutes {
  }
  .currentDirectory {
    .directoryList {
      margin: 0;
    }
    .fileList {
      margin: 0;
    }
    .directoryItem {
      color: blue;
      text-decoration: underline;
      cursor: pointer;
    }
    .fileItem {
      color: blue;
      text-decoration: underline;
      cursor: pointer;
    }
  }
`;
