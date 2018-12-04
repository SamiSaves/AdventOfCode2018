(() => {
    const values = document.querySelector("body pre").innerHTML.split("\n")
    // Remove the last empty element from the array
    values.pop()

    // e.g. [1518-07-18 23:57] Guard #157 begins shift
    const log = values.map(entry => {
        let action, id
        if (entry.includes('wakes')) action = 'wakes'
        else if (entry.includes('asleep')) action = 'asleep'
        else {
            action = 'shift'
            id = entry.match(/#\d+/)[0]
        }

        const timestamp = new Date(entry.match(/\[.*\]/)[0].substring(1).slice(0, -1))

        return {
            timestamp,
            action,
            id
        }
    }).sort((a, b) => a.timestamp - b.timestamp)

    // Add ID for all entries
    let currentId
    log.forEach((entry, index) => {
        if (entry.action === 'shift') currentId = entry.id
        else {
            entry.id = currentId
        }
    })

    // Print sample
    for (let i = 0; i < 20; i++) {
        console.log(log[i])
    }
})()
