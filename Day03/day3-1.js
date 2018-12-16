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

    return result
})

var canvas = document.createElement('canvas')
canvas.width = 1000
canvas.height = 1000

var ctx = canvas.getContext('2d')
claims.forEach(claim => {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
    ctx.fillRect(claim.left, claim.top, claim.width, claim.height)
})

var imgd = ctx.getImageData(0, 0, 1000, 1000);
var pix = imgd.data;

// Loop over each pixel and invert the color.
var overlappingClaims = 0
var alpha = 26 // This is the number in image that represents rgba 0.1
for (var i = 0, n = pix.length; i < pix.length; i += 4) {
    // Aplha is every 4th number in the image data
    if (pix[i + 3] > alpha) overlappingClaims++
}

document.body.prepend(canvas)
console.log("Total overlapping claims: ", overlappingClaims)