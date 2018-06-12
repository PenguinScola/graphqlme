const { Post, User } = require('../models')
const posts = require('./data.json')

const random = (arr) => {
  return arr[Math.floor((Math.random() * arr.length))]
}

const main = async () => {
  await Post.deleteMany()
  await User.deleteMany()
  const users = []
  for (let i = 0; i < 5; i++) {
    await users.push(await User.signup(`user${i}`, `password`))
  }
  for (const post of posts) {
    await Post.create({
      title: post.title,
      content: post.content,
      tags: post.tags,
      authorId: random(users)._id
    })
  }
}

main()
  .then(() => { process.exit(0) })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
