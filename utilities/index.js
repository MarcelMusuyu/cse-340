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

Util.buildForm= function(type){
  let form = `<form id="loginForm" action="/account/login" method="post" name="${type}" >`+
                 
                    `<div class="rows form-row">
                         
                          <div class="col-12 col-md-6">
                            <div class="form-group">
                              <label for="account_email">Email: </label>
                              <input
                              id="account_email" required 
                                type="email"
                                class="form-control"
                                name="account_email"
                                placeholder="Johndoe@gmail.com"
                                value="<%=+ locals.account_email ?? '' %>"
                              />
                            </div>

                            <div class="form-group">
                              <label for="account_password">Password: </label>
                               <div style="position: relative;">
                                
                                  <input id="account_password" name="account_password"
                                  pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$"
                                  title="Passwords must be at least 12 characters and contain at least 1 number, 1 capital letter and 1 special character."
                                  placeholder="0326@1234M" required type="password" class="form-control" value="" />
                                   <span class="password-shown" style="position: absolute; top: 7px; right: 10px;  z-index: 10;  padding: 5px;">👁</span>
                                </div>

                            </div>
                          </div>
                          <div class="col-12 col-md-6">
                            <Span>No Account? </span>
                            <a  href="/account/register">Sign-up</a>
                          </div>
                          <div class="submit-section">
                              <button type="submit" id="checkoutSubmit" class="btn-get-started">
                                LOGIN
                              </button>
                          </div>
                    </div>

                        </form>`
          if(type === "login"){
            return form
          }else{
            form = `<form action="/account/register" method="post" name="${type}">
                      <div class="rows form-row">
                          <div class="col-12 col-md-6">
                            <div class="form-group">
                              <label for="account_firstname">First name </label>

                              <input 
                                type="text" 
                                id="account_firstname"
                                placeholder= "John" 
                                name="account_firstname" 
                               value="<%= locals.account_firstname %>"
                                class="form-control"
                                required>
                            </div>
                          
                            <div class="form-group">
                              <label for="account_lastname">Last name</label>
                              <input id="account_lastname" required
                                type="text"
                                placeholder="Doe"
                                value="<%= locals.account_lastname %>"
                                class="form-control"
                                name="account_lastname"
                              />
                            </div>
                          </div>
                          <div class="col-12 col-md-6">
                            <div class="form-group">
                              <label for="account_email">Email address: </label>
                              <input
                              id="account_email" required 
                                type="email"
                                class="form-control"
                                name="account_email"
                                placeholder="Johndoe@gmail.com"
                                value="<%= locals.account_email %>"
                              />
                            </div>

                            <div class="form-group">
                              <label for="account_password">Password: </label>
                              <div style="position: relative;">
                                <input id="account_password" name="account_password" placeholder="12345@MJ" required type="password"
                                pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$" 
                                  title="Passwords must be at least 12 characters and contain at least 1 number, 1 capital letter and 1 special character." 
                                class="form-control" value="" />
                                <span class="password-shown" style="position: absolute; top: 7px; right: 10px;  z-index: 10;  padding: 5px;">👁</span>
                              </div>

                            </div>
                          </div>
                          <div class="submit-section">
                              <button type="submit" id="checkoutSubmit" class="btn-get-started">
                                REGISTER
                              </button>
                          </div>      
              </div>    
            
            </form>`
            return form
          }
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


Util.buildFormClassification= function(){
  let form = `<form id="classificationForm" action="/inv/addClassification" method="post"  >`+
                 
                    `<div class="rows form-row">
                         
                          <div class="col-12 col-md-6">
                            <div class="form-group">
                              <label for="classification_name">Classification Name: </label>
                              <input
                              id="classification_name" required 
                                type="text"
                                class="form-control"
                                name="classification_name"
                                placeholder="SUV"
                                pattern="^(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{3,}$" 
                                  title="Classification must be at least 3 characters." 
                                value="<%= locals.classification_name %>"
                              />
                            </div>

                            
                          </div>
                          <div class="submit-section">
                              <button type="submit" id="checkoutSubmit" class="btn-get-started">
                                Add Classification
                              </button>
                          </div>
                    </div>

                        </form>`
         
            return form
}



Util.buildFormInventory = async function(){
  let form = `<form id="inventoryForm" action="/inv/addInventory" method="post"  >`+
                 
                    `<div class="rows form-row">
                         
                          <div class="col-12 col-md-6">
                            <div class="form-group">
                              <label for="inv_make">Manufactory: </label>
                              <input
                              id="inv_make" required 
                                type="text"
                                class="form-control"
                                name="inv_make"
                                placeholder="SUV"
                              
                                value="<%= locals.inv_make %>"
                              />
                            </div>`+
                            `
                            <div class="form-group">
                              <label for="classification_name">Classification: </label>
                              ${ await this.buildClassificationList(1)}
                            </div>
                          </div>
                            `
                            +

                            
                          `
                          <div class="col-12 col-md-6">
                            <div class="form-group">
                              <label for="inv_model">Model: </label>
                              <input
                              id="inv_model" required 
                                type="text"
                                class="form-control"
                                name="inv_model"
                                placeholder="Truck"
                               
                                value="<%= locals.inv_model %>"
                              />
                            </div>
                            <div class="form-group">
                              <label for="inv_year">Year: </label>
                              <input
                              id="inv_year" required 
                                type="text"
                                class="form-control"
                                name="inv_year"
                                placeholder="2024"
                                
                                value="<%= locals.inv_year %>"
                              />
                            </div>
                            
                          </div>

                          <div class="col-12 col-md-6">
                            <div class="form-group">
                              <label for="inv_price">Price: </label>
                              <input
                              id="inv_price" required 
                               
                                class="form-control"
                                name="inv_price"
                                placeholder="25000"
                               type="number" min="0" step="1" pattern="\d{1,9}" title="Price must be a positive number with a maximum of 9 digits."
                                value=""
                              />
                            </div>
                            <div class="form-group">
                              <label for="inv_miles">Miles: </label>
                              <input
                              id="inv_miles" required 
                               type="number"
                               min="0" step="1" title="Miles must be a positive integer."
                                class="form-control"
                                name="inv_miles"
                                placeholder="6500"
                                
                                value=""
                              />
                            </div>
                            
                          </div>
                          <div class="col-12 col-md-6">
                            <div class="form-group">
                              <label for="inv_image">Image: </label>
                              <input
                              id="inv_image" required 
                                type="text"
                                class="form-control"
                                name="inv_image"
                                placeholder="Provide an image Path"
                               
                                value="<%= locals.inv_image %>"
                              />
                            </div>
                            <div class="form-group">
                              <label for="inv_thumbnail">Image Thumbnail: </label>
                              <input
                              id="inv_thumbnail" required 
                                type="text"
                                class="form-control"
                                name="inv_thumbnail"
                                placeholder="Provide an image thumbnail path"
                                
                                value="<%= locals.inv_thumbnail %>"
                              />
                            </div>
                            
                          </div>
                          
                          <div class="col-12 col-md-6">
                            <div class="form-group">
                              <label for="inv_color">Color: </label>
                              <input
                              id="inv_color" required 
                               
                                class="form-control"
                                name="inv_color"
                                placeholder="green"
                               type="text" 
                                value="<%= locals.inv_color %>"
                              />
                            </div>
                            <div class="form-group">
                              <label for="inv_description">Description: </label>
                              <textarea
                              id="inv_description" required 
                               
                                rows="5"
                                class="form-control"
                                name="inv_description"
                                placeholder="Provide a Description Here"
                                
                                value="<%= ${locals.inv_description} %>"
                              ></textarea>
                            </div>
                            
                          </div>

                       
                          <div class="submit-section">
                              <button type="submit" id="checkoutSubmit" class="btn-get-started">
                                Add Inventory
                              </button>
                          </div>
                    </div>

                  </form>`
         
            return form
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
