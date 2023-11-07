const auto = require("google-autocomplete");

const autoComplete = ({ keyword }) =>
  new Promise((res) => {
    auto.getQuerySuggestions(keyword, function (err, suggestions) {
      const result = suggestions.map((s) => s.suggestion);
      res(result);
    });
  });

const bootstrap = async () => {
  const result = await autoComplete({ keyword: "javascript 객체" });
  console.log(result.join(","));
};

bootstrap();
