var inquirer = require("inquirer");

var mysql = require("mysql");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "Kihkvc90!",
	database: "bamazon"
});

connection.connect(function(err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId);
	postItems();
});

function postItems() {
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;		
		console.log("-----------Items For Sale-----------")
		for (var i = 0; i < res.length; i++) {
			console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | $" + res[i].price);
		}
		console.log("------------------------------------");
		itemBuy();
	});
};

function itemBuy() {
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
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
		.then(function(answer) {
			if (res[answer.itemToBid - 1].stock_quantity > answer.quantityToBuy) {
				var newQuantity = res[answer.itemToBid - 1].stock_quantity - answer.quantityToBuy;
				var purchasePrice = answer.quantityToBuy * res[answer.itemToBid - 1].price;
				connection.query(
					"UPDATE products SET ? WHERE ?",
					[
						{
							stock_quantity: newQuantity
						},
						{
							item_id: answer.itemToBid
						}
					])
				console.log("----------------------------------------");
				console.log("You have purchased " + answer.quantityToBuy + " " + res[answer.itemToBid - 1].product_name + "s.");
				console.log("The total cost of your purchase is $" + purchasePrice + ".")
				console.log("----------------------------------------");
				inquirer.prompt(
				{
					name: "continue",
					type: "list",
					message: "Would you like to continue?",
					choices: ['Yes', 'No']
				})
				.then(function(answer) {
					if (answer.continue === 'Yes') {
						postItems();
					} else {
						process.exit();
					}
				})
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
					if (answer.continue === 'Yes') {
						postItems();
					} else {
						process.exit();
					}
				})
			}
		})
	})
}