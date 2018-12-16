var values = document.querySelector("body pre").innerHTML.split("\n")
// Remove the last empty element from the array
values.pop()

var strLen = values[0].length
var done

for (let i = 0; i < strLen; i++) {
    const editedVals = values.map(str => str.slice(0, i - 1) + str.slice(i))

    for (let j = 0; j < editedVals.length; j++) {
        const val = editedVals[j]
        const count = editedVals.filter(str => val === str).length
        if (count === 2) {
            console.log("Your answer is: ", val)
            done = true
            break
        }
    }

    if (done) break
}
