const express = require ('express');
const router = express.Router ();

router.get ('/', (req, res) => {
  res.sendFile ('signup.html', {root: '__dirname + /../views/'});
});

router.get ('/futureindex', (req, res) => {
  res.render ('index');
});

module.exports = router;
