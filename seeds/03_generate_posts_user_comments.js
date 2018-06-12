const { Post, User, Comment } = require('../models')
const mockPosts = require('./data.json')

const random = (arr) => {
  return arr[Math.floor((Math.random() * arr.length))]
}

const main = async () => {
  await Post.deleteMany()
  await User.deleteMany()
  await Comment.deleteMany()
  const users = []
  for (let i = 0; i < 5; i++) {
    await users.push(await User.signup(`user${i}`, `password`))
  }
  for (const mockPost of mockPosts) {
    const post = await Post.create({
      title: mockPost.title,
      content: mockPost.content,
      tags: mockPost.tags,
      authorId: random(users)._id
    })
    const comments = await Comment.create(
      mockPost.comments.map(mockComment => ({
        content: mockComment.content,
        postId: post._id,
        authorId: random(users)._id
      }))
    )
  }
}

main()
  .then(() => { process.exit(0) })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
