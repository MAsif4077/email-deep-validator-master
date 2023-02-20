const express = require('express');
const EmailValidator = require('./lib/index');
const bodyParser = require('body-parser');
const randomstring = require('randomstring');
const { validate } = require('deep-email-validator');
const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const validator = new EmailValidator();
app.get('/', (req, res) => {
  res.render('bulkEmails',{info:''});
})

app.get('/verifyOne', (req, res) => {
    res.render('index',{info:''});
})
app.post('/verifyOne', (req, res) => {
  try{
    var email=req.body.gmail;
    console.log(email);
    const domain = email.split('@')[1];
    const emailAddress = `${randomstring.generate(10)}@${domain}`;
    console.log(emailAddress);
    validate(emailAddress)
    .then((result) => {
      if(result.valid==true){
        console.log(`Accept All`)
        res.render('index',{info:`${email} is Accept All`});
  
      }else{
          validate(email)
       .then((result) => {
         if(result.valid){
           console.log("Valid");
           res.render('index',{info:`${email} is valid`});
  
         }else{
           console.log("Invalid");
           res.render('index',{info:`${email} is not valid`});
         }
       })
      }
   })
  
   

  }catch(err){
    res.render('index',{info:err});
  }
   })

// app.post('/verifysingle', async (req, res) => {
//  var email=req.body.gmail;
//  console.log(email);
//  const domain = email.split('@')[1];
//  const emailAddress = `${randomstring.generate(10)}@${domain}`;
//  console.log(emailAddress);

// });
app.post('/verifybulk', async (req, res) => {
  const email = req.body.emails;
  const lines = email.split(/\n/);
  const output = lines.filter(line => /\S/.test(line)).map(line => line.trim());
  
(async () => {
  const results = [];
  for (const email of output) {
    console.log("email",email);

    const result = await validator.verify(email);
    if(result.validMailbox){
      console.log(`${email}: is Valid\n`);
      res.write(`${email}: is Valid\n`);
  
     }else{
      console.log(`${email}: is not Valid\n`);
      res.write(`${email}: is not Valid\n`);
  
     }

  }
  res.end();
})();

})
app.listen(5000, () => {
  console.log('Server listening on port 5000');
});
