'use strict'

const fs = require('fs')
const shared = require(__dirname + '/shared')
const md5 = require('md5')

const langDir = __dirname + '/../languages'
const languageFiles = fs.readdirSync(langDir)
languageFiles.forEach(function (file) {
  const fileSplit = file.split('.')
  if (fileSplit[1] !== 'po') {
    return
  }
  const language = fileSplit[0]
  const jsonFile = langDir + '/' + language + '.json'
  if (fs.existsSync(jsonFile)) {
    return
  }

  const poLines = fs.readFileSync(langDir + '/' + file).toString().split('\n')
  const poData = shared.parsePoFile(poLines, true)
  const languageData = {}
  for (let id in poData) {
    let text = poData[id].msgid.replace(/\\n/ig, '\n').replace(/\\"/ig, '"')
    let hash = md5(text)
    let str = poData[id].msgstr
    if (str.length && str !== '{EMPTY}' && typeof languageData [hash] === 'undefined') {
      languageData[hash] = {'text': str}
    }
  }
  fs.writeFileSync(jsonFile, JSON.stringify(languageData, null, 2))
})