function convertLayouts(file) {

  if(!file.origPath.endsWith('.md')) {
    return file
  }

  if( 'frontmatter' in file ) {
    delete file.frontmatter.layout
  }

  return file

}

module.exports = convertLayouts
