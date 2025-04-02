const invModel = require("../models/inventory-model")

const Util={}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
 

  let list = '<ul id="navigation">'
  list += '<li id="active"><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildView = async function(vehicle){
 
  let view
  if(vehicle.inv_id){
    view = '<ul id="inv-display-details">'
    
      view += '<li class="inv-display-view">'
      view +=  '<a href="/inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_image 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      
      view += '</li>'
      view+= '<li class="inv-display-view">'
      view += '<div >'
      view += '<span> <strong> Price: </strong>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      view += '<hr />'
      view += '<span> <strong>Mileage : </strong>'+new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</span>'
      view += '<span> <strong>Make : </strong>'+vehicle.inv_make + '</span>'
      view += '<span> <strong>Model : </strong>'+vehicle.inv_model + '</span>'
      view += '<span> <strong>Year : </strong>'+vehicle.inv_year + '</span>'
      view += '<span> <strong>Color : </strong>'+vehicle.inv_color + '</span>'
      view+= '<p>'+ vehicle.inv_description+'</p>'
      view += '</div>'
     
      view+= '</li>'
   
    view += '</ul>'
  } else { 
    view += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }

  
  return view
}

Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" class="form-control" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
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


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
