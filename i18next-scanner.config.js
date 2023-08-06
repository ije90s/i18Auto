const path = require("path");

const COMMON_EXTENSIONS = "/**/*.{html}";

module.exports = {
  input: ["./src/index.ejs"],
  options: {
    defaultLng: "ko-KR",
    lngs: ["ko-KR", "en-US"],
    func: {
      list: ["i18next.t"],
      extensions: [".ejs"],
    },
    resource: {
      loadPath: path.join(__dirname, "assets/locales/{{lng}}/{{ns}}.json"),
      savePath: path.join(__dirname, "assets/locales/{{lng}}/{{ns}}.json"),
    },
    defaultValue(lng, ns, key) {
      const keyAsDefaultValue = ["ko-KR"];
      if (keyAsDefaultValue.includes(lng)) {
        const separator = "~~";
        const value = key.includes(separator) ? key.split(separator)[1] : key;

        return value;
      }

      return "";
    },
    keySeparator: false,
    nsSeparator: false,
    prefix: "%{",
    suffix: "}",
  },
};
