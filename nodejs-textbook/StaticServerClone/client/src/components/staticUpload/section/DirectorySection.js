import styled from 'styled-components';

const DirectorySection = () => {
  return <DirectorySectionView />;
};

export default DirectorySection;

const DirectorySectionView = () => {
  return (
    <DirectorySectionViewStyled>
      <div className="utilIcons"></div>
      <div className="directoryRoutes"></div>
      <div className="currentDirectory"></div>
    </DirectorySectionViewStyled>
  );
};

const DirectorySectionViewStyled = styled.section`
  .utilIcons {
  }
  .directoryRoutes {
  }
  .currentDirectory {
  }
`;
