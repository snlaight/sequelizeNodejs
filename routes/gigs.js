const express = require('express');
const router = express.Router();
const db = require('../config/db');
const Gig = require('../models/Gig');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


//GET GIG LIST
router.get('/', (req, res) =>
  Gig.findAll()
    .then((gig) => {
      const context = {
        contextGigs: gig.map((gig) => {
          return {
            title: gig.title,
            technologies: gig.technologies,
            budget: gig.budget,
            description: gig.description,
            contact_email: gig.contact_email,
          };
        }),
      };
      res.render('gigs', {
        gigs: context.contextGigs,
      });

      res.render('gigs', {
        gig,
      });
    })
    .catch((err) => console.log(err))
);

//DISPLAY ADD A GIG FORM
router.get('/add', (req, res) => res.render('add'));

//ADD A GIG
router.post('/add', (req, res) => {
  let { title, technologies, budget, description, contact_email } = req.body;
  let errors = [];

  //validate fields
  if (!title) {
    errors.push({ text: 'Please add a title' });
  }
  if (!technologies) {
    errors.push({ text: 'Please add some technologies' });
  }
  if (!description) {
    errors.push({ text: 'Please add a description' });
  }
  if (!contact_email) {
    errors.push({ text: 'Please add a contact email.' });
  }

  // check for errors
  if (errors.length > 0) {
    res.render('add', {
      errors,
      title,
      technologies,
      budget,
      description,
      contact_email,
    });
  } else {
if(!budget){
    budget: 'Unknown';
}else {
    budget: `$${budget}`
}
    //MAKE LOWER CASE AND REMOVE SPACE AFTER COMMA
    technologies= technologies.toLowerCase().replace(/, /g, ',')

    //INSERT INTO TABLE
    Gig.create({
      title: title,
      technologies: technologies,
      description: description,
      budget: budget,
      contact_email: contact_email,
    })
      .then((gig) => res.redirect('/gigs'))
      .catch((err) => console.log(err));
  }
});

//SEARCH FOR GIGS
router.get('/search', (req,res)=>{
   let { term } = req.query;
   Gig.findAll({where: {technologies: { [Op.like]: '%'+ term + '%' } } })
   .then((gig=>{
    const context = {
      contextGigs: gig.map((gig) => {
        return {
          title: gig.title,
          technologies: gig.technologies,
          budget: gig.budget,
          description: gig.description,
          contact_email: gig.contact_email,
        };
      }),
    };
    res.render('gigs', {
      gigs: context.contextGigs,
    });

    res.render('gigs', {
      gig,
    });
  }))
   .catch((err) => console.log(err))
})

module.exports = router;
