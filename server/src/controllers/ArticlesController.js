const {Post} = require('../models')
const {Tags} = require('../models')

// Tags.remove({}, function(err) { 
//   console.log('collection removed') 
// });
Tags.find().remove().exec();
module.exports = {
  async postArticle (req, res) {
    /* 
      POST REQUEST
      creates Post article from schema and sends the returned
      object if no error - otherwise returns 400 error 
    */
    try {
      console.log('asdasd')
      const article = await Post.create(req.body)
      console.log(article)
      res.send({
          article: article
        })
    }
    catch (err) {
      res.status(400).send({
          error: 'An error has occured trying to create articles',
          details: err
      })
    }
  },
  async index (req, res) {
    /* 
      GET REQUEST
      gets all posts and limits to 12 posts. send array of articles
      if no error -- otherwise sends 400 error 
    */
    try {
      let options = req.body;
      console.log(options)
      const articles = await Post.find().limit(12).sort('-created_at');
      res.send(articles);   
    }
    catch (err) {
      res.status(400).send({
          error: 'An error has occured trying to get articles',
          details: err
      })
    }
  },
  async getTags (req, res) {
    /* 
      GET REQUEST
      gets all tag names 
    */
    try {
      console.log(req.params.tagName)
      const tags = await Tags.find()
      console.log(tags)
      res.send(tags);
    }
    catch (err) {
      res.status(400).send({
          error: `An error has occured trying to get tags`,
          details: err
      })
    }
  },
  async addTags (req, res) {
    /* 
      POST REQUEST
      gets all tags categories 
    */
    try {
      let tags = []
      for(i = 0; i< req.body.length; i++) {
        tags.push(await Tags.create(req.body[i]))
      }
      res.send(tags);
    }
    catch (err) {
      res.status(400).send({
          error: `An error has occured trying to get tags`,
          details: err
      })
    }
  },
  async getArticlesByTag (req, res) {
    /* 
      GET REQUEST
      gets all posts by tag name (tag) and limits to 12 posts. 
      send array of articles if no error -- otherwise sends 400 error 
    */
    try {
      console.log(req.params.tagName)
      const article = await Post.find({
        tags: req.params.tagName
      }).limit(12).sort('-created_at')
      console.log(article)
      res.send(article);
    }
    catch (err) {
      res.status(400).send({
          error: `An error has occured trying to get article tag`,
          details: err
      })
    }
  },
  async previews (req, res) {
    try {
      
    }
    catch (err) {
      res.status(400).send({
        error: 'An error has occured trying to get article previews',
        details: err
    })
    }
  },
  async show (req, res) {
    /* 
      GET REQUEST BY ID
      finds the article by id and sends the reponse if id is valid
      otherwise sends 400 error 
    */
    try {
      const article = await Post.findById(req.params.articleId)
      res.send(article);
    }
    catch (err) {
      res.status(400).send({
          error: 'An error has occured trying to get articles',
          details: err
      })
    }
  },
  async update (req, res) {
    /* 
      PUT REQUEST
      updates article by id and sends the returned response if valid --
      otherwise sends 400 error 
    */
    try {
      const article = await Post.findByIdAndUpdate(
        req.params.articleId,
        req.body,
        {new: true}
      )
      res.send({
        article: article
      });
    }
    catch (err) {
      res.status(400).send({
          error: 'An error has occured trying to update the article',
          details: err
      })
    }
  },
  async delete (req, res) {
    /* */
    try {
      const deleteCount = await Post.deleteOne({
        _id: req.params.articleId
      })
      res.send({
        deleteCount: deleteCount,
        id: req.params.articleId
      })
    }
    catch (err) {
      res.status(400).send({
        error: 'An error has occured trying to delete the article',
        details: err
    })
    }
  }
}