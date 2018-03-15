'use strict';
(function () {
  var template = null
  var translation = null
  template = window.translation || null
  var translationSha = null
  var storage = {
    'meta': {},
    'translations': {}
  }

  var tmp = localStorage.getItem('storageData')
  if (tmp) {
    storage = JSON.parse(tmp)
  }

  $(window).on('beforeunload', function () {
    if ($('.changed').length) {
      return 'It seems you have edited some texts. Are you sure you want to leave this page?'
    }
  })

  function base64Decode (str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
  }

  function base64Encode (str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode(parseInt(p1, 16))
    }))
  }

  function save () {
    localStorage.setItem('storageData', JSON.stringify(storage))
  }

  function setStatus (status) {
    if (status) {
      $('.status').html(status).removeClass('hidden')
    } else {
      $('.status').addClass('hidden')
    }
  }

  function apiRequest (method, params, callback) {
    return $.post('api', {'method': method, 'params': params}, function (data) {
      callback(JSON.parse(data))
    })
  }

  function githubRequest (url, method, callback, params) {
    return $.ajax({
      'url': 'https://api.github.com/' + url,
      'data': params ? JSON.stringify(params) : null,
      'method': method,
      'headers': {
        'Authorization': 'basic ' + btoa(storage.repository.username + ':' + storage.repository.token)
      },
      'complete': function (data) {
        if (data.status === 401) {
          alert('Your credentials are not correct. Login failed.')
          callback(null)
        } else {
          callback(JSON.parse(data.responseText), data.status)
        }
      }
    })
  }

  function getMergedTranslations () {
    var values = {}
    if (translation) {
      values = translation
    }
    if (storage.translations) {
      values = $.extend({}, values, storage.translations)
    }
    return values
  }

  function textToHtml (str) {
    str = str.replace(/\n/ig, '<span class="red">\\n</span><br/>')
    return str
  }

  function createJsonFileData () {
    return JSON.stringify(getMergedTranslations(), null, 2)
  }

  function downloadData (data, fileName) {
    var a = document.createElement('a')
    document.body.appendChild(a)
    a.style = 'display: none'
    var json = data,
      blob = new Blob([json], {type: 'octet/stream'}),
      url = window.URL.createObjectURL(blob)
    a.href = url
    a.download = fileName
    a.click()
    window.URL.revokeObjectURL(url)
  }

  function setChangedValues () {
    $('textarea.changed').each(function () {
      var id = $(this).closest('.row').attr('data-id')
      if (typeof storage.translations[id] === 'undefined') {
        storage.translations[id] = {}
      }
      storage.translations[id].text = $(this).val()
    })
    save()
  }

  function buildForm () {
    $('.login-form').addClass('hidden')
    $('.translation-form').removeClass('hidden')
    $('.page-load').removeClass('hidden')
    setTimeout(function () {
      $('.page-load').addClass('hidden')
    }, 1000)
    $('.translation-form').on('input change blur', 'textarea', function (e) {
      var t = $(e.target)
      var bg = t.prev()
      bg.html(textToHtml(t.val()))
      if (e.type === 'input') {
        t.addClass('changed')
      } else if (e.type === 'blur' || e.type === 'focusout') {
        setChangedValues()
      }
    })
    var w = $('.translation-form .main .area')
    var values = getMergedTranslations()
    var rowTpl = w.find('.row')
    for (var i in template) {
      var e = rowTpl.clone()
      var text = typeof values[i] !== 'undefined' ? values[i].text : ''
      e.attr('data-id', i)
      e.find('.original').html(textToHtml(template[i].text))
      w.append(e)
      if (text.length) {
        e.find('textarea').val(text).trigger('change')
      }
    }
    rowTpl.remove()
  }

  $(function () {
    $(document).on('mouseenter', '[data-tooltip]', function (ev) {
      var el = $('.tooltip').removeClass('hidden').html($(this).attr('data-tooltip'))
      el.offset({'left': ev.pageX - (el.outerWidth() / 2), 'top': ev.pageY - el.outerHeight() - 10})
    }).on('mouseleave', '[data-tooltip]', function (ev) {
      $('.tooltip').addClass('hidden')
    })
    $('.btn.save').on('click', function () {
      setChangedValues()
      setStatus('Saving...')
      apiRequest($(this).attr('data-action'), {'fileData': base64Encode(createJsonFileData())}, function (data) {
        setStatus(data.message)
        $('.changed').removeClass('changed')
        translation = getMergedTranslations()
        storage.translations = {}
        save()
      })
    })
    $('.btn.download').on('click', function () {
      setChangedValues()
      downloadData(createJsonFileData(), storage.repository.language_path.match(/([a-z_\-0-9]+\.json)/i)[1])
    })
    $('.btn.upload').on('click', function () {
      setChangedValues()
      if (confirm('This will upload the changes to the repository. Are you sure?')) {
        setStatus('Uploading...')
        var sendData = {
          'message': 'upload from brains translation tool',
          'content': base64Encode(createJsonFileData())
        }
        if (translationSha !== null) {
          sendData.sha = translationSha
        }
        githubRequest('repos/' + storage.repository.repository + '/contents/' + storage.repository.language_path, 'put', function (response, status) {
          if (status === 200 || status === 201) {
            setStatus('Upload done')
            $('.changed').removeClass('changed')
            translation = {}
            storage.translations = {}
            save()
          } else {
            setStatus('Upload error: ' + response.message)
          }
        }, sendData)
      }
      if (translationSha === null) {

      }
    })
    $('.btn.reload').on('click', function () {
      if (confirm('This will reload the current page and will re-fetch the translation keys and values from your repository\nIt is highly recommended to upload the changes before doing this. If not uploaded, your already translated values will disappear!')) {
        setTimeout(function () {
          location.reload()
        }, 200)
      }
    })
    $('.translation-form .top input').on('change', function () {
      var v = this.checked

      var all = $('.row')
      var empty = all.filter(function () {
        return $(this).find('textarea').val() === ''
      })
      switch ($(this).attr('name')) {
        case 'hide_untranslated':
          empty.toggleClass('hidden', v)
          break
        case 'hide_translated':
          all.not(empty).toggleClass('hidden', v)
          break
      }
    })
    var selects = $('.translation-form .top select')
    selects.on('change', function () {
      var sorts = {}
      selects.each(function () {
        sorts[$(this).attr('name')] = this.value
      })
      var values = getMergedTranslations()
      var rows = $('.row')
      rows.sort(function (a, b) {
        a = $(a)
        b = $(b)
        var ret = 0
        var vA = values[a.attr('data-id')] || ''
        var vB = values[b.attr('data-id')] || ''
        if (vA) vA = vA.text.toLowerCase()
        if (vB) vB = vB.text.toLowerCase()
        if (sorts['sort_first'].length) {
          vA = vA === '' ? 1 : 0
          vB = vB === '' ? 1 : 0
          if (vA < vB) {
            ret = sorts['sort_first'] === '1' ? -1 : 1
          } else if (vA > vB) {
            ret = sorts['sort_first'] !== '1' ? -1 : 1
          }
        }
        if (ret === 0) {
          if (sorts['sort_second'].length) {
            if (sorts['sort_second'] === '1') {
              vA = template[a.attr('data-id')].text.toLowerCase()
              vB = template[b.attr('data-id')].text.toLowerCase()
            }
            if (vA > vB) {
              ret = 1
            } else if (vA < vB) {
              ret = -1
            }
          }
        }
        return ret
      })
      $('.translation-form .main .area').append(rows)
    })

    // check if this is running in server mode
    if (window.location.port && window.location.port !== '80' && window.location.port !== '443') {
      $('body').addClass('status-mode-server')
      $('.page-load').removeClass('hidden')
      apiRequest('init', null, function (data) {
        template = data.template
        translation = data.translation
        buildForm()
      })
      return
    }

    $('body').addClass('status-mode-local')
    // otherwise go ahead in local mode
    var loginForm = $(document.login)
    if (storage.repository) {
      for (var i in storage.repository) {
        loginForm.find(':input').filter('[name=\'' + i + '\']').val(storage.repository[i])
      }
    }
    loginForm.on('submit', function (ev) {
      ev.preventDefault()
      storage.repository = {
        'username': loginForm.find('[name=\'username\']').val(),
        'token': loginForm.find('[name=\'token\']').val(),
        'code': loginForm.find('[name=\'code\']').val(),
        'repository': loginForm.find('[name=\'repository\']').val(),
        'template_path': loginForm.find('[name=\'template_path\']').val(),
        'language_path': loginForm.find('[name=\'language_path\']').val()
      }
      save()
      githubRequest('user/repos', 'get', function (response) {
        if (response) {
          githubRequest('repos/' + storage.repository.repository + '/contents/' + storage.repository.template_path, 'get', function (response) {
            if (response.message === 'Not Found') {
              alert('File ' + storage.repository.repository + '/' + storage.repository.template_path + ' not found')
              return
            }
            template = base64Decode(response.content)
            try {
              template = JSON.parse(template)
            } catch (e) {
              alert(e.message)
              return
            }
            githubRequest('repos/' + storage.repository.repository + '/contents/' + storage.repository.language_path, 'get', function (response) {
              if (typeof response.content !== 'undefined') {
                translation = JSON.parse(base64Decode(response.content))
                for (var id in translation) {
                  translation[id].text = translation[id].text.replace(/\\n/g, '\n').replace(/\\"/g, '\"')
                }
                translationSha = response.sha
              } else {
                translation = null
              }
              buildForm()
            })
          })
        }
      })
    })
  })
})()