const os = require("os");

console.log("운영체제 정보---------------------------------");
console.log("os.arch():", os.arch()); // arm64
console.log("os.platform():", os.platform()); // linux
console.log("os.type():", os.type()); // Linux
console.log("os.uptime():", os.uptime()); // 1743104.09
console.log("os.hostname():", os.hostname()); // ubuntu
console.log("os.release():", os.release());

console.log("경로------------------------------------------");
console.log("os.homedir():", os.homedir()); // /home/ubuntu
console.log("os.tmpdir():", os.tmpdir()); // /tmp

console.log("cpu 정보--------------------------------------");
console.log("os.cpus():", os.cpus());
console.log("os.cpus().length:", os.cpus().length); // 4

console.log("메모리 정보-----------------------------------");
console.log("os.freemem():", os.freemem()); // os.freemem(): 2517213184
console.log("os.totalmem():", os.totalmem()); // os.totalmem(): 8190713856
