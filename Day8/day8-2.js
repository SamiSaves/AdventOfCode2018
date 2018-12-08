(() => {
    const treeData = document.querySelector('body pre').innerText.slice(0, -1).split(' ').map(Number)

    const recurse = (children, metadata) => {
        const childValues = []
        for (let i = 0; i < children; i++) {
            const children = treeData.splice(0, 1)[0]
            const metadata = treeData.splice(0, 1)[0]
            childValues.push(recurse(children, metadata))
        }

        const metadataValues = treeData.splice(0, metadata)
        if (childValues.length === 0) return metadataValues.reduce((res, val) => res + val, 0)
        
        return metadataValues.reduce((res, meta) => {
            const childValue = childValues[meta-1]
            if (childValue) res += childValue
            return res
        }, 0)
    }

    const rootChildren = treeData.splice(0, 1)[0]
    const rootMetadata = treeData.splice(0, 1)[0]
    const valueOfRoot = recurse(rootChildren, rootMetadata)

    console.log(`Value of root is ${valueOfRoot}`)
})()
