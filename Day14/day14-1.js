(() => {
    let recipeCount = Number(document.querySelector('code.puzzle-input').innerText)
    recipeCount += 10

    const recipes = [3, 7, 1, 0]
    let elfSnowball = 0
    let elfJangle = 1

    const getCircularIndex = (current, amount) => {
        while (amount > 0) {
            amount--
            current++
            if (current >= recipes.length) current = 0
        }
        
        return current
    }

    while (recipes.length <= recipeCount) {
        elfSnowball = getCircularIndex(elfSnowball, recipes[elfSnowball] + 1)
        elfJangle = getCircularIndex(elfJangle, recipes[elfJangle] + 1)
        const newRecipes = recipes[elfSnowball] + recipes[elfJangle]; // Does not work without this semicolon
        `${newRecipes}`.split('').forEach(n => recipes.push(Number(n)))
    }
    
    console.log(`Yer result ${recipes.splice(recipes.length - 11, 10).join('')}`)
})()
