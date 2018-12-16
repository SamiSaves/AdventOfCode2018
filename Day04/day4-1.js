(() => {
    const values = document.querySelector("body pre").innerHTML.split("\n")
    // Remove the last empty element from the array
    values.pop()

    // e.g. [1518-07-18 23:57] Guard #157 begins shift
    const log = values.map(entry => {
        let action, guardId
        if (entry.includes('wakes')) action = 'wakes'
        else if (entry.includes('asleep')) action = 'asleep'
        else {
            action = 'shift'
            guardId = entry.match(/#\d+/)[0].substring(1)
        }

        const timestamp = new Date(entry.match(/\[.*\]/)[0].substring(1).slice(0, -1))

        return {
            timestamp,
            minutes: timestamp.getMinutes(),
            action,
            guardId
        }
    }).sort((a, b) => a.timestamp - b.timestamp)

    let currentGuard
    let startOfNap
    const guards = {}
    const getRange = (a, b) => [...new Array(b-a).keys()].map(i => a + i)
    const add = a => a ? ++a : 1

    log.forEach(entry => {
        if (entry.action === 'shift') {
            currentGuard = entry.guardId
            if (startOfNap) console.log("Guard never woke up D:")
            if (!guards[currentGuard]) guards[currentGuard] = { totalMinutes: { }, totalNaptime: 0, id: currentGuard }
            return
        }

        if (entry.action === 'asleep') {
            startOfNap = entry.minutes
        } else {
            const naptime = getRange(startOfNap, entry.minutes)
            guards[currentGuard].totalNaptime += naptime.length
            naptime.forEach(m => guards[currentGuard].totalMinutes[m] = add(guards[currentGuard].totalMinutes[m]))
            startOfNap = undefined
        }
    })

    let nextGuardToBeFired = Object.values(guards).sort((a, b) => b.totalNaptime - a.totalNaptime)[0]
    
    let bestMinute = { key: -1, value: -1 }
    Object.entries(nextGuardToBeFired.totalMinutes).map(([key, value]) => {
        if (value > bestMinute.value) bestMinute = {key, value}
    })

    console.log(`Checksum ${nextGuardToBeFired.id}*${bestMinute.key}: `, nextGuardToBeFired.id * bestMinute.key)
})()
