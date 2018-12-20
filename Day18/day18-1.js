(() => {
    const input = document.querySelector('pre').innerText.split('\n')
    input.pop()

    let area = input.map(val => val.split(''))
    const areaSize = 50
    const lumberyard = '#'
    const tree = '|'
    const open = '.'

    const isInside = (x, y) => x >= 0 && y >= 0 && x < areaSize && y < areaSize
    const getSurroundingAcres = (x, y) => {
        const neighbors = []
        for (let x2 = -1; x2 < 2; x2++) {
            for (let y2 = -1; y2 < 2; y2++) {
                if (x2 === 0 && y2 === 0) continue
                if (isInside(x + x2, y + y2)) {
                    neighbors.push(area[x + x2][y + y2])
                }
            }
        }
        return neighbors
    }

    for (let i = 0; i < 10; i++) {
        const newArea = []
        for (let x = 0; x < areaSize; x++) {
            const row = []
            for (let y = 0; y < areaSize; y++) {
                const acre = area[x][y]
                const surrounds = getSurroundingAcres(x, y)
                if (acre === open) {
                    if (surrounds.filter(a => a === tree).length >= 3) {
                        row.push(tree)
                    } else {
                        row.push(open)
                    }
                } else if (acre === tree) {
                    if (surrounds.filter(a => a === lumberyard).length >= 3) {
                        row.push(lumberyard)
                    } else {
                        row.push(tree)
                    }
                } else if (acre === lumberyard) {
                    const hasLumberyard = Boolean(surrounds.find(a => a === lumberyard))
                    const hasTrees = Boolean(surrounds.find(a => a === tree))

                    if (hasLumberyard && hasTrees) row.push(lumberyard)
                    else row.push(open)
                }
            }
            newArea.push(row)
        }

        area = [...newArea]
    }
    
    let treeCount = 0
    let lumberyardCount = 0
    for (let x = 0; x < areaSize; x++) {
        for (let y = 0; y < areaSize; y++) {
            if (area[x][y] === tree) treeCount++
            else if (area[x][y] === lumberyard) lumberyardCount++ 
        }
    }
    console.log(`Area has ${treeCount} acres of trees and ${lumberyardCount} lumberyards. Your answer is ${treeCount * lumberyardCount}`)
})()
