const path = require('path');
const express = require('express');
// const routes = require('./controllers/');
const exphbs  = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3001;

const session = require('express-session');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);



// session setup object
const sess = {
    secret: 'Super secret secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db:sequelize
    })
};


app.use(session(sess));
const helpers = require('./utils/helpers');
const hbs = exphbs.create({ helpers });

// handlebars engine and setup
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// app use
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


// turn on routes
app.use(require('./controllers/'));

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});