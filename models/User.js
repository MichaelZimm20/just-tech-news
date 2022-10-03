const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create out user model
class User extends Model {}


// define the table columns and configuration
User.init(
    {
        // TABLE COLUMN DEFINTIONS GO HERE

        // Define an id column 
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
        // define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // define an email column 
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // there cannot be any duplicate email values in this table
            unique: true,
            // if allowNull is set to false, we can run our data through validators before creating the table
            validate: {
                isEmail: true
            }
        },
        // define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            // if allowNull is set to false, we can run our data through validators before creating the table
            validate: {
                len: [4]
            }
        }

    },
    {
        // TABLE CONFIGURATIONS OPTIONS FO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration))

        // pass in our imported sequelize connection (the direct connection to our database)
        sequelize,
        // don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,
        // don't pluralize name of database table
        freezeTableName: true,
        // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
        underscored: true,
        // make it so our model name stays lowercase in the database
        modelName: 'user'
    }
);

module.exports = User;