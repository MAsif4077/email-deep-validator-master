const express = require('express');
const EmailValidator = require('./lib/index');
var verifier = require('email-verify');
var infoCodes = verifier.infoCodes;
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
    res.render('index',{flag:''});
})
app.post('/verifysingle', async (req, res) => {
  try{
    var email=req.body.gmail;
    verifier.verify(email, function( err, info ){
      console.log("email",email);
      if( err ) console.log(err);
      else{
        console.log( "Success (T/F): " + info.success );
        console.log( "Info: " + info.info );
        res.render('index',{flag:`${info.info}`})
     
        // //Info object returns a code which representing a state of validation:
     
        // //Connected to SMTP server and finished email verification
        // console.log(info.code === infoCodes.finishedVerification);
     
        // //Domain not found
        // console.log(info.code === infoCodes.domainNotFound);
     
        // //Email is not valid
        // console.log(info.code === infoCodes.invalidEmailStructure);
     
        // //No MX record in domain name
        // console.log(info.code === infoCodes.noMxRecords);
     
        // //SMTP connection timeout
        // console.log(info.code === infoCodes.SMTPConnectionTimeout);
     
        // //SMTP connection error
        // console.log(info.code === infoCodes.SMTPConnectionError)
      }
    });
  

  }catch(err){
    res.render('index',{flag:`${err}`})
  }


})
// app.post('/verifysingle', async (req, res) => {
//  var email=req.body.gmail;
// console.log(email);
// if (!email) {
//     return res.status(400).send('Email parameter is missing');
//   }

//   const result = await validator.verify(email);
//   console.log("result",result);
//   if(result.validMailbox){
//     console.log(`${email} is Valid`)
//     res.render('index',{info:`${email} is Valid`})
//   }else{
//     console.log(`${email} is not Valid`)
//     res.render('index',{info:`${email} is not Valid`})
//   }

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
