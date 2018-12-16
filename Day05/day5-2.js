(() => {
    let polymer = document.querySelector("body pre").innerText
    // Remove newline from the end of the string
    polymer = polymer.slice(0, -1)

    const alphabet = 'abcdefghijklmnopqrstuvwxyz'
    let regex = '('
    for (let i = 0; i < alphabet.length; i++) {
        const a = alphabet[i]
        const A = alphabet[i].toUpperCase()
        regex += `${a}${A}|${A}${a}|`
    }
    // Remove trailing "|"
    regex = regex.slice(0, -1)
    regex += ')'

    let lowestLength = polymer.length

    for (let i = 0; i < alphabet.length; i++) {
        const a = alphabet[i]
        const A = alphabet[i].toUpperCase()

        let fixedPolymer = polymer.replace(new RegExp('['+a+A+']', 'g'), '')

        while(true) {
            let polymerLength = fixedPolymer.length
    
            fixedPolymer = fixedPolymer.replace(new RegExp(regex, 'g'), '')
    
            if (polymerLength === fixedPolymer.length) break
        }

        if (fixedPolymer.length < lowestLength) lowestLength = fixedPolymer.length
    }

    console.log('Finaly polymer size:', lowestLength)
})()
