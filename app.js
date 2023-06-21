const express = require('express');
const app = express();
const request = require('request');
const mailchimp = require("@mailchimp/mailchimp_marketing");

require('dotenv').config();

mailchimp.setConfig({
  apiKey: "afc116255f801d7ea3031531301e3ad6-us12",
  server: 'us12'
})

app.use(require('body-parser').urlencoded({ extended: true }));
app.use(express.static('public'));
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/signup.html');
})

const port = process.env.PORT || 3000;

app.listen(port,()=> {
    console.log('listening on '+port);
});

app.post('/',async (req,res)=>{
    const user = req.body;
    console.log(user);
    const listId = "f231bbefcf";

    try {
      const response =await mailchimp.lists.addListMember(listId, {
        email_address: user.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: user.fname,
          LNAME: user.lname
        }
      })
  
      console.log(`This user's subscription status is ${response.status}.`);
      res.sendFile(__dirname+'/success.html')
    } catch (e) {
      var message = JSON.parse(e.response.text);
      res.send(message.detail)
    }

    
});

// f231bbefcf id
// afc116255f801d7ea3031531301e3ad6-us12 api key