Bamazon ReadMe
================

Bamazon Userflow
----------------

This Bamazon application will mimic the Amazon user interface and allow customers to
purchase items.  When the program is run the items available for purchase will be listed with the following information:

Item_Id | Item Name | Item Department | Item price

The user will then be prompted to enter the ID of the item that they wish to purchase.  If the ID that they enter is not valid they will be notified and will be prompted to enter a different ID.

After an item is selected for purchase the user will then be prompted to ask what quantity
of the item they would like to buy.  Once they enter the quantity that they would like to buy the user will be notified of one of two things:

1. The user will be notified that there is enough stock in order to fulfill their order request and be given the total price of their order.  In this scenario the MySQL database will also be updated to reflect the new stock quantity in the warehouse.

2. The user will be notified that there is not enough stock to fulfill their order request.  The user will also be notified of remaining stock in the warehouse.

After both scenarios the user will then be asked if they would like to continue and look at the list of items to purchase and restart the process.