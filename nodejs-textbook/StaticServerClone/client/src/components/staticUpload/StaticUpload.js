import { useState } from 'react';
import axios from 'axios';
const StaticUploadViewModel = () => {
  return <StaticUploadView />;
};

const fileToBase64 = async (file) =>
  new Promise((res, rej) => {
    let reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      if (base64) res(base64);
      else {
        rej('fail to convert file to base64');
      }
    };
    reader.readAsDataURL(file);
  });

const StaticUploadView = () => {
  const [Base64Imgs, setBase64Imgs] = useState([]);
  const [files, setFiles] = useState(null);
  const onChange = async (e) => {
    // const base64 = await fileToBase64(e.target.files[0]);
    const uploadedFiles = e.target.files;
    const base64Files = await Promise.all(
      Array.from(uploadedFiles)?.map(async (file) => fileToBase64(file)),
    );
    setBase64Imgs(base64Files);
    setFiles(uploadedFiles);
  };
  const onClick = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Array.from(files)?.map((file) => formData.append('file', file));
    try {
      const host = 'http://localhost:4000/static/';
      const res = await axios.post(host, formData, {
        headers: { 'content-type': 'multipart/form-data' },
      });
    } catch (error) {
    } finally {
    }
  };
  return (
    <>
      <h3>Upload Photos Test</h3>
      <form>
        {/* multiple 속성으로 다중 업로드 */}
        <input type="file" onChange={onChange} multiple></input>
        <button onClick={onClick}>제출</button>
      </form>
      <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
        {Base64Imgs &&
          Base64Imgs?.map((imgBase64, idx) => {
            return (
              <img
                width={'100px'}
                key={idx}
                src={imgBase64}
                alt="preview"
              ></img>
            );
          })}
      </div>
    </>
  );
};

export default StaticUploadViewModel;
