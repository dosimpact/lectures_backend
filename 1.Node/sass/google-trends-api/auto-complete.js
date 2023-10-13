const googleTrends = require("google-trends-api");
const dateFns = require("date-fns");

const tryParsing = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    throw new Error("cannot parsing json to string");
  }
};

const autoComplete = async ({ keyword } = {}) => {
  /* ******************* Autocomplete **************************/
  const autoComplete = await googleTrends.autoComplete({
    keyword,
    geo: "KR",
  });

  console.dir(tryParsing(autoComplete), { depth: 5 });
  const topics = tryParsing(autoComplete)?.default?.topics;
  return (topics || []).map((t) => t.title);
};

const bootstrap = async () => {
  const result = await autoComplete({ keyword: "javascript 배열" });
  console.log(result);
};

bootstrap();
