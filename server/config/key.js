if (process.env.NODE_ENV === "priduction") {
  module.exports = require("./prod");
} else {
  module.exports = require("./dev");
}
