import { useContext, useMemo, useState } from 'react';
import styled from 'styled-components';
import { POST } from '../../../apis';
import { UploadContext } from '../uploadContext';

const UploadSection = () => {
  const { currentDirectory } = useContext(UploadContext);
  const [files, setFiles] = useState([]);
  const [uploadedResult, setUploadedResult] = useState([]);
  const onChange = async (e) => {
    // const base64 = await fileToBase64(e.target.files[0]);
    const uploadedFiles = e.target.files;
    setFiles(uploadedFiles);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Array.from(files)?.map((file) => formData.append('file', file));
    try {
      const res = await POST.uploadFile(formData, currentDirectory);
      setUploadedResult(res.data);
    } catch (error) {
    } finally {
      setFiles([]);
    }
  };

  const filesMetaInfo = useMemo(() => {
    if (!files) return [];
    return Array.from(files).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }));
  }, [files]);

  return (
    <UploadSectionView
      onChange={onChange}
      onSubmit={onSubmit}
      filesMetaInfo={filesMetaInfo}
      uploadedResult={uploadedResult}
    />
  );
};
export default UploadSection;

const UploadSectionView = ({
  onChange,
  onSubmit,
  filesMetaInfo,
  uploadedResult,
}) => {
  return (
    <UploadSectionViewStyled>
      <h2>Upload Files</h2>
      <form className="uploadFileForm">
        {/* multiple 속성으로 다중 업로드 */}
        <input id="fileInput" type="file" onChange={onChange} multiple></input>
        <label className="uploadBox" htmlFor="fileInput">
          {' '}
          Upload Here{' '}
        </label>
        <button className="submitBtn" onClick={onSubmit}>
          {filesMetaInfo.length}개 업로드
        </button>
        <ul>
          {filesMetaInfo?.map((file) => {
            return <li>{file.name}</li>;
          })}
        </ul>
        <div>
          {uploadedResult.length === 0
            ? ''
            : `${uploadedResult.length}개 업로드 성공`}
        </div>
      </form>
    </UploadSectionViewStyled>
  );
};
const UploadSectionViewStyled = styled.section`
  #fileInput {
    display: none;
  }
  .uploadFileForm {
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
  }
  .uploadBox {
    width: 100%;
    height: 150px;
    border: 4px dashed black;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .submitBtn {
    margin: 10px 0px;
  }
`;
