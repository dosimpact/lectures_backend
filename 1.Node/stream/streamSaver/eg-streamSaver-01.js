export async function downloadStreamFile({
  requestURL,
  filename = "",
  fetchOption = {},
} = {}) {
  const fileWriteStream = streamSaverCore.createWriteStream(
    filename,
    filename.endsWith("zip") ? {} : { type: "text/csv;charset=utf-8" }
  );

  const response = await fetch(requestURL, {
    credentials: "include",
    mode: "cors",
    cache: "no-cache",
    method: fetchOption?.method,
    headers: {
      "Content-Type": "application/json",
      Accept: "text/csv;charset=utf-8",
    },
    body: fetchOption?.body,
    ...fetchOption,
  });

  const contentType = response.headers.get("Content-Type");

  if (String(contentType).includes("application/json")) {
    const result = await response.json();
    throw new Error(result?.message);
  }

  const writer = fileWriteStream.getWriter();
  const reader = response.body.getReader();

  const pump = () =>
    reader
      .read()
      .then((res) =>
        res.done ? writer.close() : writer.write(res.value).then(pump)
      );
  pump();
}
