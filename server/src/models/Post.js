module.exports = (sequelize, dataTypes) => {
    const Post = sequelize.define('Post', {
        title: {
            type: dataTypes.STRING,
        },
        author: {
          type: dataTypes.STRING
        },
        body: {
          type: dataTypes.TEXT
        },
        category: {
          type: dataTypes.STRING
        },
        articleImage: {
          type: dataTypes.BLOB
        },
        // thumbnailTitle: {
        //   type: dataTypes.STRING
        // },
        // thumbNailDescription: {
        //   types: dataTypes.TEXT
        // }
    })

    return Post
}
