import { useContext, useState } from 'react';
import styled from 'styled-components';
import {
  useDonwloadFile,
  useFetchDirectory,
  useChangeDirectory,
  UploadContext,
} from '../uploadContext';
import { join } from 'path-browserify';
import { IconDownload } from '../../icons';
import { POST, SERVER_URI_STATIC } from '../../../apis';

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
              <li className="Item fileItem" key={file.name + idx}>
                <div onClick={() => handleDownload(file.name)}>
                  <IconDownload />
                </div>
                <a
                  className="anchor"
                  href={SERVER_URI_STATIC + join(currentDirectory, file.name)}
                >
                  {file.name}
                </a>
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
      color: #361500; //#00c4a7;
      text-decoration: underline;
      cursor: pointer;
      font-size: 20px;
    }
    .directoryItem {
    }
    .fileItem {
      display: flex;
      align-items: center;
      margin: 5px 0px;
      .anchor {
        margin-left: 10px;
      }
    }
  }
`;
