const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")



const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  
  const data = await invModel.getInventoryByClassificationId(classification_id)
 
  if(data.length > 0){
      const grid = await utilities.buildClassificationGrid(data)
      let nav = await utilities.getNav()
      const className = data[0].classification_name
      res.render("inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
      })
  } else{
      let nav = await utilities.getNav()
      req.flash("notice", "Sorry, no vehicles were returned.")
      res.render("inventory/classification", {
        title: "Classification Vehicles",
        nav,
        grid: null,
      })
  }
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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect
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


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

// This function is built to edit or update an existing inventoty
invCont.editInventory = async (req, res, next) => {
  let nav = await utilities.getNav()
  const inventory_id = parseInt(req.params.inventory_id)
  const itemData= await invModel.getInventoryByInventoryId(inventory_id)

  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  const classificationList= await utilities.buildClassificationList(1)
  
   req.flash("notice", 'This the Edit Inventory page.')
  res.render("inventory/edit-inventory", {
   title: "Edit " + itemName,
    nav,
   classificationList,
     errors: null,
     inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

invCont.updateInventory = async (req, res, next) => { 
  let nav = await utilities.getNav()
  const {inv_id, inv_make,classification_id,inv_model, inv_year, inv_price, inv_miles, inv_image, inv_thumbnail, inv_color,inv_description} = req.body

  try{
     const updateResult = await invModel.updateInventory(inv_id,inv_make,classification_id,inv_model,inv_year, 
      inv_price, inv_miles, inv_image, inv_thumbnail, 
      inv_color, inv_description)
   
      if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
      }

  }catch (error){
    return error.message
  }

}

invCont.deleteInventory = async (req, res, next) => {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.params.inventory_id)
  const result =await invModel.getInventoryByInventoryId(inv_id)
 
  if (result) {
    req.flash("notice", "This is the deleted inventory page.")
    res.render("inventory/delete-confirm", {
      title: "Delete Inventory",
      nav,
      errors: null,
      inv_id: result.inv_id,
      inv_make: result.inv_make,
      inv_model: result.inv_model,
      inv_price: result.inv_price,
      inv_year: result.inv_year,
    })
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/management", {
      title: "Inventory Management",
      nav,
    })
  }
}

invCont.deleteInventoryConfirm = async (req, res, next) => {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)
  const result = await invModel.deleteInventoryItem(inv_id)
  if (result) {
    req.flash("notice", "The inventory was successfully deleted.")
    res.redirect("/inv/")
  } else {

    const result =await invModel.getInventoryByInventoryId(inv_id)
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/inventory/delete-confirm", {
      title: "Inventory Management",
      nav,
      errors: null,
      inv_id: result.inv_id,
      inv_make: result.inv_make,
      inv_model: result.inv_model,
      inv_price: result.inv_price,
      inv_year: result.inv_year,
    })
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