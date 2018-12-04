var values = document.querySelector("body pre").innerHTML.split("\n")
// Remove the last empty element from the array
values.pop()

// e.g. #1075 @ 892,563: 21x17
var claims = values.map(val => {
    const splits = val.split(' ')
    const id = splits[0] // #1075
    const locationSplit = splits[2].split(',') // ["892", "563:"]
    const size = splits[3].split('x') // ["21", "17"]

    const result = {
        id,
        left: Number(locationSplit[0]), // First index is left
        top: Number(locationSplit[1].slice(0, -1)), // Remove the colon from the end of the last coordinate
        width: Number(size[0]), // First index is width
        height: Number(size[1]), // Second index is height
    }

    result.bottom = result.top + result.height
    result.right = result.left + result.width

    return result
})

var isColliding = ((claim1, claim2) => (
    claim1.left < claim2.right &&
    claim1.right > claim2.left &&
    claim1.top < claim2.bottom &&
    claim1.bottom > claim2.top
))

for (let i = 0; i < claims.length; i++) {
    const claim1 = claims[i]
    let collided = false
    for (let j = 0; j < claims.length; j++) {
        if (i === j) continue
        if (isColliding(claim1, claims[j])) {
            collided = true
            break
        }
    }
    if (!collided) {
        console.log(`Claim ${claim1.id} is not overlaping with anything.`)
        break
    }
}
