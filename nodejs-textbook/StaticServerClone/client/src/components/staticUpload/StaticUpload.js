import styled from 'styled-components';
import UploadSection from './section/UploadSection';
import DirectorySection from './section/DirectorySection';

const StaticUploadViewModel = () => {
  return <StaticUploadView />;
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
