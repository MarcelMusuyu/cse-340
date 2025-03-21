const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")



const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  
  const data = await invModel.getInventoryByClassificationId(classification_id)
 
  
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  let nav = await utilities.getNav()
  const data = await invModel.getInventoryByInventoryId(inventory_id)
  
  const detail= await utilities.buildView(data)
 
  res.render("inventory/detail", {
    title: data.inv_make + " " + data.inv_model,
    nav,
    detail,
  })
}

invCont.generateError= async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 500){ message = err.message} else {message = 'Oh no! There was a crash. This is an internal server error?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
}
module.exports = invCont