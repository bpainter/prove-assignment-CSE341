const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('620b11180866cd2c4cb05cdd')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://cse341-db-admin:HLBy2hdhXsaSoDNm@cs341-bp.93yuc.mongodb.net/shop?retryWrites=true&w=majority'
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Bermon',
          email: 'bermon@test.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    // Possible fix for Heroku deploy issue with the Error R1 boot timeout
    const PORT = process.env.PORT | 3000;
    app.listen(PORT, () => {
        console.log(`Server listening on ${PORT}`);
    });
  })
  .catch(err => {
    console.log(err);
  });
