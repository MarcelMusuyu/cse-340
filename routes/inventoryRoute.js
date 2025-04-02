// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:inventoryId", invController.buildByInventoryId)
router.get("/", utilities.handleErrors(invController.viewManagement))
router.get("/addClassification", utilities.handleErrors(invController.createClassification))
router.get("/addInventory", utilities.handleErrors(invController.createInventory))
router.post("/addClassification", regValidate.classificationRules() , regValidate.checkClassificationData, utilities.handleErrors(invController.insertClassification))
router.post("/addInventory",regValidate.inventoryRules, regValidate.checkInventoryData, utilities.handleErrors(invController.insertInventory))

router.get("/generate-error", invController.generateError)

module.exports = router