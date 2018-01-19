//////////////////////////////////////////////////////////
// Module's DOM elements
//////////////////////////////////////////////////////////

var tradesElement = document.querySelector(".trades-content");
var balanceElement = document.querySelector(".balance-content");
var tradeInput = document.querySelector(".input-trade");
var addTradeBtn = document.querySelector(".btn-add-trade");

//////////////////////////////////////////////////////////
// Functions
//////////////////////////////////////////////////////////

function reqListener() {
	var transactions = JSON.parse(this.responseText); // Parse JSON and store in variable
	listTrades(transactions);
	calculateBalance(transactions);
	storeInput(transactions);
}

function validateStringAsNumber(isThisValid) { // Validate number if input support fails and check if field is empty
	return ! (isNaN(isThisValid.value) || isThisValid.value == "");
}

function listTrades(currentTransactionsObject) { // List current trades in JSON
	tradesElement.innerHTML = "";
	for(var i = 0; i < currentTransactionsObject.trades.length; i++) { 
		if(currentTransactionsObject.trades[i] > 0) { // Sort debit or credit for styling
			tradesElement.innerHTML += "<li class='credit-color'>" + "R$ " + currentTransactionsObject.trades[i].toFixed(2) + "</li>";
		} else {
			tradesElement.innerHTML += "<li class='debit-color'>" + "R$ " + currentTransactionsObject.trades[i].toFixed(2) + "</li>";
		}
	}
}

function calculateBalance(currentTransactionsObject) { // Calculate balance
	balanceElement.innerHTML = "<li>" + "R$ " + currentTransactionsObject.trades.reduce(function(a,b) { 
		return a + b;
	}).toFixed(2) + "</li>";
}

function storeInput(currentTransactionsObject) { // Push user input to object and local storage
	addTradeBtn.addEventListener("click", function() { 
		if(validateStringAsNumber(tradeInput) == true) {
			currentTransactionsObject.trades.push(parseFloat(tradeInput.value));
			localStorage.setItem("savedTransactions", JSON.stringify(currentTransactionsObject));
			listTrades(currentTransactionsObject);
			calculateBalance(currentTransactionsObject);
		}
	})
}

//////////////////////////////////////////////////////////
// Load setup
//////////////////////////////////////////////////////////

if(!localStorage.getItem("savedTransactions")) { // Check if local storage is empty
	var oReq = new XMLHttpRequest(); // Import JSON file
	oReq.addEventListener("load", reqListener);
	oReq.open("GET", "http://localhost:8080/transactions.json");
	oReq.send();
} else { // Load current local storage data
	var loadedTransactions = JSON.parse(localStorage.getItem("savedTransactions"));
	listTrades(loadedTransactions);
	calculateBalance(loadedTransactions);
	storeInput(loadedTransactions);
}


