'use strict'

const http = require('http')
const fs = require('fs')
const path = require('path')
const querystring = require('qs')
const shared = require(__dirname + '/../shared')

const hostname = 'localhost'
const port = shared.config.editorPort
const langFile = __dirname + '/../../languages/' + shared.config.editorLanguage + '.json'

const server = http.createServer((request, response) => {

  let filePath = '.' + request.url
  if (filePath === './') {
    filePath = './index.html'
  }
  if (filePath === './api') {
    let json = {}
    let body = []
    response.writeHead(200, {'Content-Type': 'text/plain'})
    request.on('data', (chunk) => {
      body.push(chunk)
    }).on('end', () => {
      body = Buffer.concat(body).toString()
      const data = querystring.parse(body)
      switch (data.method) {
        case 'init':
          json['template'] = JSON.parse(fs.readFileSync(__dirname + '/../../languages/template.json').toString())
          json['translation'] = fs.existsSync(langFile) ? JSON.parse(fs.readFileSync(langFile).toString()) : {}
          break
        case 'save':
        case 'save-generate':
          fs.writeFileSync(langFile, new Buffer(data.params.fileData, 'base64'))
          json.message = 'Saved'
          if (data.method === 'save-generate') {
            require(__dirname + '/../update-translation-packs.js')()
            json.message = 'Saved and packs and game giles generated'
          }
          break
      }
      response.end(JSON.stringify(json), 'utf-8')
    })
    return
  }

  let extname = path.extname(filePath)
  let contentType = 'text/html'
  switch (extname) {
    case '.js':
      contentType = 'text/javascript'
      break
    case '.css':
      contentType = 'text/css'
      break
    case '.jpg':
      contentType = 'image/jpg'
      break
  }

  fs.readFile(filePath, function (error, content) {
    if (error) {
      if (error.code === 'ENOENT') {
        response.writeHead(404, {'Content-Type': contentType})
        response.end('File not found', 'utf-8')
      }
      else {
        response.writeHead(500)
        response.end('Sorry, error: ' + error.code + ' ..\n')
      }
    }
    else {
      response.writeHead(200, {'Content-Type': contentType})
      response.end(content, 'utf-8')
    }
  })
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/ - Open it up in your browser`)
})