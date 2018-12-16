(() => {
    const treeData = document.querySelector('body pre').innerText.slice(0, -1).split(' ').map(Number)

    let totalMetadata = 0
    const collectMetadata = metadata => {
        for (let i = 0; i < metadata; i++) {
            const metadataValue = treeData.splice(0, 1)[0]
            totalMetadata += metadataValue
        }
    }

    const recurse = (children, metadata) => {
        for (let i = 0; i < children; i++) {
            const children = treeData.splice(0, 1)[0]
            const metadata = treeData.splice(0, 1)[0]
            recurse(children, metadata)
        }

        collectMetadata(metadata)
    }


    const rootChildren = treeData.splice(0, 1)[0]
    const rootMetadata = treeData.splice(0, 1)[0]
    recurse(rootChildren, rootMetadata)

    console.log(`Your lisence is: ${totalMetadata}`)
})()
