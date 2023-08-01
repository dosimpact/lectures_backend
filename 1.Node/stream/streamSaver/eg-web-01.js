// https://web.dev/streams/#%EC%93%B0%EA%B8%B0-%EA%B0%80%EB%8A%A5%ED%95%9C-%EC%8A%A4%ED%8A%B8%EB%A6%BC-%EC%BD%94%EB%93%9C-%EC%83%98%ED%94%8C

const bootstrap = async () => {
  const writableStream = new WritableStream({
    start(controller) {
      console.log("[start]");
    },
    async write(chunk, controller) {
      console.log("[write]", chunk);
      // Wait for next write.
      await new Promise((resolve) =>
        setTimeout(() => {
          document.body.textContent += chunk;
          resolve();
        }, 1_000)
      );
    },
    close(controller) {
      console.log("[close]");
    },
    abort(reason) {
      console.log("[abort]", reason);
    },
  });

  const writer = writableStream.getWriter();
  const start = Date.now();
  for (const char of "abcdefghijklmnopqrstuvwxyz") {
    // Wait to add to the write queue.
    await writer.ready;
    console.log("[ready]", Date.now() - start, "ms");
    // The Promise is resolved after the write finishes.
    writer.write(char);
  }
  await writer.close();
};
// bootstrap()
