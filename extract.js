var baseFee = 735000;
var memPoolUrl = "http://localhost:8125/burst?requestType=getUnconfirmedTransactions";
var memPool = JSON.parse(Get(memPoolUrl));

function Get(url) {
		var Httpreq = new XMLHttpRequest();
		Httpreq.open("GET", url, false);
		Httpreq.send(null);
		return Httpreq.responseText;
}

window.onload = function(){
	let txData   = extractTxData();
	var feeSlots = txData[0];
	var txTypes  = txData[1];
	var ucTxs    = txData[2]
	var bestFee  = calculateMinimums(feeSlots);

	update(feeSlots, txTypes, ucTxs, bestFee);
		/* ORIGINALLY HAD SOME VISUALS; REMOVED FOR NOW

		function drawChart() {
			var bestFeePercentage = (calculateMinimums(feeSlots) / 749700000) * 100;
			var congestionPercentage = (memPool.unconfirmedTransactions.length / 1020) * 100;

			var feeData = google.visualization.arrayToDataTable([
		    	['Label', 'Value'],
		    	['Best Fee', bestFeePercentage],
		    ]);
		    var congestionData = google.visualization.arrayToDataTable([
		    	['Label', 'Value'],
		    	['Congestion', congestionPercentage]
		    ]);
		    var options = {
		    	width: 500, height: 150,
		    	redFrom: 66, redTo: 100,
		    	yellowFrom: 33, yellowTo: 66,
		    	greenFrom: 0, greenTo: 33,
		    	minorTicks: 3
		    };
		    var feeChart = new google.visualization.Gauge(document.getElementById('fee-guage'));
		    feeChart.draw(feeData, options);

		    var congestionChart = new google.visualization.Gauge(document.getElementById('congestion-guage'));
		    congestionChart.draw(congestionData, options);
	}
	google.charts.load('current', {'packages':['gauge']});
	google.charts.setOnLoadCallback(drawChart);
	*/
}

function extractTxData() {
	let feeSlots = {};
	let txTypes  = {
		payments: {
			ordinary: 0,
			multiout: 0,
			multioutSame: 0
		},
		messaging: {
			message: 0,
			aliasAssign: 0,
			accountInfo: 0,
			aliasSell: 0,
			aliasBuy: 0
		},
		coloredCoins: {
			issue: 0,
			transfer: 0,
			askPlacement: 0,
			bidPlacement: 0,
			askCancel: 0,
			bidCancel: 0
		},
		digitalGoods: {
			list: 0,
			delist: 0,
			priceChange: 0,
			quantityChange: 0,
			purchase: 0,
			delivery: 0,
			feedback: 0,
			refund: 0
		},
		accountControl: {
			leaseBalance: 0
		},
		mining: {
			rewardRecipient: 0
		},
		advnacedPayment: {
			escrowCreation: 0,
			escrowSign: 0,
			escrowResult: 0,
			subscriptionSubscribe: 0,
			subscriptionCancel: 0,
			subscriptionPayment: 0
		},
		automatedTransactions: {
			creation: 0,
			payment: 0
		}};
	let ucTxs    = [];

	//Loop through transactions in mempool
	for(let i = 0; i < memPool.unconfirmedTransactions.length; i++) {
		
		//Parse transaction fee slots
		slot = Math.floor(memPool.unconfirmedTransactions[i].feeNQT / baseFee) * baseFee;
		if(slot > 1020 * baseFee) {
			slot = 1020 * baseFee
		}
		if(feeSlots[slot]) {
			feeSlots[slot]++;
		} else {
			feeSlots[slot] = 1;
		}
	
		//Parse transaction types
		switch(memPool.unconfirmedTransactions[i].type) {
			case 0:
				switch(memPool.unconfirmedTransactions[i].subtype) {
					case 0:
						txTypes.payments.ordinary++;
						break;
					case 1:
						txTypes.payments.multiout++;
						break;
					case 2:
						txTypes.payments.multioutSame += 1;
						break;
				}
				break;
			case 1:
				switch(memPool.unconfirmedTransactions[i].subtype) {
					case 0:
						txTypes.messaging.message += 1;
						break;
					case 1:
						txTypes.messaging.aliasAssign += 1;
						break;
					case 5:
						txTypes.messaging.accountInfo += 1;
						break;
					case 6:
						txTypes.messaging.aliasSell += 1;
						break;
					case 7:
						txTypes.messaging.aliasBuy += 1;
						break;
				}
				break;
			case 2:
				switch(memPool.unconfirmedTransactions[i].subtype) {
					case 0:
						txTypes.coloredCoins.issue += 1;
						break;
					case 1:
						txTypes.coloredCoins.transfer += 1;
						break;
					case 2:
						txTypes.coloredCoins.askPlacement += 1;
						break;
					case 3:
						txTypes.coloredCoins.bidPlacement += 1;
						break;
					case 4:
						txTypes.coloredCoins.askCancel += 1;
						break;
					case 5:
						txTypes.coloredCoins.bidCancel += 1;
						break;
				}
				break;
			case 3:
				switch(memPool.unconfirmedTransactions.subtype) {
					case 0:
						txTypes.digitalGoods.list += 1;
						break;
					case 1:
						txTypes.digitalGoods.delist += 1;
						break;
					case 2:
						txTypes.digitalGoods.priceChange += 1;
						break;
					case 3:
						txTypes.digitalGoods.quantityChange += 1;
						break;
					case 4:
						txTypes.digitalGoods.purchase += 1;
						break;
					case 5:
						txTypes.digitalGoods.delivery += 1;
						break;
					case 6:
						txTypes.digitalGoods.feedback += 1;
						break;
					case 7:
						txTypes.digitalGoods.refund += 1;
						break;
				}
				break;
			case 4:
				txTypes.accountControl.leaseBalance += 1;
				break;
			case 20:
				txTypes.mining.rewardRecipient += 1;
				break;
			case 21:
				switch(memPool.unconfirmedTransactions.subtype) {
					case 0:
						txTypes.advnacedPayment.escrowCreation += 1;
						break;
					case 1:
						txTypes.advnacedPayment.escrowSign += 1;
						break;
					case 2:
						txTypes.advnacedPayment.escrowResult += 1;
						break;
					case 3:
						txTypes.advnacedPayment.subscriptionSubscribe += 1;
						break;
					case 4:
						txTypes.advnacedPayment.subscriptionCancel += 1;
						break;
					case 5:
						txTypes.advnacedPayment.subscriptionPayment += 1;
						break;
				}
				break;
			case 22:
				switch(memPool.unconfirmedTransactions.subtype) {
					case 0:
						txTypes.automatedTransactions.creation += 1;
						break;
					case 1:
						txTypes.automatedTransactions.payment += 1;
						break;
				}
			break;
		}

		//Parse unique transaction info
		let tx = memPool.unconfirmedTransactions[i];
		let transaction = {
				senderRS: tx.senderRS,
				senderNumId: tx.sender,
				recipientRS: tx.recipientRS,
				amount: (tx.amountNQT / 100000000).toFixed(4),
				fee: tx.feeNQT,
				broadcasted: tx.ecBlockHeight
		}
		for(let field in transaction) {
			if(transaction[field] === undefined) {
				transaction[field] = "N/A"
			}
		}
		ucTxs.push(transaction);
	}
	return[feeSlots, txTypes, ucTxs];
}

