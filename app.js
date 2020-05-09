let express = require ('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

let app = express();
const router = require('./router');

const sessionOptions = session({
	secret : "TODO APP is launched",
	store : new MongoStore({client:require('./db')}),
	resave: false,
	saveUninitialized: false,
	cookie:{maxAge:1000*60*60*24,httpOnly:true}
});

app.use(sessionOptions);
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({extended:false}));

function passwordProtected(req,res,next){
	res.set('WWW-Authenticate', 'Basic realm="Simple Todo App"');
	//username = root , password =root
	if (req.headers.authorization == 'Basic cm9vdDpyb290') {
		next();
	} else {
		res.status(401).send('Authentication required');
	}
}

//to all route
app.use(passwordProtected);

//set view directory
app.set('views','views');
app.set('view engine','ejs');
app.use('/',router);

module.exports = app;
