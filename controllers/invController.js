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


invCont.viewManagement = async function (req, res, next) {
  
  let nav = await utilities.getNav()
  
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    
  })
}


invCont.createClassification = async function (req, res, next) {
  
  let nav = await utilities.getNav()
  
   req.flash("notice", 'This the classification page.')
  res.render("inventory/add-classification", {
    title: "Classification Management",
    nav,
     errors: null,
  })
}
invCont.createInventory = async function (req, res, next) {
  
  let nav = await utilities.getNav()
  const classificationList= await utilities.buildClassificationList(1)
  
   req.flash("notice", 'This the Inventory page.')
  res.render("inventory/add-inventory", {
    title: "Inventory Management",
    nav,
   classificationList,
     errors: null,
  })
}

invCont.insertClassification = async  function (req, res, next) {
   let nav = await utilities.getNav()
    const { classification_name } = req.body
    try{
        const result= await invModel.addClassification(classification_name)
        if(result){
            req.flash("notice",`Congratulations, the classification 🚗🚓 ${classification_name} 🚑🚛 is successful added.`)  
          res.render("inventory/management", {
            title: "Inventory Management",
            nav,})
        }else{
                    req.flash("notice", 'The classification creation failed, Please check your value.')
            res.render("inventory/add-classification", {
            title: "Classification Management",
            nav,
          
          })
        }
    }catch(error){
      return error.message
    }
}

// inv_make character varying NOT NULL,
	// inv_model character varying NOT NULL,
	// inv_year character(4) NOT NULL,
	// inv_description text NOT NULL,maxlength="4"
	// inv_image character varying NOT NULL,
	// inv_thumbnail character varying NOT NULL,
	// inv_price numeric(9,0) NOT NULL,
	// inv_miles integer NOT NULL,
	// inv_color character varying NOT NULL,
	// classification_id integer NOT NULL,

invCont.insertInventory = async  function (req, res, next) {
  console.log("We are in the insertion inventory")
  let nav = await utilities.getNav()

  const { inv_make,classification_id,inv_model, inv_year, inv_price, inv_miles, inv_image, inv_thumbnail, inv_color,inv_description} = req.body
  try{
     const regResult = await invModel.addInventory(inv_make,classification_id,inv_model,inv_year, 
      inv_price, inv_miles, inv_image, inv_thumbnail, 
      inv_color, inv_description)
    console.log(regResult)
      if (regResult) {
         req.flash("notice",`Congratulations, the inventory ${inv_make} model 🚗🚓 ${inv_model}. is successful added.`)  
          res.render("inventory/management", {
            title: "Inventory Management",
            nav,})
      }else{
         
       const classificationList= await utilities.buildClassificationList(1)
        req.flash("notice", 'This inventory creation failed, Please review your input values.')
        res.render("inventory/add-inventory", {
        title: "Inventory Management",
        classificationList,
        nav,
       
  })
      }

  }catch (error){
    return error.message
  }

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