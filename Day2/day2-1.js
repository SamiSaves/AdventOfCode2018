var values = document.querySelector("body pre").innerHTML.split("\n")
// Remove the last empty element from the array
values.pop()

var twos = 0
var threes = 0

values.forEach(value => {
    const strs = value.split('')
    let two, three

    strs.forEach(c => {
        const copies = strs.filter(c2 => c === c2).length
        if (copies === 2) two = true
        else if (copies === 3) three = true
    })

    if (two) twos ++
    if (three) threes++
 })

console.log("Your answer is: ", twos * threes)