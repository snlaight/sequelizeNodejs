const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./config/db')
//TEST DB
db.authenticate().then(()=> console.log('Database connected')).catch(()=>console.log('Error'+ err))

const app = express();

//HANDLEBARS
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//body parser
app.use(bodyParser.urlencoded({ extended: false }));

//SET STATIC FOLDER
app.use(express.static(path.join(__dirname,'public')));


//index route
app.get('/', (req,res)=>res.render('index', { layout:'landing' }));

//GIG ROUTES
app.use('/gigs',require('./routes/gigs'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
