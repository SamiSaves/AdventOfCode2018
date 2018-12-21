(() => {
    // const serialNumber = Number(document.querySelector('code.puzzle-input').innerText)
    const serialNumber = 18

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
    let bestGrid = { value: 0, x: 1, y: 1 }

    // Initialize grid
    for (let x = 1; x <= gridSize; x++) {
        fuelGrid[x] = []
        for (let y = 1; y <= gridSize; y++) {
            fuelGrid[x][y] = getFuel(x, y)
            bestGrid.value += fuelGrid[x][y]       
        }
    }

    let size = gridSize // 300x300
    const verysmallnumber = -1000000 
    let totalCalcs = 0

    // parent = { size, x, y, value }
    const recurse = (parent) => {
        
        // Get corners?
        // Loop the 2x2 animationIterationCount: 
        for (two)
            for (two)
                do staph
    }

    let root = { ...bestGrid, size: 300 }
    recurse(root)

    console.log(`Best gird is size of ${bestGrid.size} with value ${bestGrid.value} and top left cell is ${bestGrid.x},${bestGrid.y}`)
})()

// 6,1,5 = 9
// 7,2,4 = 10
// 8,3,4 = 10; totalC 159 455 800
// 90,249,17 = 73; totalC 80 595 450