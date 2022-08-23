const fs = require('fs');

const deployed = (contractName, artifact) => {
  
  if (artifact?._json) {
    let path = `deployed/${contractName}_ABI`;
    
    fs.writeFile(path,JSON.stringify(artifact?._json?.abi),
      (err) => {
        if (err) throw err;
        console.log(`✔️ output : ${path}`);
      },
    );

    path = `client/public/${contractName}_ABI`;
    fs.writeFile(path,JSON.stringify(artifact?._json?.abi),
      (err) => {
        if (err) throw err;
        console.log(`✔️ output : ${path}`);
      },
    );
  }

  let path = `deployed/${contractName}_Address`;

  fs.writeFile(path, artifact?.address, (err) => {
    if (err) throw err;
    console.log(`✔️ output : ${path}`);
  });

  path = `client/public/${contractName}_Address`;
  fs.writeFile(path, artifact?.address, (err) => {
    if (err) throw err;
    console.log(`✔️ output : ${path}`);
  });
};

module.exports = {
  deployed
};
