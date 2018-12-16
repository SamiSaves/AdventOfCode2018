(() => {
    let recipeCount = document.querySelector('code.puzzle-input').innerText 
    
    let recipes = '3710'
    let elfSnowball = 0
    let elfJangle = 1

    while (true) {
        elfSnowball = elfSnowball + Number(recipes[elfSnowball]) + 1
        while (elfSnowball >= recipes.length) elfSnowball -= recipes.length
        
        elfJangle = elfJangle + Number(recipes[elfJangle]) + 1
        while (elfJangle >= recipes.length) elfJangle -= recipes.length 

        recipes += (Number(recipes[elfSnowball]) + Number(recipes[elfJangle]))

        // Check if the recipe is in recipes once every 100 000 to make things a lot faster
        if (recipes.length % 100000 === 0 && recipes.includes(recipeCount)) break
    }
    
    let result = recipes.split(recipeCount)[0]
    console.log(`Yer result ${result.length}`)
})()
