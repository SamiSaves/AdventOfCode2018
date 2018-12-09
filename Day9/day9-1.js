(() => {
    const gameData = document.querySelector('body pre').innerText.slice(0, -1).match(/\d+/g).map(Number)
    const [ playerCount, lastMarblePoints ] = gameData
    
    const circle = [ 0 ]
    const playerPoints = {}
    let currentMarbleIndex = 0

    const getCircularIndex = (amount, direction) => {
        let counter = currentMarbleIndex
        if (circle.length === 0) return 0

        while (amount > 0) {
            amount--
            if (direction === 'clockwise') counter++
            else if (direction === 'counterclockwise') counter --
    
            if (counter === circle.length && amount === 0) counter = circle.length
            else if (counter >= circle.length) counter = 0
            else if (counter < 0) counter = circle.length - 1
        }
        
        return counter
    }

    for (let i = 1, currentPlayer = 1; i <= lastMarblePoints; i++, currentPlayer++) {
        // New round starts if currentPlayer is over playerCount
        if (currentPlayer === playerCount + 1) currentPlayer = 1
        
        if (i % 23 === 0) {
            // Dont place marble and add to players score instead
            let score = i
            const otherMarble = getCircularIndex(7, 'counterclockwise')
            
            score += Number(circle.splice(otherMarble, 1))
            currentMarbleIndex = otherMarble
            if (!playerPoints[currentPlayer]) playerPoints[currentPlayer] = score
            else playerPoints[currentPlayer] += score

            continue
        }

        const nextMarble = getCircularIndex(2, 'clockwise')
        currentMarbleIndex = nextMarble
        circle.splice(nextMarble, 0, i) // Add marble to the circle
    }

    const highscore = Object.entries(playerPoints).reduce((highscore, player) => {
        if (player[1] > highscore) highscore = player[1]
        return highscore
    }, 0)

    console.log(`Highest score is ${highscore}`)
})()