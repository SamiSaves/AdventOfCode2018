(() => {
    const serialNumber = Number(document.querySelector('code.puzzle-input').innerText)

    const getFuel = (x, y) => {
        const rackId = x + 10
        const initialPower = rackId * y
        let power = initialPower
        power += serialNumber
        power = power * rackId
        if (power < 100) power = 0
        else {
            const numberCount = `${power}`.length
            power = Number(`${power}`[numberCount-3])
        }

        return power -= 5
    }

    const fuelGrid = []
    const gridSize = 300
    const isInside = (x, y) => x > 0 && y > 0 && x <= 300 && y <= 300
    let bestGrid = { value: -1000, location: [0, 0]}

     for (let x = 1; x <= gridSize; x++) {
        for (let y = 1; y <= gridSize; y++) {
            let totalValue = 0
            for (let i = 0; i <= 2; i++) {
                for (let j = 0; j <= 2; j++) {
                    const x2 = x + i
                    const y2 = y + j
                    if (!isInside(x2, y2)) continue
                    if (!fuelGrid[x2]) fuelGrid[x2] = []
                    if (!fuelGrid[x2][y2]) fuelGrid[x2][y2] = getFuel(x2, y2)
                    totalValue += fuelGrid[x2][y2]
                }
            }

            if (totalValue > bestGrid.value) {
                bestGrid = {
                    value: totalValue,
                    location: [x, y]
                }
            }
        }
     }

     console.log(`Best 3x3 has value of ${bestGrid.value} and top left cell is ${bestGrid.location[0]},${bestGrid.location[1]}`)
})()
