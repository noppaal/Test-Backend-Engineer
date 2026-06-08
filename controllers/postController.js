const { Post, User } = require('../models');

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    return res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching all posts:', error);
    return res.status(500).json({ message: 'An error occurred while fetching posts.' });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    return res.status(500).json({ message: 'An error occurred while fetching the post.' });
  }
};

const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const authorId = req.user.id;

    if (!content) {
      return res.status(400).json({ message: 'Content is required.' });
    }

    const post = await Post.create({
      content,
      authorId
    });

    return res.status(201).json({
      message: 'Post created successfully.',
      post
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ message: 'An error occurred while creating the post.' });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ message: 'Content is required for update.' });
    }

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Authorization check: User must be the author of the post
    if (post.authorId !== userId) {
      return res.status(403).json({ message: 'Unauthorized. You can only update your own posts.' });
    }

    post.content = content;
    await post.save();

    return res.status(200).json({
      message: 'Post updated successfully.',
      post
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return res.status(500).json({ message: 'An error occurred while updating the post.' });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Authorization check: User must be the author of the post
    if (post.authorId !== userId) {
      return res.status(403).json({ message: 'Unauthorized. You can only delete your own posts.' });
    }

    await post.destroy();

    return res.status(200).json({ message: 'Post deleted successfully.' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return res.status(500).json({ message: 'An error occurred while deleting the post.' });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};
