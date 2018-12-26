module.exports = {
  parseFrontmatterRedirects: ((file) => {
    let redirects = []
    if(file.origPath.endsWith('.md') && 'frontmatter' in file && file.frontmatter != undefined) {

      strippedFinalPath = file.finalPath.replace('../..', '')
      strippedFinalPath = strippedFinalPath.replace('.md', '.html')

      if('redirect_to' in file.frontmatter) {
        redirects.push({'path': strippedFinalPath, 'redirect':file.frontmatter.redirect_to})
      }

    }

    return redirects
  })
}
