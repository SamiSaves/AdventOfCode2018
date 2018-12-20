(() => {
    const rawInput = document.querySelector('pre').innerText.split('\n\n\n\n')
    const getNumbers = (str, split) => str.split(split).map(v => v.match(/\d+/g)[0]).map(Number)
    const samples = rawInput[0].split('\n\n').map(val => val.split('\n')).map(value => {
        const instruction = getNumbers(value[1], ' ')
        return {
            before: getNumbers(value[0], ','),
            instruction: {
                id: instruction[0],
                a: instruction[1],
                b: instruction[2],
                c: instruction[3]
            },
            after: getNumbers(value[2], ','),
        }
    })

    const rawTestProgram = rawInput[1].split('\n')
    rawTestProgram.pop()

    const testProgram = rawTestProgram.map(val => getNumbers(val, ' ')).map(instruction => ({
        id: instruction[0],
        a: instruction[1],
        b: instruction[2],
        c: instruction[3]
    }))
    console.log('Test program stuffs', testProgram.length, testProgram[0], testProgram[testProgram.length-1])


    // instruction[0] === name, instruction[1] is A, instruction[2] = B, instruction[3] = C
    const opcodes = {
        /** addr (add register) stores into register C the result of adding register A and register B. */
        addr: (reg, ins) => reg[ins.c] = reg[ins.a] + reg[ins.b],
        /** addi (add immediate) stores into register C the result of adding register A and value B. */
        addi: (reg, ins) => reg[ins.c] = reg[ins.a] + ins.b,
        /** mulr (multiply register) stores into register C the result of multiplying register A and register B.*/
        mulr: (reg, ins) => reg[ins.c] = reg[ins.a] * reg[ins.b],
        /** muli (multiply immediate) stores into register C the result of multiplying register A and value B.*/
        muli: (reg, ins) => reg[ins.c] = reg[ins.a] * ins.b,
        /** banr (bitwise AND register) stores into register C the result of the bitwise AND of register A and register B.*/
        banr: (reg, ins) => reg[ins.c] = reg[ins.a] & reg[ins.b],
        /** bani (bitwise AND immediate) stores into register C the result of the bitwise AND of register A and value B.*/
        bani: (reg, ins) => reg[ins.c] = reg[ins.a] & ins.b,
        /** borr (bitwise OR register) stores into register C the result of the bitwise OR of register A and register B.*/
        borr: (reg, ins) => reg[ins.c] = reg[ins.a] | reg[ins.b],
        /** bori (bitwise OR immediate) stores into register C the result of the bitwise OR of register A and value B.*/
        bori: (reg, ins) => reg[ins.c] = reg[ins.a] | ins.b,
        /** setr (set register) copies the contents of register A into register C. (Input B is ignored.)*/
        setr: (reg, ins) => reg[ins.c] = reg[ins.a],
        /** seti (set immediate) stores value A into register C. (Input B is ignored.) */
        seti: (reg, ins) => reg[ins.c] = ins.a,
        /** gtir (greater-than immediate/register) sets register C to 1 if value A is greater than register B. Otherwise, register C is set to 0.*/
        grir: (reg, ins) => reg[ins.c] = ins.a > reg[ins.b] ? 1 : 0,
        /** gtri (greater-than register/immediate) sets register C to 1 if register A is greater than value B. Otherwise, register C is set to 0.*/
        gtri: (reg, ins) => reg[ins.c] = reg[ins.a] > ins.b ? 1 : 0,
        /** gtrr (greater-than register/register) sets register C to 1 if register A is greater than register B. Otherwise, register C is set to 0.*/
        gtrr: (reg, ins) => reg[ins.c] = reg[ins.a] > reg[ins.b] ? 1 : 0,
        /** eqir (equal immediate/register) sets register C to 1 if value A is equal to register B. Otherwise, register C is set to 0.*/
        eqir: (reg, ins) => reg[ins.c] = ins.a === reg[ins.b] ? 1 : 0,
        /** eqri (equal register/immediate) sets register C to 1 if register A is equal to value B. Otherwise, register C is set to 0.*/
        eqri: (reg, ins) => reg[ins.c] = reg[ins.a] === ins.b ? 1 : 0,
        /** eqrr (equal register/register) sets register C to 1 if register A is equal to register B. Otherwise, register C is set to 0.*/ 
        eqrr: (reg, ins) => reg[ins.c] = reg[ins.a] === reg[ins.b] ? 1 : 0,
    }

    const confirmedOps = new Map()

    while (Object.keys(opcodes).length > 0) {
        for (let i = 0; i < samples.length; i++) {
            const sample = samples[i]
            const correctOps = []

            Object.entries(opcodes).forEach(([name, exec]) => {
                const result = [...sample.before]
                exec(result, sample.instruction)
                if (JSON.stringify(result) === JSON.stringify(sample.after)) {
                    correctOps.push(name)
                }
            })
    
            if (correctOps.length === 1) {
                confirmedOps.set(sample.instruction.id, opcodes[correctOps[0]])
                delete opcodes[correctOps[0]]
                samples.splice(i, 1)
                i--
            } else if (correctOps.length === 0) {
                samples.splice(i, 1)
                i--
            }
        }
    }
    
    const result = testProgram.reduce((registers, instruction) => {
        const func = confirmedOps.get(instruction.id)
        func(registers, instruction)
        return registers
    }, [0, 0, 0, 0])

    console.log(`After test program the registers are ${result}`)
})()