import styled from 'styled-components';
import UploadSection from './section/UploadSection';
import DirectorySection from './section/DirectorySection';
import { UploadContext } from './uploadContext';
import { useState } from 'react';

const StaticUploadViewModel = () => {
  const [currentDirectory, setCurrentDirectory] = useState('/');
  return (
    <UploadContext.Provider value={{ currentDirectory, setCurrentDirectory }}>
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
