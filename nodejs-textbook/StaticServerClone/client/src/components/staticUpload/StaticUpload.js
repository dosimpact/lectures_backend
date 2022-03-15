import styled from 'styled-components';
import UploadSection from './section/UploadSection';
import DirectorySection from './section/DirectorySection';
import { UploadContext } from './uploadContext';
import { useHistory, useLocation } from 'react-router-dom';
const StaticUploadViewModel = () => {
  // const [currentDirectory, setCurrentDirectory] = useState('/');
  const history = useHistory();
  const location = useLocation();
  const cwd = new URLSearchParams(location.search).get('cwd') || '/';
  const setCurrentDirectory = (cwd) => {
    history.push(`${location.pathname}?cwd=${cwd}`);
  };

  return (
    <UploadContext.Provider
      value={{ currentDirectory: cwd, setCurrentDirectory }}
    >
      <StaticUploadView />
    </UploadContext.Provider>
  );
};

const StaticUploadView = () => {
  return (
    <StaticUploadViewStyled>
      <DirectorySection />
      <UploadSection />
    </StaticUploadViewStyled>
  );
};

const StaticUploadViewStyled = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 5px;
`;

export default StaticUploadViewModel;
