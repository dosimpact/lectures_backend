// https://developer.chrome.com/articles/file-system-access/#create-a-new-file
const options = {
  suggestedName: "Untitled Text.txt",
  types: [
    {
      description: "Text documents",
      accept: {
        "text/plain": [".txt"],
      },
    },
  ],
};

const bootstrap = async () => {
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  const fileHandle = await window.showSaveFilePicker(options);

  // Create a FileSystemWritableFileStream to write to.
  const writable = await fileHandle.createWritable();
  // Write the contents of the file to the stream.
  await writable.write("231231231");
  await writable.write("asfdsafdas");
  await sleep(1500);
  // Close the file and write the contents to disk.
  await writable.close();
};

bootstrap();
