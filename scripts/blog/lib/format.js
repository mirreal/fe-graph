module.exports = function(originData) {
    const blogData = originData[2][2][2]
        .filter(item => typeof item !== 'string')
        .map(item => {
            const originHref = item[1][1].href

            return {
                name: item[1][2],
                date: originHref.slice(5, 15),
                href: originHref.slice(5)
            }
        })
        .reduce((acc, curr) => {
            const year = curr.date.slice(0, 4)
            if (typeof acc[year] === 'undefined') {
                acc[year] = [curr]
            } else {
                acc[year].push(curr)
            }

            return acc
        }, {})

    const yearTextList = Object.keys(blogData)
        .sort((a, b) => a < b)
        .map(item => {
            let currentYearText = `\n## ${item}\n\n`
            const currentYearList = blogData[item]
                .map(item => `* ${item.date}  [${item.name}](${item.href})\n`)
            currentYearText += currentYearList.join('')
            return currentYearText
        })

    const fianlData = `# 文章\n${yearTextList.join('')}`
    return fianlData
}
