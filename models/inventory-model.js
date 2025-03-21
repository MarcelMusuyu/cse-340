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


module.exports = {getClassifications, getInventoryByClassificationId,getInventoryByInventoryId}