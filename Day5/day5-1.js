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

    while(true) {
        let polymerLength = polymer.length

        polymer = polymer.replace(new RegExp(regex, 'g'), '')

        if (polymerLength === polymer.length) break
    }

    console.log('Finaly polymer size:', polymer.length)
})()
