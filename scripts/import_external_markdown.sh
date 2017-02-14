#!/bin/bash
# include_external_markdown.sh
#
#   Searches Markdown files for a special string ("external_source"), then
#   appends (or "transcludes") the referenced file into the Markdown
#
#   Example: Assume that we have two files: "/tmp/hello.md" and "/tmp/contents.md"
#   also assume that GENERATED_SITE_LOCATION=/tmp
#
#   If "/tmp/hello.md" contained this content:
#
#     ----
#     title: Testing
#     external_source: /tmp/contents.md
#     ----
#
#   And "/tmp/contents.md" contained this:
#
#     Hello World!
#
#   Then here is what "/tmp/hello.md" would contain after
#   running the import_external_documentation() function:
#
#     ----
#     title: Testing
#     external_source: /tmp/contents.md
#     ----
#     <!-- Imported from external_source file -->
#     Hello World!



# This is the string written into transcluded files, to makes this script idempotent 
TRANSCLUDE_WAS_HERE="<!-- Imported from external_source file -->"
# This is the key used in the front matter of Markdown files, used to point to the file to be transcluded
EXTERNAL_SOURCE="external_source"

# Given a filename, read the filename of a file to transclude
function transclude_file() {
    filename=$1
    source=`cat $filename | grep ${EXTERNAL_SOURCE} | cut -d : -f 2`
    if [[ -z "${source}" ]]; then
        echo "Error finding source!"
        return 1
    fi
    grep "${TRANSCLUDE_WAS_HERE}" $filename > /dev/null
    if [ $? -eq 0 ]; then
        echo "${filename} seems to have already been modified, skipping"
        return 2
    else
        echo "${TRANSCLUDE_WAS_HERE}" >> $filename
        awk '/\<\!-- START GITHUB ONLY --\>/{flag=0}/\<\!-- END GITHUB ONLY --\>/{flag=1;next}flag' $source >> $filename
        echo "Appended contents of '${source}' to '${filename}'"
    fi
}

# Run the transclude_file() function on every Markdown file that contains the string "external_source"
function import_external_markdown() {
    # grep: "-l" is "--files-with-matches"
    for file in `find _source -type f -iname '*.md' | xargs grep -l $EXTERNAL_SOURCE `; do
        transclude_file $file
    done
}
