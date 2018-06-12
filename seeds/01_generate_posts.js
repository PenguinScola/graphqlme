const { Post } = require('../models')
const posts = require('./data.json')

const main = async () => {
  await Post.deleteMany()
  for (const post of posts) {
    await Post.create({
      title: post.title,
      content: post.content,
      tags: post.tags,
    })
  }
}

main()
  .then(() => { process.exit(0) })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
