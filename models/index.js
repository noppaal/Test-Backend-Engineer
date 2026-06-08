const { sequelize } = require('../config/db');
const User = require('./User');
const Post = require('./Post');

// Define associations
User.hasMany(Post, { foreignKey: 'authorId', as: 'posts', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

module.exports = {
  sequelize,
  User,
  Post
};
