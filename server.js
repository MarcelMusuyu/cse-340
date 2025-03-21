/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const inventoryRoute = require('./routes/inventoryRoute'); // Adjust path as needed
const utilities = require("./utilities/")

const baseController = require("./controllers/baseController")

/* ***********************
 * View Engine and Templates
 *************************/


app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/

// Index Route
app.use(static)
app.use('/inv', inventoryRoute) // Correct usage: mount the router at '/inv'



app.get("/", utilities.handleErrors(baseController.buildHome))



// Error-generating route
app.get('/generate-error', (req, res, next) => {
  next({status: 500, message: 'Intentional server error'})
});

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})




/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
   let status = null
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 500){ 
    message = err.message
    status = err.status
   

  } else {message = 'Oh no! There was a crash. This is an internal server error?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav,
    status
  })
})

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  let status= null
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message
    status = err.status
  } else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav,
    status
  })
})



/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`application listening on ${host}:${port}`)
})
