(() => {
    const rawInput = document.querySelector('pre').innerText.split('\n')
    const ipReg = rawInput.splice(0, 1)[0].match(/\d+/g)[0]
    const instructions = rawInput.map(value => {
        const instruction = value.split(' ')
        return {
            name: instruction[0],
            a: Number(instruction[1]),
            b: Number(instruction[2]),
            c: Number(instruction[3])
        }
    })
    // instructions = [{ name: 'ipset' }, ...instructions]

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

    const registers = [0, 0, 0, 0, 0, 0]
    let ip = 0
    while (ip <= instructions.length) {
        registers[ipReg] = ip
        opcodes[instructions[ip].name](registers, instructions[ip])
        ip = registers[ipReg] + 1
    }

    console.log(`Registers after program ${registers}`)
})()
