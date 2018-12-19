var code = (rawInput, verbose) => {
    const arena = rawInput.map(row => row.split(''))
    const getInitiative = (x, y) => x * arena.length + y
    let monsters = []
    for (let x = 0; x < arena.length; x++) {
        for (let y = 0; y < arena[x].length; y++) {
            
            if (arena[x][y] === 'E' || arena[x][y] === 'G') {
                monsters.push({
                    type: arena[x][y],
                    x,
                    y,
                    hitPoints: 200,
                    initiative: getInitiative(x, y)
                })
                arena[x][y] = '.'   
            }
        }
    }

    const arenaHeight = arena.length
    const arenaWidth = arena[0].length
    
    const createNavigationObject = str => {
        const data = str.split(',').map(Number)
        return {
            x: data[0],
            y: data[1]
        }
    }
    const createNavigationIndex = obj => `${obj.x},${obj.y}`

    const getMonster = ({ x, y }) => monsters.find(m => m.x === x && m.y === y)
    const isInsideArena = (x, y) => x >= 0 && y >= 0 && x < arenaWidth && y < arenaHeight
    const isEmpty = ({ x, y }) => arena[x][y] === '.' && (!getMonster({ x, y }) || getMonster({ x, y }).dead)
    const compareSquares = (a, b) => a.x === b.x && a.y === b.y 
    // Returns neighbors in initiative order
    const getNeighboringSquares = ({ x, y }) => {
        const neighbors = []
        if (isInsideArena(x, y - 1)) neighbors.push({ x, y: y - 1 })
        if (isInsideArena(x - 1, y)) neighbors.push({ x: x - 1, y })
        if (isInsideArena(x + 1, y)) neighbors.push({ x: x + 1, y })
        if (isInsideArena(x, y + 1)) neighbors.push({ x, y: y + 1 })
        return neighbors
    }
    const getEmptyNeighbors = ({ x, y }) => getNeighboringSquares({ x, y }).filter(isEmpty)
    const getNeighboringEnemies = ({ x, y, type }) => {
        const squares = getNeighboringSquares({ x, y })
        return monsters.filter(m => squares.find(sq => compareSquares(sq, m)) && m.type !== type && !m.dead)
    }

    const getTarget = ({ x, y, type }) => {
        const enemies = getNeighboringEnemies({ x, y, type }).reverse()
        return enemies.reduce((lowestHp, monster) => {
            if (!lowestHp || monster.hitPoints <= lowestHp.hitPoints) lowestHp = monster
            return lowestHp
        }, undefined)
    }

    const attack = monster => {
        const target = getTarget(monster)
        
        if (!target) return false

        target.hitPoints -= 3
        if (target.hitPoints <= 0) {
            target.dead = true
            if (verbose) console.log(monster, ' killed ', target)
        }
        return true
    }
    const startApp = () => { 
        if (verbose) console.log('Initially')
        if (verbose) printArena()

        let rounds = 0
        let gameOver = false
        while (true) {
            if (verbose) console.log('Starting round', rounds)
            
            monsters.sort((a, b) => a.initiative - b.initiative)
            // if (verbose) console.log('Monsters for this round ', monsters.map(m => `${m.type}-${m.x},${m.y}-${m.hitPoints}-${m.initiative}`).join(' | '))
            monsters.forEach(monster => {
                if (monster.dead || gameOver) return
                
                if (monsters.filter(m => m.type === 'E' && !m.dead).length === 0 || monsters.filter(m => m.type === 'G' && !m.dead).length === 0) {
                    gameOver = true
                    return
                }

                if (attack(monster)) return

                const targets = monsters.reduce((res, monster2) => {
                    if (monster2.type === monster.type || monster2.dead) return res
                     // We can put monster2 here coz it has x and y props
                    res = [...res, ...getEmptyNeighbors(monster2)]
                    return res
                }, [])

                // If no valid targets skip move
                if (targets.length === 0) return

                // Sort targets from last to first, so that ties favor first
                targets.sort((a, b) => getInitiative(b.x, b.y) - getInitiative(a.x, a.y))
                
                let closesetPath
                targets.forEach(target => {
                    const pathToTarget = A_Star(createNavigationIndex(monster), createNavigationIndex(target))
                    if (!pathToTarget) return
                    if (!closesetPath || pathToTarget.length <= closesetPath.length) {
                        closesetPath = pathToTarget
                    }
                })

                if (!closesetPath) return

                closesetPath.reverse()

                const move = createNavigationObject(closesetPath[1])
                monster.x = move.x
                monster.y = move.y
                monster.initiative = getInitiative(monster.x, monster.y)
                attack(monster)
            })
            
            // Removed dead monsters form arena
            monsters = monsters.filter(m => !m.dead)
            
            if (gameOver) break
            
            // It is a full round only if the game doesn't end during the mosnter turns
            rounds ++
            
            if (rounds > 100) {
                console.error('Game went on 100 rounds, abort abort!')
                break
            }
            // if (verbose) console.log('End of round', rounds)
            // if (verbose) printArena()
        }

        const hitsLeft = monsters.reduce((res, monster) => res += monster.hitPoints, 0)
        if (verbose) console.log(`Reuslt of this combat is ${hitsLeft * rounds} (${hitsLeft} * ${rounds})`)
        if (verbose) printArena()

        return {
            answer: hitsLeft * rounds,
            fullRounds: rounds,
            hitPoints: hitsLeft,
            monsters: monsters.map(m => `${m.type}-${m.x},${m.y}-${m.hitPoints}`).join('|')
        }
    }

    const printArena = () => {
        for (let x = 0; x < arena.length; x++) {
            let res = ''
            let hpstat = '     | '
            for (let y = 0; y < arena[x].length; y++) {
                const mosnter = getMonster({ x, y }) || {}
                if (mosnter.type === 'G') {res += 'G'; hpstat += `G(${mosnter.hitPoints}), `}
                else if (mosnter.type === 'E') {res += 'E'; hpstat += `E(${mosnter.hitPoints}), `}
                else res += arena[x][y]
            }
            console.log(res, hpstat)
        }
    }

    // A Star related stuffs

    const reconstruct_path = (cameFrom, current) => {
        let total_path = [ current ]

        while (true) {
            current = cameFrom.get(current)
            if (!current) break
            total_path.push(current)
        }

        return total_path
    }
        
    /**
     * Returns the estimated distance from start to goal using manhattan distance.
     * @param {string} start Coordinates of the start as a string 'x,y' 
     * @param {string} goal Coordinates of the goal as a string 'x,y'
     */
    const getEstimate = (start, goal) => {
        start = createNavigationObject(start)
        goal = createNavigationObject(goal)

        return Math.abs(goal.x - start.x) + Math.abs(goal.y - start.y) + getInitiative(start.x, start.y)
    }

    /** Finds the shortest path to a point 
     * @param {NavigationString} start 
     * @param {NavigationString} goal 
    */
    const A_Star = (start, goal) => {
        const closedSet = []
        const openSet = [ start ]
        const cameFrom = new Map() // an empty map
        
        const gScore = new Map() // map with default value of Infinity
        gScore.set(start, 0) // The cost of going from start to start is zero.
        
        const fScore = new Map() // map with default value of Infinity
        fScore.set(start, getEstimate(start, goal))

        while (openSet.length > 0) {
            let current = ['', 1000000]
            
            for (key of openSet)
                if (fScore.get(key) < current[1]) current = [key, fScore.get(key)]
            current = current[0]

            if (current === goal) return reconstruct_path(cameFrom, current)
            
            // Move current from open to closed
            openSet.splice(openSet.indexOf(current), 1)
            closedSet.push(current)

            // for each neighbor of current
            const neighbors = getEmptyNeighbors(createNavigationObject(current))
            for (neighbor of neighbors) {
                neighbor = createNavigationIndex(neighbor)
                // Ignore the neighbor which is already evaluated.
                if (closedSet.includes(neighbor)) continue

                // The distance from start to a neighbor
                const tentative_gScore = gScore.get(current) + 1

                // Discover a new node
                if (!openSet.includes(neighbor))
                    openSet.push(neighbor)
                else if (tentative_gScore >= gScore.get(neighbor))
                    continue

                // This path is the best known path to this node until we find better. Record it!
                cameFrom.set(neighbor, current)
                gScore.set(neighbor, tentative_gScore)
                fScore.set(neighbor,  tentative_gScore + getEstimate(neighbor, goal))
            }
        }
    }

    return startApp()
}