function calculateMinimums(feeSlots) {
	let bestFee = 735000;

	//Instant - beat best fee by 735000, or by 1 if best fee >= 749700000
	for(let slot in feeSlots) {
		if(parseInt(slot) > bestFee && bestFee === 749700000) {
			bestFee = parseInt(slot) + 1;
		}
		else if(parseInt(slot) > bestFee) {
			bestFee = parseInt(slot) + 735000;
		}
	}
	return bestFee;
}

function update(feeSlots, txTypes, ucTxs, bestFee) {
	//Update transaction fee slots
	for(let feeSlot in feeSlots){
		var slot = document.createElement("div");
		slot.innerHTML = feeSlot;
		document.getElementsByClassName("slots")[0].appendChild(slot);
		
		var slotUnconfirmed = document.createElement("div");
		slotUnconfirmed.innerHTML = feeSlots[feeSlot];
		document.getElementsByClassName("num-unconfirmed")[0].appendChild(slotUnconfirmed);
	}

	//Update transaction types
	for(let type in txTypes) {
		for(let subtype in txTypes[type]) {
			if(txTypes[type][subtype] > 0) {
				var txType = document.createElement("div");
				txType.innerHTML = subtype;
				document.getElementsByClassName("tx-types")[0].appendChild(txType);
				
				var txTypeUnconfirmed = document.createElement("div");
				txTypeUnconfirmed.innerHTML = txTypes[type][subtype];
				document.getElementsByClassName("tx-types-waiting")[0].appendChild(txTypeUnconfirmed);
			}
		}
	}


	//Update unique transaction list
	for(let i = 0; i < ucTxs.length; i++) {
		var sender = document.createElement("div");
		var exploreSender = document.createElement("a");
		exploreSender.setAttribute('href', `https://explore.burst.cryptoguru.org/account/${ucTxs[i].senderNumId}`)
		exploreSender.innerHTML = ucTxs[i].senderRS;
		sender.appendChild(exploreSender);
		document.getElementsByClassName("sender")[0].appendChild(sender);
		
		var recipient = document.createElement("div");
		recipient.innerHTML = ucTxs[i].recipientRS;
		document.getElementsByClassName("recipient")[0].appendChild(recipient);

		var amount = document.createElement("div");
		amount.innerHTML = ucTxs[i].amount;
		document.getElementsByClassName("amount")[0].appendChild(amount);
		
		var fee = document.createElement("div");
		fee.innerHTML = ucTxs[i].fee;
		document.getElementsByClassName("fee")[0].appendChild(fee);

		var broadcasted = document.createElement("div");
		broadcasted.innerHTML = ucTxs[i].broadcasted;
		document.getElementsByClassName("broadcasted")[0].appendChild(broadcasted);
	}

}