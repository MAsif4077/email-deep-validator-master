const express = require('express');
const EmailValidator = require('./lib/index');
const bodyParser = require('body-parser');
const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const validator = new EmailValidator();
app.get('/', (req, res) => {
  res.render('bulkEmails',{info:''});
})

app.get('/verifysingle', (req, res) => {
    res.render('index',{info:''});
})
app.post('/verifysingle', async (req, res) => {
 var email=req.body.gmail;;
console.log(email);
if (!email) {
    return res.status(400).send('Email parameter is missing');
  }

  const result = await validator.verify(email);
  console.log("result",result);
  res.render('index',{info:result})
});
app.post('/verifybulk', async (req, res) => {
  const email = req.body.emails;
  const lines = email.split(/\n/);
  const output = lines.filter(line => /\S/.test(line)).map(line => line.trim());
  
(async () => {
  const results = [];
  for (const email of output) {
    console.log("email",email);

    const result = await validator.verify(email);
    console.log(`${email}: ${JSON.stringify(result)}`);
    res.write(`${email}: ${JSON.stringify(result)}\n`);
  }
  res.end();
})();

})
app.listen(5000, () => {
  console.log('Server listening on port 5000');
});
