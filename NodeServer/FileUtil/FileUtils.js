const PFs = require("fs").promises;
const path = require("path");

const filePath = (fileName) => path.join(__dirname, `../assets/${fileName}`);

const fileExist = async (fileName) => {
  try {
    await PFs.access(fileName);
    return true;
  } catch (er) {
    return false;
  }
};

module.exports = { fileExist, filePath };
