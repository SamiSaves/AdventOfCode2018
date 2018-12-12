(() => {
    const rawInput = document.querySelector('body pre').innerText.slice(0, -1).match(/[\.#]+/g)
    const rules = new Map()
    const initialState = rawInput.splice(0, 1)[0]
    for (let i = 0; i < rawInput.length; i += 2) {
        rules.set(rawInput[i], rawInput[i+1])
    }

    let pots = new Map()
    initialState.split('').forEach((plant, index) => pots.set(index, plant))
    
    const grow = () => {
        pots = new Map([...pots.entries()].sort((a, b) => a[0] - b[0]))
        const firstKey = [...pots.keys()][0]
        const paas = `....${[...pots.values()].join('')}....` // Pots as a string
        const nextGen = new Map()

        // Loop through paas
        for (let i = firstKey - 2, s = 2; s < paas.length - 2; i++, s++) {
            const pattern = paas.substring(s - 2, s + 3)
            nextGen.set(i, rules.get(pattern))
        }

        pots = nextGen
    }

    for (let i = 0; i < 20; i++)
        grow()

    let result = 0
    for ([key, value] of pots)
        if (value === '#') result += key

    console.log('Your checksum is ', result)
})()
