var chalk = require('chalk')
var fs = require('fs')
var marked = require('marked')
var renderer = new marked.Renderer()

var parser = function (path) {
  var body = fs.readFileSync(path, 'utf-8')
    .replace(/^#!.*\n/, '')
    .split('\n')
    .filter(function (line) {
      return line.match(/^\#|^\/\//)
    })
    .map(function (line) {
      return line.replace(/^(\#|\/\/)\s*/, '')
    })
    .join('\n')

  return marked(body, {
    renderer: renderer,
    gfm: true,
    smartypants: true
  })
}

parser.indent = function (body, length) {
  return body
    .split('\n')
    .map(function(line) {
      return Array(length+1).join(' ') + line;
    })
    .join('\n')
}

renderer.blockquote = function (text) {
  return chalk.gray(text)
}

renderer.code = function (code) {
  return '\n' + code
    .split('\n')
    .map(function(line) {return '  ' + line})
    .join('\n') + '\n'
}

renderer.codespan = function (code) {
  return '`' + code + '`'
}

renderer.del = function (code) {
  return chalk.strikethrough(code)
}

renderer.em = function (text) {
  return chalk.inverse(text)
}

renderer.heading = function (text, level) {
  return '\n' + text + ':\n'
}

renderer.hr = function () {
  return '\n--------------------------------------------------------------------------------\n'
}

renderer.html = function (text) {
  return text
}

renderer.link = function (href, title, text) {
  return chalk.underline(text) + ' (' + href + ')'
}

renderer.list = function (text, ordered) {
  return '\n' + text.split('\n')
    .filter(function (li) { return li != '' })
    .map(function (li, i) {
      var marker = ordered ? (i+1) + '.' : '-'
      return '    ' + marker + ' ' + li
    })
    .join('\n') + '\n'
}

renderer.listitem = function (text) {
  return text + '\n'
}

renderer.paragraph = function (text, level) {
  return '\n' + text
    .split('\n')
    .map(function(line) {return '  ' + line})
    .join('\n') + '\n'
}

renderer.strong = function (text) {
  return chalk.bold(text)
}

module.exports = parser
