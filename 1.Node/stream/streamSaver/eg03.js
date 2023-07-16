// https://web.dev/streams/#%EC%93%B0%EA%B8%B0-%EA%B0%80%EB%8A%A5%ED%95%9C-%EC%8A%A4%ED%8A%B8%EB%A6%BC-%EC%BD%94%EB%93%9C-%EC%83%98%ED%94%8C

const bootstrap = async () => {
  const pathname = "http://dosimpact-2.iptime.org:5050/1-readable";
  const a = document.createElement("a");
  a.href = pathname;
  a.download = pathname.split("/").pop();
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
// bootstrap()

bootstrap();

//

// 어떻게 href
