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

    for (let x = perimeter.left; x <= perimeter.right; x++) {
        for (let y = perimeter.top; y <= perimeter.bottom; y++) {
            let totalDistance = 0

            coordinates.forEach((coordinate, index) => {
                totalDistance += getDistance([x, y], coordinate)
            })
            
            perimeterArea[`${x},${y}`] = totalDistance
        }
    }

    let stuff = Object.values(perimeterArea).reduce((res, val) => {
        if (val < 10000) res++
        return res
    }, 0)

    console.log('Your answer is: ', stuff)
})()
