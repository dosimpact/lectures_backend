import { useContext, useState } from 'react';
import styled from 'styled-components';
import {
  useDonwloadFile,
  useFetchDirectory,
  useChangeDirectory,
  UploadContext,
} from '../uploadContext';
import { POST } from '../../../api/apis';
import { join } from 'path-browserify';

const useMkdir = () => {
  const { fetchData } = useFetchDirectory();
  const { currentDirectory } = useContext(UploadContext);
  const [inputDir, setInputDir] = useState('');
  const handleMkdir = async () => {
    if (inputDir) {
      try {
        await POST.makeDirectory(join(currentDirectory, inputDir));
        setTimeout(fetchData, 100);
      } catch (error) {}
      setInputDir('');
    }
  };
  return { inputDir, setInputDir, handleMkdir };
};

const DirectorySection = () => {
  const { dirList, fileList, fetchData: fetchDir } = useFetchDirectory();
  const { handleChangeDirectory } = useChangeDirectory();
  const { handleDownload } = useDonwloadFile();
  const { currentDirectory } = useContext(UploadContext);
  const { handleMkdir, inputDir, setInputDir } = useMkdir();
  return (
    <DirectorySectionView
      dirList={dirList}
      fileList={fileList}
      currentDirectory={currentDirectory}
      inputDir={inputDir}
      handleChangeDirectory={handleChangeDirectory}
      handleDownload={handleDownload}
      handleMkdir={handleMkdir}
      fetchDir={fetchDir}
      setInputDir={setInputDir}
    />
  );
};

export default DirectorySection;

const DirectorySectionView = ({
  dirList,
  fileList,
  currentDirectory,
  handleChangeDirectory,
  handleDownload,
  handleMkdir,
  inputDir,
  setInputDir,
  fetchDir,
}) => {
  return (
    <DirectorySectionViewStyled>
      <h2>DirectorySection</h2>
      <div className="utilIcons">
        <ul>
          <li className="addFolder">
            <input
              type="text"
              value={inputDir}
              onChange={(e) => {
                setInputDir(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleMkdir();
              }}
            ></input>
            <button onClick={handleMkdir}>ADD Folder</button>
          </li>
          <li className="refresh">
            <button onClick={fetchDir}>refresh</button>
          </li>
        </ul>
      </div>
      <div className="directoryRoutes"> Path : {currentDirectory}</div>
      <div className="currentDirectory">
        <ul className="directoryList">
          {dirList.map((dir, idx) => {
            return (
              <li
                className="Item directoryItem"
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
                className="Item fileItem"
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
    margin-bottom: 10px;
  }
  .currentDirectory {
    .directoryList {
      margin: 0;
    }
    .fileList {
      margin: 0;
    }
    .Item {
      color: blue;
      text-decoration: underline;
      cursor: pointer;
      font-size: 20px;
    }
    .directoryItem {
    }
    .fileItem {
    }
  }
`;
