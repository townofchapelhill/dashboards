//Gets data from JSON file
$(function() { $.getJSON("data/budget17.json", load); });

//Load function loads the data passed in
function load(data) {
	
	var records = data.records; //Points to array of records in our JSON file
	var expenses = {}; //Creates expenses object
	var revenue = {};  //Creates revenue object
	
	//Loops through the records in JSON file
	for (var i = 0; i < records.length; i++) {
		var record = records[i].fields;
		var account = null;
		//If account type in record = 'revenue', adds to revenue object
		if (record.account_type === "REVENUE") { account = revenue; }
		//If account type in record = 'expense', adds to expense object
		else if (record.account_type === "EXPENSE") { account = expenses; }
		else { continue; }
		
		//Create a new fund record if we haven't seen it before
		if (!account[record.fund]) {
			account[record.fund] = {"label": record.fund, "value": record["fy17_original_budget"], "items": []};
		}
		//Otherwise add to the existing record for that fund
		else {
			account[record.fund].value += record["fy17_original_budget"]
		}
		//Shows us the subrecords within selected records
		var group = account[record.fund];
		var val = record["fy17_original_budget"];
		if (val <= 0) continue;
		var label = "";
		if (record.category != undefined) label = record.category;
		if (record.department != undefined) label += " . " + record.department;
		if (record.division != undefined) label += " . " + record.division;
		group.items.push({"label": label, "value": val});
	}
	
	//Converts objects into an array that d3pie can parse
	expenseArray = $.map(expenses, function(value, index) {
	    return [value];
	});
	//Converts objects into an array that d3pie can parse
	revenueArray = $.map(expenses, function(value, index) {
	    return [value];
	});
	
	//calls main function to display pie chart
	main();
}

var chart = null;

//Executes when you click a slice in the Regular/'main face' chart
//info - The slice that user clicks on.
function dive(info) {
	pie(info.data.label + " BREAKDOWN", info.data.items, main)
}
	
//Regular, 'main face' of pie chart that displays budget breakdown for expenses
function main() {
	//calls 'pie' function and creates our graph
	pie("2017 Budget Expense Breakdown", expenseArray, dive)
}

//pie function creates our graph given some parameters
//title - title given to chart
//content - list of items for chart to display (an array)
//callback - a function that executes when you click it (can loop back and forth between main and dive)
function pie(title, content, callback) {
	if (chart) chart.destroy();
	chart = new d3pie("chart", {
		"header": {
			"title": {
				"text": title,
				"fontSize": 24,
				"font": "open sans"
			},
		},
		"footer": {
			"color": "#999999",
			"fontSize": 10,
			"font": "open sans",
			"location": "bottom-left"
		},
		"size": {
			"canvasHeight": 800,
			"canvasWidth": 800,
			"pieInnerRadius": "50%",
			"pieOuterRadius": "70%"
		},
		"data": {
			"sortOrder": "value-desc",
			"content": content
		},
		"labels": {
			"outer": {
				"pieDistance": 32
			},
			"mainLabel": {
				"fontSize": 11
			},
			"percentage": {
				"color": "#ffffff",
				"decimalPlaces": 0
			},
			"value": {
				"color": "#adadad",
				"fontSize": 11
			},
			"lines": {
				"enabled": true
			},
			"truncation": {
				"enabled": true
			}
		},
		"tooltips": {
			"enabled": true,
			"type": "placeholder",
			"string": "{label}: {value}, {percentage}%",
			"styles": {
				"backgroundOpacity": 1
			}
		},
		"misc": {
			"gradient": {
				"enabled": true,
				"percentage": 100
			}
		},
		"callbacks": {
			"onClickSegment": callback
		}
	});
}
