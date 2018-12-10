const convertLayouts = require("./convertLayouts");
const changeLogIndex = require("./change-log-index");
const alterMarkdownStrings = require("./alterMarkdownStrings")
const updateFontUrlInCss = require("./updateCssFontUrl")
const removeFrontmatterExtra = require("./removeFrontmatterItems")

function applyRules(file) {

  file = changeLogIndex(file)
  file = convertLayouts(file)
  file = alterMarkdownStrings(file)
  file = updateFontUrlInCss(file)
  file = removeFrontmatterExtra(file)


  return file

}

exports.applyRules = applyRules


