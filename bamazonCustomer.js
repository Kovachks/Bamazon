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
		itemBuy(err, res);
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
				console.log("enough")
			} else {
				console.log("not enough")
			}
		})
	})
}	