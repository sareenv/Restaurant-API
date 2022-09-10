# Restaurants Managment Microservice
This repository contains resturant managment system project for 340CT Software Quality and Process Managment. The project is developed in the Node.js and follows the modern asynchronous approch rather and avoid the situation of callback hell. 


# Specifications
<ol>
<li> Setting up Node.js and Koa Project. </li>
<li> Hosting and Connection to the MongoDB Atlas Service</li>
<li> Mocked hashing library bcrypt to test and ensure it is working as expected. </li>
<li> Mocked database connection to avoid making actual database calls while still relying on the inmemory mocked datastore service.</li>
<li> ESLint for the static code analysis with the lint configuration used by Airbnb development team.</li> 
<li> Unit Testing with Jest testing framework with the code coverage of 100% </li>
<li> Designed the middlewares to provide the authorisation functionality to the respective kitchen staff member. </li>
<li> Use of Gitflow ~ Github Workflow (NOTE: Branches are no longer maintained and are merged into the master branch).  </li>
</ol>



# Frameworks Used. 
<li> Koa: Similar to the Express with the request and response wrapped in the context object. </li>
<li> ESLint: Static Code Analysis </li>
<li> Bcrypt: Hashing the raw passwords along with salting </li>
<li> JsonWebTokens: For JWT based authentication </li>
<li> Mongod: For connecting and quering to the MongoDB database </li>

