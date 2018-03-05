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
  const lines = fs.readFileSync(langDir + '/' + langFile).toString().split('\n')
  let msgData = {}
  let currentId = null
  lines.forEach(function (line, lineNr) {
    line = line.trim()
    if (line.substr(0, 7) === 'msgctxt') {
      currentId = null
    }
    if (line.substr(0, 5) === 'msgid') {
      currentId = 'msgid'
      line = line.substr(6)
      msgData = {}
    }
    if (line.substr(0, 6) === 'msgstr') {
      currentId = 'msgstr'
      line = line.substr(7)
    }
    if (line.substr(0, 1) === '"' && currentId !== null) {
      if (typeof msgData[currentId] === 'undefined') {
        msgData[currentId] = []
      }
      msgData[currentId].push(line.substring(1, line.length - 1))
    }
    if (currentId === null && msgData.msgid && msgData.msgstr) {
      var str = msgData.msgstr.join('')
      var id = msgData.msgid.join('')
      if (!str.length && id.length) {
        msgData = {};
        (function (ln, text) {
          translate
            .translate(text, language)
            .then(results => {
              lines[ln] = 'msgstr "' + results[0] + '"'
            })
            .catch(err => {
              console.error('ERROR:', err)
            })
        })(lineNr - 2, id)
      }
    }
  })
  setTimeout(function () {
    fs.writeFileSync(langDir + '/' + langFile, lines.join('\n'))
  }, 5000)
})

return
// The text to translate
const text = 'Hello, world!'
// The target language
const target = 'de'

// Translates some text into Russian
translate
  .translate(text, target)
  .then(results => {
    const translation = results[0]

    console.log(`Text: ${text}`)
    console.log(`Translation: ${translation}`)
  })
  .catch(err => {
    console.error('ERROR:', err)
  })