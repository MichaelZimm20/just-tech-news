const User = require('./User');
const Post = require("./Post");
const Vote = require('./Vote');
const Comment = require('./Comment');

 // create associations 
 Vote.belongsTo(User, {
   foreignKey: 'user_id'
 });
 
 Vote.belongsTo(Post, {
   foreignKey: 'post_id'
 });
 
 User.hasMany(Post, {
    foreignKey: 'user_id'
 });

 Post.belongsTo(User, {
    foreignKey: 'user_id'
 });
 
 // create associations for vote
 User.belongsToMany(Post, {
   through: Vote,
   as: 'voted_posts',
   foreignKey: 'user_id'
 });
 
 Post.belongsToMany(User, {
   through: Vote,
   as: 'voted_posts',
   foreignKey: 'post_id'
 });

 // create associations for Comment
 Comment.belongsTo(User, {
  foreignKey: 'user_id'
});

Comment.belongsTo(Post, {
  foreignKey: 'post_id'
});

User.hasMany(Comment, {
  foreignKey: 'user_id'
});

Post.hasMany(Comment, {
  foreignKey: 'post_id'
});
module.exports = { User, Post, Vote, Comment };