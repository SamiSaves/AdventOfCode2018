(() => {
    const values = document.querySelector("body pre").innerHTML.split("\n")
    values.pop()

    const parsedValues = values.reduce((result, val) => {
        const instructions = val.toLowerCase().split('step ').map(x => x[0])
        if (!result[instructions[2]]) result[instructions[2]] = []
        else if (!result[instructions[1]]) result[instructions[1]] = []
        result[instructions[2]].push(instructions[1])

        return result
    }, {})

    let steps = Object.entries(parsedValues).sort((a, b) => b[0] < a[0])
    const canComplete = step => step[1].filter(preq => !completedSteps.includes(preq)).length === 0
    const completeStep = step => {
        // Add step to completed if given
        if (step) completedSteps.push(step)
        // Check if new steps available
        const newSteps = steps.filter(step => canComplete(step))
        // Move new steps to available steps
        newSteps.forEach(step => {
            steps.splice(steps.indexOf(step), 1)
            availableSteps.push(step[0])
        })
    }
    const assignSteps = () => {
        workers.forEach(elf => {
            if (elf.time === 0 && availableSteps.length > 0) {
                elf.step = availableSteps.splice(0, 1)[0]
                elf.time = 60 + AAKKOSET.indexOf(elf.step) + 1
                console.log(`${elf.name} was assigned with step ${elf.step} and it should be completed in ${elf.time} seconds.`)
            }
        })
    }

    const names = ['Snowball', 'Frosty', 'Flake', 'Bob', 'Jangle']
    let workers = new Array(5).fill(null).map(() => ({ step: undefined, time: 0, name: names.splice(0, 1)[0] }))
    const completedSteps = []
    const availableSteps = []

    const AAKKOSET = 'abcdefghijklmnopqrstuvwxyz'
    const totalSteps = steps.length
    let time = 0

    // Move initial steps to availableSteps
    completeStep()
    // Assign initial steps to workers
    assignSteps()

    while (completedSteps.length !== totalSteps) {
        // Complete current steps
        workers.forEach(elf => {
            if (!elf.step) return
            elf.time--
            // console.log(`${elf.name} is working on ${elf.step}! Time left ${elf.time}`)
            if (elf.time === 0) {
                console.log(`${elf.name} completed step ${elf.step}!`)
                completeStep(elf.step)
                elf.step = undefined
                elf.time = 0
            }
        })
        // Assign new steps
        assignSteps()
        // Move time forward
        time++
    }
    
    console.log(`Total time for assembly was ${time} seconds`)
})()