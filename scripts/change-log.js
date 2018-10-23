#!/usr/bin/env node

'use strict'

const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

let backup_changelog = path.resolve(__dirname + '/../_backup/change-log/index.md'),
    changelog = path.resolve(__dirname + '/../docs/change-log/index.md'),
    source_directory = path.resolve(__dirname + '/../_source/_change-log/')

/**
 * Replace backup with current file, clear current file
 */

fs.copyFileSync(changelog, backup_changelog)

fs.writeFileSync(changelog, '', function(){})

/**
 * Build new changelog from source directory files
 */
fs.readdirSync(source_directory).reverse().forEach(function(file){

  if (file.indexOf('.md') > -1) {

    let contents = fs.readFileSync(source_directory + '/' + file, "utf8")

    /**
     * Remove front matter from merged files that aren't index
     */
    if (file !== 'index.md') {
      contents = contents.replace(/---\n((.+\n)+)---/, '')
    }

    fs.appendFileSync(changelog, contents);

  }

})
