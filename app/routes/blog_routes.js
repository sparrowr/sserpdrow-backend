// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for blogs
const Blog = require('../models/blog')

// we'll use this to intercept any errors that get thrown and send them
// back to the client with the appropriate status code
const handle = require('../../lib/error_handler')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `res.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /blogs
router.get('/blogs', (req, res) => {
  Blog.find()
    .then(blogs => {
      // `blogs` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return blogs.map(blog => blog.toObject())
    })
    // respond with status 200 and JSON of the blogs
    .then(blogs => res.status(200).json({ blogs: blogs }))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// SHOW
// GET /blogs/5a7db6c74d55bc51bdf39793
router.get('/blogs/:id', requireToken, (req, res) => {
  // req.params.id will be set based on the `:id` in the route
  Blog.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "blog" JSON
    .then(blog => res.status(200).json({ blog: blog.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// CREATE
// POST /blogs
router.post('/blogs', requireToken, (req, res) => {
  // set owner of new blog to be current user
  req.body.blog.owner = req.user.id

  Blog.create(req.body.blog)
    // respond to succesful `create` with status 201 and JSON of new "blog"
    .then(blog => {
      res.status(201).json({ blog: blog.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(err => handle(err, res))
})

// UPDATE
// PATCH /blogs/5a7db6c74d55bc51bdf39793
router.patch('/blogs/:id', requireToken, (req, res) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.blog.owner

  Blog.findById(req.params.id)
    .then(handle404)
    .then(blog => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, blog)

      // the client will often send empty strings for parameters that it does
      // not want to update. We delete any key/value pair where the value is
      // an empty string before updating
      Object.keys(req.body.blog).forEach(key => {
        if (req.body.blog[key] === '') {
          delete req.body.blog[key]
        }
      })

      // pass the result of Mongoose's `.update` to the next `.then`
      return blog.update(req.body.blog)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// DESTROY
// DELETE /blogs/5a7db6c74d55bc51bdf39793
router.delete('/blogs/:id', requireToken, (req, res) => {
  Blog.findById(req.params.id)
    .then(handle404)
    .then(blog => {
      // throw an error if current user doesn't own `blog`
      requireOwnership(req, blog)
      // delete the blog ONLY IF the above didn't throw
      blog.remove()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

module.exports = router
