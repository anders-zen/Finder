const express = require ('express');
const app = express ();
const bodyParser = require ('body-parser');
const port = 3000;
const https = require ('https');

app.use (express.static ('public'));
app.use (bodyParser.urlencoded ({extended: true}));

app.listen (process.env.PORT || port, () => {
  console.log ('Server is serving');
});

app.get ('/', (req, res) => {
  res.sendFile (__dirname + '/signup.html');
});

app.post ('/', (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const phone = req.body.phone;

  const toMailInfo = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
          PHONE: phone,
        },
      },
    ],
  };
  //console.log (toMailInfo.members[0].status);
  const jsonData = JSON.stringify (toMailInfo);

  const url = 'https://us12.api.mailchimp.com/3.0/lists/c44038d013';
  const options = {
    method: 'POST',
    auth: 'Andersen:b531c37fbf9bd893a4d22e8ab4bd0dd1-us12',
  };

  var created;
  var errCount;
  var errEmail = '';

  const request = https.request (url, options, response => {
    //sending request to post on mailchimp
    response.on ('data', data => {
      console.log (JSON.parse (data));
      created = JSON.parse (data).total_created;
      errCount = JSON.parse (data).error_count;
      console.log ('Total Created = ' + created);
      if (errCount === 1) {
        console.log ('email has already been saved -- Thank you!');
        res.sendFile (__dirname + '/failure.html');
      }
      if (created === 1) {
        console.log ('A new entry was created!');
        res.sendFile (__dirname + '/success.html');
      }
    });
  });

  request.write (jsonData);
  request.end ();
});

app.post ('/failure.html', (req, res) => {
  res.sendFile (__dirname + '/signup.html');
});
// api key b531c37fbf9bd893a4d22e8ab4bd0dd1-us12
// audience id c44038d013
