(() => {
    const values = document.querySelector("body pre").innerHTML.split("\n")
    values.pop()

    const parsedValues = values.reduce((result, val) => {
        const instructions = val.toLowerCase().split('step ').map(x => x[0])
        if (!result[instructions[2]]) result[instructions[2]] = []
        else if (!result[instructions[1]]) result[instructions[1]] = [] // This is for the initial steps
        result[instructions[2]].push(instructions[1])

        return result
    }, {})

    let steps = Object.entries(parsedValues).sort((a, b) => b[0] < a[0])
    const completedSteps = []
    const canComplete = step => step[1].filter(preq => !completedSteps.includes(preq)).length === 0
    const getNextStep = () => steps.find(step => canComplete(step))
    
    while (true) {
        let nextStep = getNextStep()
        if (!nextStep) break
        completedSteps.push(nextStep[0])
        steps.splice(steps.indexOf(nextStep), 1)
    }

    console.log("Final sequence is: ", completedSteps.join('').toUpperCase())
})()
