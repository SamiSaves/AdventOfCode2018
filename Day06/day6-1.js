(() => {
    const values = document.querySelector("body pre").innerHTML.split("\n")
    // Remove the last empty element from the array
    values.pop()
    const coordinates = values.map(str => str.split(", ")).map(coords => coords.map(Number))
    
    // Number that should be bigger than any given coordinate, should be calculated from input data
    const BIG_NUMBER = 10000000
    const perimeter = coordinates.reduce((res, c) => {
        if (c[0] < res.left) res.left = c[0]
        if (c[0] > res.right) res.right = c[0]
        if (c[1] < res.top) res.top = c[1]
        if (c[1] > res.bottom) res.bottom = c[1]
        return res
    }, { top: BIG_NUMBER, left: BIG_NUMBER, right: 0, bottom: 0 })
    
    const perimeterArea = {}
    const getDistance = (start, destination) => (Math.abs(destination[0]-start[0]) + Math.abs(destination[1] - start[1]))

    for (let x = perimeter.left-2; x <= perimeter.right+2; x++) {
        for (let y = perimeter.top-2; y <= perimeter.bottom+2; y++) {
            let closestDistance = BIG_NUMBER
            let closestIndex = -1

            coordinates.forEach((coordinate, index) => {
                const dist = getDistance([x, y], coordinate)
                if (dist < closestDistance) {
                    closestIndex = index
                    closestDistance = dist
                } else if (dist === closestDistance) {
                    // distance is equal to two points, it doesn't belong to any area
                    closestIndex = -1
                }
            })
            
            // If outside of perimeter
            if (!(x >= perimeter.left && x <= perimeter.right && y >= perimeter.top && y <= perimeter.bottom)) {
                if (closestIndex > -1) {
                    // If it is outside of the perimeter I feel like it is infinite ¯\_(ツ)_/¯
                    // We mark it by adding "true" at the end of the array

                    coordinates[closestIndex][2] = true
                }
            }

            perimeterArea[`${x},${y}`] = closestIndex
        }
    }

    let biggestArea = 0

    coordinates.forEach((c, i) => {
        if (c[2]) return // If it is infinite, lets not count its area, as it is a lie

        const area = Object.values(perimeterArea).reduce((res, val) => {
            if (val === i) res++
            return res
        }, 0)
        
        if (area > biggestArea) biggestArea = area
    })

    console.log('Biggest area is: ', biggestArea)
})()
