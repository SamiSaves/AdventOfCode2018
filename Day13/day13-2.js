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
    }

    while(true) {
        carts.sort((a, b) => a.index - b.index)

        for (let i = 0; i < carts.length; i++) {
            const cart = carts[i]
            move(cart)
            cart.index = cart.top * rails[cart.top].length + cart.left
            const collidingCart = carts.find(cart2 => cart2 !== cart && cart2.top === cart.top && cart2.left=== cart.left)
            if (collidingCart) {
                carts.splice(i, 1)
                const collidingIndex = carts.indexOf(collidingCart)
                carts.splice(collidingIndex, 1)
                if (--i >= collidingIndex) i--
            }
        }

        if (carts.length === 1) {
            console.log(`Only one cart left! It is located in coordinates ${carts[0].left},${carts[0].top}`)
            break
        }
    }
})()