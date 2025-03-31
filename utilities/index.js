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
  let form = `<form action="/account/login" method="post" name="${type}" >`+
                 
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
                                value=""
                              />
                            </div>

                            <div class="form-group">
                              <label for="account_password">Password: </label>
                               <div style="position: relative;">
                                
                                  <input id="account_password" name="account_password"
                                  pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$"
                                  title="Passwords must be at least 12 characters and contain at least 1 number, 1 capital letter and 1 special character."
                                  placeholder="0326@1234M" required type="password" class="form-control" value="" />
                                   <span id="password-shown" style="position: absolute; top: -25px; right: -5px;   padding: 5px;">👁</span>
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
                               
                                class="form-control"
                                required>
                            </div>
                          
                            <div class="form-group">
                              <label for="account_lastname">Last name</label>
                              <input id="account_lastname" required
                                type="text"
                                placeholder="Doe"
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
                                value=""
                              />
                            </div>

                            <div class="form-group">
                              <label for="account_password">Password: </label>
                              <div style="position: relative;">
                                <input id="account_password" name="account_password" placeholder="12345@MJ" required type="password"
                                pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$" 
                                  title="Passwords must be at least 12 characters and contain at least 1 number, 1 capital letter and 1 special character." 
                                class="form-control" value="" />
                                <span id="password-shown" style="position: absolute; top: -25px; right: -5px;   padding: 5px;">👁</span>
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



/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
