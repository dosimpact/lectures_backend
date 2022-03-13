import { useContext, useEffect } from 'react';
import styled from 'styled-components';
import {
  useDonwloadFile,
  useFetchDirectory,
  useChangeDirectory,
} from '../uploadContext';

const DirectorySection = () => {
  const { dirList, fileList } = useFetchDirectory();
  const { handleChangeDirectory } = useChangeDirectory();
  const { handleDownload } = useDonwloadFile();
  console.log('-->', dirList, fileList);
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
        <a href="http://localhost:4000/api/static/007070.jpg" target="_blank">
          http://localhost:4000/api/static/007070.jpg
        </a>
        <ul>
          {dirList.map((dir, idx) => {
            return (
              <li
                className="dirList"
                key={dir.name + idx}
                onClick={() => handleChangeDirectory(dir.name)}
              >
                <div href="">/{dir.name}</div>
              </li>
            );
          })}
        </ul>
        <ul>
          {fileList.map((file, idx) => {
            return (
              <li
                className="fileList"
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
    .dirList {
      color: blue;
      text-decoration: underline;
      cursor: pointer;
    }
    .fileList {
      color: blue;
      text-decoration: underline;
      cursor: pointer;
    }
  }
`;
