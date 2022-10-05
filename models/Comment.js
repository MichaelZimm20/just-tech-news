const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Comment extends Model {}

Comment.init(
  {
    id: {
         // use the special Sequelize DataTypes object provide what type of ata it is 
         type: DataTypes.INTEGER,
         // THIS is the equivalent of SQL's 'NOT NULL' option
         allowNull: false,
         // instruct that this is the Primary Key
         primaryKey: true,
         // turn on auto increment
         autoIncrement: true
    },
    comment_text: {
        type: DataTypes.STRING,
        allowNull: false,
        // if allowNull is set to false, we can run our data through validators before creating the table
        validate: {
            min: 1
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id'
        } 
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'post',
            key: 'id'
        } 
    }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'comment'
  }
);

module.exports = Comment;