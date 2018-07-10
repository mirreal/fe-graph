const { markdown } = require('markdown')
const { readFile, writeFile } = require('./lib/fs')
const format = require('./lib/format')

const input = 'SUMMARY.md'
const output = 'blog/README.md'

const start = async function() {
    try {
        const result = await readFile(input)

        const json = markdown.parse(result)
        const finalMarkdownText = format(json)

        await writeFile(output, finalMarkdownText)
        console.log('update success')
    } catch (err) {
        console.log(err)
    }
}

start()
