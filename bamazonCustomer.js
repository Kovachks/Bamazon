//Requiring inquirer npm package
var inquirer = require("inquirer");

//requiring mysql npm package
var mysql = require("mysql");

//variable for connecting to MySQL server
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "bamazon"
});


//Establishing connection to MySQL server
connection.connect(function(err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId);
	postItems();
});

//Function for posting items listed in MySQL server
function postItems() {

	//sending a request to the server to select the information located in the products table
	connection.query("SELECT * FROM products", function(err, res) {

		//If there is an error in the connection throw the error
		if (err) throw err;		

		//Otherwise begin the item posting process
		console.log("-----------Items For Sale-----------")
		
		//Loop used for listing the item ID, product name, department, and price for all products stored in MySQL database
		for (var i = 0; i < res.length; i++) {
			console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | $" + res[i].price);
		}
		console.log("------------------------------------");

		//After completion of loop we will run the itemBuy function which will begin the purchasing process for the customer
		itemBuy();
	});
};

//function used to purchase an item from MySQL database
function itemBuy() {

	//sending a request to the server to select the information located in the products table
	connection.query("SELECT * FROM products", function(err, res) {

		//If there is an error in the connection throw the error
		if (err) throw err;

		//Prompt the user 2 questions.  First being to enter the id of the item they would like to purchase.  The second being the quantity that they would like to purchase
		inquirer.prompt([
			{
				name: "itemToBid",
				type: "input",
				message: "Please enter the id of the item would you like to purchase."
			},
			{
				name: "quantityToBuy",
				type: "input",
				message: "How many units to buy?"
			}
		])

		//Logging answers after user responds
		.then(function(answer) {

			//If the quantity in stock of the item that the user would like to purchase is greater then the quantity that the user wants to buy then we will run this portion of the function.
			if (res[answer.itemToBid - 1].stock_quantity > answer.quantityToBuy) {
				
				//Creating a variable which will store the new quantity that we will later upload to our server
				var newQuantity = res[answer.itemToBid - 1].stock_quantity - answer.quantityToBuy;

				//Creating a variable which will store the total purchase price of the users purchase
				var purchasePrice = answer.quantityToBuy * res[answer.itemToBid - 1].price;

				//Establishing a connection to the server in order to update the new quantity after purchase
				connection.query(
					"UPDATE products SET ? WHERE ?",
					[
						{
							//Setting the quantity to the new quantity
							stock_quantity: newQuantity
						},
						{
							//At the location of the id of the item that was bid on
							item_id: answer.itemToBid
						}
					])

				//Console logging the output message to the customer
				console.log("----------------------------------------");

				//Logging the quantity and the product name of the item that was purchased
				console.log("You have purchased " + answer.quantityToBuy + " " + res[answer.itemToBid - 1].product_name + "s.");
				
				//Logging the total purchase price of the items that were purchased
				console.log("The total cost of your purchase is $" + purchasePrice + ".")
				console.log("----------------------------------------");
				
				//Beginning of a prompt asking the user if they would like to continue or not.
				inquirer.prompt(
				{
					name: "continue",
					type: "list",
					message: "Would you like to continue?",
					choices: ['Yes', 'No']
				})
				.then(function(answer) {

					//If they answer yes then restart the entire application
					if (answer.continue === 'Yes') {
						postItems();

					//If the answer is anything else exit out of the application	
					} else {
						process.exit();
					}
				})

			//If there is insufficient quantity available we will notify the user and ask them if they would like to restart the application
			} else {
				console.log("Insufficient quantity!");
				console.log("------------------------------------");
				inquirer.prompt(
				{
					name: "continue",
					type: "list",
					message: "Would you like to continue?",
					choices: ['Yes', 'No']
				})
				.then(function(answer) {

					//If they answer yes then restart the entire application
					if (answer.continue === 'Yes') {
						postItems();
						
					//If the answer is anything else exit out of the application		
					} else {
						process.exit();
					}
				})
			}
		})
	})
}