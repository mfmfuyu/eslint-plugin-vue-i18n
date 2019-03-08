/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 */
'use strict'

const glob = require('glob')
const { resolve } = require('path')

function defineTemplateBodyVisitor (context, templateBodyVisitor, scriptVisitor) {
  if (context.parserServices.defineTemplateBodyVisitor === null) {
    context.report({
      loc: { line: 1, column: 0 },
      message: 'Use the latest vue-eslint-parser. See also https://github.com/vuejs/eslint-plugin-vue#what-is-the-use-the-latest-vue-eslint-parser-error'
    })
    return {}
  }
  return context.parserServices.defineTemplateBodyVisitor(templateBodyVisitor, scriptVisitor)
}

function loadLocaleMessages (pattern) {
  const files = glob.sync(pattern)
  return files.map(file => {
    const path = resolve(process.cwd(), file)
    const filename = file.replace(/^.*(\\|\/|:)/, '')
    const messages = require(path)
    return { path: file, filename, messages }
  })
}

function findMissingsFromLocaleMessages (localeMessages, key) {
  const missings = []
  const paths = key.split('.')
  localeMessages.forEach(localeMessage => {
    const length = paths.length
    let last = localeMessage.messages
    let i = 0
    while (i < length) {
      const value = last[paths[i]]
      if (value === undefined) {
        missings.push({
          message: `'${key}' does not exist in '${localeMessage.path}'`
        })
      }
      last = value
      i++
    }
  })
  return missings
}

module.exports = {
  defineTemplateBodyVisitor,
  loadLocaleMessages,
  findMissingsFromLocaleMessages
}