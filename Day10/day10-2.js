(() => {
    const values = document.querySelector("body pre").innerHTML.split("\n")
    // Remove the last empty element from the array
    values.pop()
    const lights = values.map(val => {
        const numbers = val.match(/-?\d+/g)
        return {
            x: Number(numbers[0]),
            y: Number(numbers[1]),
            velocityX: Number(numbers[2]),
            velocityY: Number(numbers[3])
        }
    })

    lights.forEach(light => {
        let negativeX, negativeY
        if (light.x < 0) negativeX = true
        if (light.y < 0) negativeY = true
        
        const newX = Math.abs(light.x) - Math.abs(light.velocityX) * 10000
        const newY = Math.abs(light.y) - Math.abs(light.velocityY) * 10000
        
        light.x = negativeX ? -newX : newX
        light.y = negativeY ? -newY : newY
    })

    const canvas = document.createElement('canvas')
    canvas.width = lights.length
    canvas.height = lights.length
    canvas.style.display = 'block'
    const context = canvas.getContext('2d')
    document.body.prepend(canvas)

    const slider = document.createElement('input')
    slider.type = 'range'
    slider.min = '0'
    slider.max = '1000'
    slider.style.width = '1000px'
    slider.style.display = 'block'
    document.body.prepend(slider)
    const answer = document.createElement('h4')
    answer.innerText = 'Drag the slider to fast forward the lights.'
    document.body.prepend(answer)

    slider.oninput = () => {
        context.clearRect(0, 0, lights.length, lights.length)
        context.fillStyle = '#C00'
        lights.forEach(light => {
            const x = light.x + (light.velocityX * slider.value)
            const y = light.y + (light.velocityY * slider.value)
            
            context.fillRect(x, y, 1, 1)
            answer.innerText = `When you see the message, your answer should be ${Number(slider.value) + 10000} (${slider.value} + 10 000)`
        })
    }
})()