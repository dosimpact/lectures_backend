import styled from 'styled-components';
import UploadSection from './section/UploadSection';
import DirectorySection from './section/DirectorySection';
import { UploadContext } from './uploadContext';

const StaticUploadViewModel = () => {
  return <StaticUploadView />;
};

const StaticUploadView = () => {
  return (
    <UploadContext.Provider value={{ currentDirectory: '/' }}>
      <StaticUploadViewStyled>
        <DirectorySection />
        <UploadSection />
      </StaticUploadViewStyled>
    </UploadContext.Provider>
  );
};

const StaticUploadViewStyled = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 5px;
`;

export default StaticUploadViewModel;
