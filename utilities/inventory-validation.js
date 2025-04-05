const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}



  /*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.inventoryRules = () => {
    return [
      
      body("inv_make")
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide the manufactory."), // on error this message is sent.
  
      body("classification_id")
        .trim()
        .escape()
        .notEmpty()
        .isInt()
        .withMessage("Please select a correct classification."), // on error this message is sent.
        
      // valid email is required and cannot already exist in the DB
      body("inv_model")
      .escape()
      .notEmpty()
       .isLength({ min: 3 })
      .withMessage("A valid inventory Model is required.") 
      ,
       body("inv_year")
      .trim()
      .escape()
      .notEmpty()
       .isLength({ min: 4 })
      .withMessage("A valid inventory year is required.") 
      ,
       body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("A valid inventory price is required.") 
      ,
       body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
       .isInt()
      .withMessage("A valid inventory Miles is required.") 
      ,

       body("inv_image")
      .trim()
      .notEmpty()
       .isLength({ min: 3 })
      .withMessage("A valid inventory Image is required.") 
      ,

       body("inv_thumbnail")
      .trim()
      .notEmpty()
       .isLength({ min: 3 })
      .withMessage("A valid inventory Image thumbnail is required.") 
      ,
       body("inv_color")
      .trim()
      .escape()
      .notEmpty()
       .isLength({ min: 3 })
      .withMessage("A valid inventory Color is required.") 
      ,
      body("inv_description")
    
      .escape()
      .notEmpty()
       .isLength({ min: 3 })
      .withMessage("A valid inventory Description is required.") 
      ,
    ]
  }



  /*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.newInventoryRules = () => {
    return [
      
      body("inv_make")
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide the manufactory."), // on error this message is sent.
  
      body("classification_id")
        .trim()
        .escape()
        .notEmpty()
        .isInt()
        .withMessage("Please select a correct classification."), // on error this message is sent.
        
      // valid email is required and cannot already exist in the DB
      body("inv_model")
      .escape()
      .notEmpty()
       .isLength({ min: 3 })
      .withMessage("A valid inventory Model is required.") 
      ,
       body("inv_year")
      .trim()
      .escape()
      .notEmpty()
       .isLength({ min: 4 })
      .withMessage("A valid inventory year is required.") 
      ,
       body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("A valid inventory price is required.") 
      ,
       body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
       .isInt()
      .withMessage("A valid inventory Miles is required.") 
      ,

       body("inv_image")
      .trim()
      .notEmpty()
       .isLength({ min: 3 })
      .withMessage("A valid inventory Image is required.") 
      ,

       body("inv_thumbnail")
      .trim()
      .notEmpty()
       .isLength({ min: 3 })
      .withMessage("A valid inventory Image thumbnail is required.") 
      ,
       body("inv_color")
      .trim()
      .escape()
      .notEmpty()
       .isLength({ min: 3 })
      .withMessage("A valid inventory Color is required.") 
      ,
      body("inv_description")
    
      .escape()
      .notEmpty()
       .isLength({ min: 3 })
      .withMessage("A valid inventory Description is required.") 
      ,

       body("inv_id")
        .trim()
        .escape()
        .notEmpty()
        .isInt()
        .withMessage("Please provide the ID ."), // on error this message is sent.
        
    ]
  }



  /*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.classificationRules = () => {
    return [
      
      body("classification_name")
      .trim()
      .escape()
      .notEmpty()
       .isLength({ min: 3 })
      .withMessage("A valid classification name is required."),
    ]
  }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const {  classification_name } = req.body
  let errors = []

  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
   
      req.flash("notice", 'This the classification page.')
     res.render("inventory/add-classification", {
      errors,
       title: "Classification Management",
       nav,
       classification_name,
     })
    return
  }
  next()
}

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
 const { inv_make, classification_id,inv_model, inv_year, inv_price, inv_miles, inv_image, inv_thumbnail, inv_color,inv_description} = req.body
  let errors = []
 
  errors = validationResult(req)
  if (!errors.isEmpty()) {
     let nav = await utilities.getNav()
     const classificationList= await utilities.buildClassificationList(1)
      req.flash("notice", 'This the Inventory page.')
     res.render("inventory/add-inventory", {
       errors,
       title: "Inventory Management",
       nav,
        classificationList,
        inv_make,
         classification_id,
        inv_model,
        inv_year, 
        inv_price,
         inv_miles, 
        inv_image,
         inv_thumbnail, 
         inv_color,
         inv_description
     })
    return
  }
  next()
}

  /* ******************************
 * Check data and return errors or continue to edit inventory
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
 const { inv_make, classification_id,inv_model, inv_year, inv_price, inv_miles, inv_image, inv_thumbnail, inv_color,inv_description, inv_id} = req.body
  let errors = []
 
  errors = validationResult(req)
  if (!errors.isEmpty()) {
     let nav = await utilities.getNav()
     const classificationList= await utilities.buildClassificationList(1)
      req.flash("notice", 'This the Inventory page.')
     res.render("inventory/edit-inventory", {
       errors,
       title: `Edit ${inv_make} ${inv_model}`,
       nav,
        classificationList,
        inv_make,
         classification_id,
        inv_model,
        inv_year, 
        inv_price,
         inv_miles, 
        inv_image,
         inv_thumbnail, 
         inv_color,
         inv_description,
         inv_id
     })
    return
  }
  next()
}


module.exports = validate