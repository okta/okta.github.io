function updateResourceMarkdownStrings(file) {

  if(!file.origPath.endsWith('.md')) {
    return file
  }

  if(!file.origPath.includes('docs/api/resources')) {
    return file
  }

  file.bodyLines.forEach((line, index) => {
    if(line.includes('{:.')) {
      delete file.bodyLines[index]
    }

    // lorem {% api_operation post /api/v1/apps %} ipsum
    if(line.includes('{% api_operation')) {
      const regex = /(({% api_operation) (get|post|delete|put) (.*) (%}))/gm
      let i;

      while ((i = regex.exec(line)) !== null) {
        if (i.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        file.bodyLines[index] = line.replace(i[1], '<ApiOperation method="'+i[3]+'" url="'+i[4]+'" />')
      }
    }

  })

  return file

}

module.exports = updateResourceMarkdownStrings
