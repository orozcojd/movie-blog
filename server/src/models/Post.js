module.exports = (sequelize, dataTypes) => {
    const Post = sequelize.define('Post', {
        title: {
            type: dataTypes.STRING,
        },
        author: {
          type: dataTypes.STRING
        },
        category: {
          type: dataTypes.STRING
        },
        articleImage: {
          type: dataTypes.BLOB
        }

    })

    return Post
}
