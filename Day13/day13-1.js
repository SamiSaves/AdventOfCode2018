(() => {
    const rawInput = document.querySelector('body pre').innerText.slice(0, -1).split('\n')

    const rails = rawInput.reduce((result, value) => {
        result.push(value.split(''))
        return result
    }, [])

    console.log(`Rails total size is ${rails.length} * ${rails[0].length} = ${rails.length * rails[0].length}`)

    // Separate carts from rails
    const carts = []
    for (let top = 0; top < rails.length; top++) {
        for (let left = 0; left < rails[top].length; left++) {
            let index = top * rails[top].length + left
            switch (rails[top][left]) {
                case '<':
                case '>':
                    carts.push({ top, left, dir: rails[top][left], nextTurn: 'left', index })
                    rails[top][left] = '-'
                    break
                case '^':
                case 'v':
                    carts.push({ top, left, dir: rails[top][left], nextTurn: 'left', index })
                    rails[top][left] = '|'
                    break
            }
        }
    }
    
    console.log(`There are total of ${carts.length} carts in the system.`)

    const moove = cart => {
        if      (cart.dir === '<') cart.left--
        else if (cart.dir === '>') cart.left++
        else if (cart.dir === '^') cart.top--
        else if (cart.dir === 'v') cart.top++
    }

    const turn = cart => {
        if (cart.nextTurn === 'left') {
            if      (cart.dir === '<') cart.dir = 'v'
            else if (cart.dir === '>') cart.dir = '^'
            else if (cart.dir === 'v') cart.dir = '>'
            else if (cart.dir === '^') cart.dir = '<'
            cart.nextTurn = 'straight'
        } else if (cart.nextTurn === 'straight') {
            cart.nextTurn = 'right'
        } else if (cart.nextTurn === 'right') {
            if      (cart.dir === '<') cart.dir = '^'
            else if (cart.dir === '>') cart.dir = 'v'
            else if (cart.dir === 'v') cart.dir = '<'
            else if (cart.dir === '^') cart.dir = '>'
            cart.nextTurn = 'left'
        }
    }

    let collision
    const move = cart => {
        switch (rails[cart.top][cart.left]) {
            case '-':
            case '|':
                break
            case '/':
                if      (cart.dir === '<') cart.dir = 'v'
                else if (cart.dir === '>') cart.dir = '^'
                else if (cart.dir === 'v') cart.dir = '<'
                else if (cart.dir === '^') cart.dir = '>'
                break
            case '\\':
                if      (cart.dir === '<') cart.dir = '^'
                else if (cart.dir === '>') cart.dir = 'v'
                else if (cart.dir === 'v') cart.dir = '>'
                else if (cart.dir === '^') cart.dir = '<'
                break
            case '+':
                turn(cart)
                break
        }

        moove(cart)
        collision = carts.find(cart2 => cart2 !== cart && cart2.top === cart.top && cart2.left=== cart.left)
    }

    while(!collision) {
        carts.sort((a, b) => a.index - b.index)

        for (let i = 0; i < carts.length; i++) {
            move(carts[i])
            carts[i].index = carts[i].top * rails[carts[i].top].length + carts[i].left
            if (collision) break
        }
    }

    if (collision) console.log(`First collision happens in ${collision.left},${collision.top}`)
})()