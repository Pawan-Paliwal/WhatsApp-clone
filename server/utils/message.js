const moment = require("moment");
let genrateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: moment().valueOf(),
  };
};

module.exports = { genrateMessage };
