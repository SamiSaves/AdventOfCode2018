(() => {
    const rawInput = document.querySelector("body pre").innerHTML.split("\n")
    // Remove the last empty element from the array
    rawInput.pop()

    const arena = rawInput.map(row => row.split(''))
    const getInitiative = (x, y) => x * arena[x].length + y
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

    // monsters = monsters.reduce((res, mon) => {const hasType = res.find(m => m.type === mon.type);if (!hasType) res.push(mon); return res }, [])

    const arenaHeight = arena.length
    const arenaWidth = arena[0].length
    
    console.log('Arena size', arena[0].length, arena.length)
    console.log(`Monsters: ${monsters.length}, split: Elves: ${monsters.filter(m => m.type === 'E').length}, Goblins: ${monsters.filter(m => m.type === 'G').length}`)

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
    const isEmpty = ({ x, y }) => arena[x][y] === '.' && !getMonster({ x, y })
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
        return monsters.filter(m => squares.find(sq => compareSquares(sq, m)) && m.type !== type)
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
            monsters.splice(monsters.indexOf(target), 1)
            console.log('PEW! Monster ded1!!')
        }
        return true
    }
    const startApp = () => { 

        let rounds = 0
        while (true) {
            rounds ++
            console.log('Starting round', rounds)
            // if (rounds > 4) break

            monsters.sort((a, b) => a.initiative - b.initiative)
            monsters.forEach(monster => {
                if (attack(monster)) return

                const targets = monsters.reduce((res, monster2) => {
                    if (monster2.type === monster.type) return res
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
                // console.log(`Monster is moving from ${monster.x},${monster.y} to ${move.x},${move.y}`)
                monster.x = move.x
                monster.y = move.y
                attack(monster)
            })

            // Check if game should end.
            if (monsters.filter(m => m.type === 'E').length === 0 || monsters.filter(m => m.type === 'G').length === 0) {
                break
            }
        }

        const hitsLeft = monsters.reduce((res, monster) => res += monster.hitPoints, 0)
        console.log(`Reuslt of this combat is ${hitsLeft * rounds} (${hitsLeft} * ${rounds})`)
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

        return Math.abs(goal.x - start.x) + Math.abs(goal.y - start.y)
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
    startApp()
})()


// 270504 was too high
// Other guesses 355710, 307848 