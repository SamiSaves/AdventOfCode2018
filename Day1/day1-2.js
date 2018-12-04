vals = document.querySelectorAll("body pre")[0].innerText.split('\n').map(val => Number(val))

let currentValue = 0
const results = []
let winner
let c = 0

while(!winner) {
    if (c === 951) c = 0
    const old = currentValue
    currentValue += vals[c]
    
    if (results.includes(currentValue)) {
        console.log("Your result is ", currentValue)
        console.log("Old freq: " + old + " added " + vals[c] + " equals: " + currentValue + " index of c " + c)
        winner = currentValue
    }
    
    results.push(currentValue)
    c++
}