/* Unit tests o.o */

var totalTests = 0
var passedTests = 0

var test = (msg, expect, result) => {
    totalTests++
    console.log(`-- ${msg}`)

    if (expect === result) {
        console.log('%c-- -- passed', 'color: #0C0')
        passedTests++
    } else {
        console.error(`-- -- failed, expected ${expected} but got ${result}`)
    }
}

(() => {
    let result = code(`#######,#.G...#,#...EG#,#.#.#G#,#..G#E#,#.....#,#######`.split(","))
    console.log('Practice example')

    test('It should have 27730 as the answer', 27730, result.answer)
    test('It should have 47 rounds', 47, result.fullRounds)
    test('It should have 590 total hit points', 590, result.hitPoints)
    test('It should have the correct monsters', 'G-1,1-200|G-2,2-131|G-3,5-59|G-5,5-200', result.monsters)
    
    //
    // Example 1 
    //

    result = code(`#######,#G..#E#,#E#E.E#,#G.##.#,#...#E#,#...E.#,#######`.split(","))
    console.log('Example 1')

    test('It should have 36334 as the answer', 36334, result.answer)
    test('It should have 37 rounds', 37, result.fullRounds)
    test('It should have 982 total hit points', 982, result.hitPoints)
    test('It should have the correct monsters', 'E-1,5-200|E-2,1-197|E-3,2-185|E-4,1-200|E-4,5-200', result.monsters)
    
    //
    // Example 2
    //

    result = code(`#######,#E..EG#,#.#G.E#,#E.##E#,#G..#.#,#..E#.#,#######`.split(","))
    console.log('Example 2')

    test('It should have 39514 as the answer', 39514, result.answer)
    test('It should have 46 rounds', 46, result.fullRounds)
    test('It should have 859 total hit points', 859, result.hitPoints)
    test('It should have the correct monsters', 'E-1,2-164|E-1,4-197|E-2,3-200|E-3,1-98|E-4,2-200', result.monsters)
    
    //
    // Example 3
    //

    result = code(`#######,#E.G#.#,#.#G..#,#G.#.G#,#G..#.#,#...E.#,#######`.split(','))
    console.log('Example 3')

    test('It should have 27755 as the answer', 27755, result.answer)
    test('It should have 35 rounds', 35, result.fullRounds)
    test('It should have 793 total hit points', 793, result.hitPoints)
    test('It should have the correct monsters', 'G-1,1-200|G-1,3-98|G-2,3-200|G-4,5-95|G-5,4-200', result.monsters)
    
    //
    // Example 4
    //

    result = code(`#######,#.E...#,#.#..G#,#.###.#,#E#G#G#,#...#G#,#######`.split(','))
    console.log('Example 4')

    test('It should have 28944 as the answer', 28944, result.answer)
    test('It should have 54 rounds', 54, result.fullRounds)
    test('It should have 536 total hit points', 536, result.hitPoints)
    test('It should have the correct monsters', 'G-2,3-200|G-5,1-98|G-5,3-38|G-5,5-200', result.monsters)
    
    //
    // Example 5
    //

    result = code(`#########,#G......#,#.E.#...#,#..##..G#,#...##..#,#...#...#,#.G...G.#,#.....G.#,#########`.split(','))
    console.log('Example 5')

    test('It should have 18740 as the answer', 18740, result.answer)
    test('It should have 20 rounds', 20, result.fullRounds)
    test('It should have 937 total hit points', 937, result.hitPoints)
    test('It should have the correct monsters', 'G-1,2-137|G-2,1-200|G-2,3-200|G-3,2-200|G-5,2-200', result.monsters)    
})()

if (totalTests === passedTests) {
    console.log('%c-- -- --\n-- -- --\nAll tests passed', 'color: #0C0')
    console.log('Executing the real app')
    rawInput = document.querySelector("body pre").innerHTML.split("\n")
    // Remove the last empty element from the array
    rawInput.pop()
    result = code(rawInput, true)
    const alreadyTried = [355710, 307848, 270504, 268315, 234608, 237274]
    if (!alreadyTried.includes(result.answer)) console.log('%c:thinking: maybe this is the answer', result.answer)
    else console.error('This has already been guessed D:')
}
else console.error(`Tests failed ${passedTests}/${totalTests}`)

// 268315 was too high
// Other guesses 355710, 307848, 270504

// Was not a right answer 234608, 237274
