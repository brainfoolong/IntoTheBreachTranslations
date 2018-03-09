'use strict'
// a dev script to automatically translate strings in .po with google translate

const fs = require('fs')
const shared = require(__dirname + '/shared')
process.env['GOOGLE_APPLICATION_CREDENTIALS'] = shared.config.googleTranslateKey

const Translate = require('@google-cloud/translate')
const translate = new Translate()

const langDir = __dirname + '/../languages'
const languages = fs.readdirSync(langDir)

languages.forEach(function (langFile) {
  if (langFile.substr(langFile.length - 2) !== 'po') {
    return
  }
  const language = langFile.substring(0, langFile.length - 3)
  if(shared.config.langInGameDir !== language){
    return
  }
  const lines = fs.readFileSync(langDir + '/' + langFile).toString().split('\n')
  let poFileData = shared.parsePoFile(lines, false)
  let poFileDataFlat = shared.parsePoFile(lines, true)
  let openRequests = {}
  const requestDone = function (poId) {
    openRequests[poId] = false
    let allDone = true
    for (let i in openRequests) {
      if (openRequests[i]) {
        allDone = false
        break
      }
    }
    if (allDone) {
      fs.writeFileSync(langDir + '/' + langFile, lines.join('\n'))
    }
  }
  for (let i in poFileData) {
    openRequests[i] = true;
  }
  for (let i in poFileData) {
    (function (poId) {
      if (poFileDataFlat[poId].msgstr.length) {
        requestDone(poId)
        return
      }
      translate
        .translate(poFileDataFlat[poId].msgid, language)
        .then(results => {
          poFileData[poId].msgstr.lines.forEach(function (lineNr) {
            lines[lineNr] = 'msgstr "' + results[0] + '"'
          })
          requestDone(poId)
        })
        .catch(err => {
          console.error('ERROR:', err)
        })
    })(i)
  }
})