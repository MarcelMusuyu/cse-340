const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */

async function getClassifications(){

    result= await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
   
  return result
}


/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function addInventory(inv_make, classification_id,inv_model, inv_year, inv_price, inv_miles, inv_image, inv_thumbnail, inv_color,inv_description){
    try { 
      const sql = ("INSERT INTO inventory (inv_make,inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id) VALUES ($1, $2, $3, $4,$5, $6,$7,$8,$9,$10) RETURNING *")
      return await pool.query(sql,[inv_make,inv_model,inv_year,inv_description,inv_image, inv_thumbnail, inv_price, inv_miles,inv_color, classification_id])
       } catch (error) {
    return error.message
  }

}

async function addClassification(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

async function getInventoryByInventoryId(inventory_id) {
  try {
    const data= await pool.query(
      `SELECT * FROM public.inventory AS i 
      WHERE i.inv_id = $1`,
      [inventory_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getInventorybyid error " + error)
  }
}

async function updateInventory (inv_id,inv_make, classification_id,inv_model, inv_year, inv_price, inv_miles, inv_image, inv_thumbnail, inv_color,inv_description){
  try { 
    const sql = ("UPDATE inventory SET (inv_make,inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id) = ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) WHERE inv_id = $11 RETURNING *")
    const data =  await pool.query(sql,[inv_make,inv_model,inv_year,inv_description,inv_image, inv_thumbnail, inv_price, inv_miles,inv_color, classification_id, inv_id])
    return data.rows[0]
  } catch (error) {
  return error.message
}
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
 async function deleteInventoryItem(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [inv_id])
  return data
  } catch (error) {
    new Error("Delete Inventory Error")
  }
}

module.exports = {getClassifications, getInventoryByClassificationId,getInventoryByInventoryId, addClassification, addInventory, updateInventory, deleteInventoryItem}