$(document).ready(function(){

			var url = "/javascripts/data.json";
			//write a function that gets avg cost per kilowatt based on region 
			//this 21 cents per kWh was found just via a quick google search 
			//http://www.bls.gov/regions/west/news-release/averageenergyprices_losangeles.htm
			var centsPerKiloWatt = 21;
			//import data.json
			var json = $.ajax({
				async: false,
				dataType: "json",
				url: url
			});
			json.done(function( result ){
				json = result;
			});
			//GRAPH VARIABLES
			//grab graph element for plotly graph
			var graph = document.getElementById("graph"); 
			
			var graphX = Object.keys(json.day_stats).map(function(curVal, ind, arr){
				return new Date(Number(curVal))
			});

			var graphY = [];
			//push day stats dollar conversion to graphY
			for(var key in json.day_stats) {
    			var value = json.day_stats[key];
    			value = convertWattsToDollars(value);
    			graphY.push(value);
			}

			var graphData = [{
				x: graphX,
				y: graphY,
				type: 'bar'
			}];

			var graphLayout = {
				title: "This Month's Energy Spending Per Day",
				xaxis: {title: "Date"},
				yaxis: {title: "Dollars Spent on Energy"}
			};

			//jquery helper function
			jQuery.fn.clickToggle = function( function1, function2 ){
				function callback(){
					[function2,function1][this._tog^=1].call(this);
				}
				return this.on("click", callback);
			}
			
			function convertWattsToDollars( watts ){
				var kw = (watts/1000);
				return "$" + parseFloat(kw * centsPerKiloWatt/100).toFixed(2);
			}
			//mobile// set to toggle between dollars and watts on click
			function clickToggleWattsDollars( jqueryObj, watts ){
				jqueryObj.clickToggle(function(){
					$(this).text(convertWattsToDollars(watts));
				}, 
				function(){
					$(this).text(watts + ' watts');
				}
				);
			}

			function convertEpochToDateStr(  ){
				var epoch = Number($(this).text());
				var date = new Date(epoch);
				date = date.toDateString() + " " + formatTime(date);
				$(this).text(date);
			}

			function formatTime( date ){
				var h = ("00" + date.getHours()).slice(-2);
				var m = ("00" + date.getMinutes()).slice(-2);
				var s = ("00" + date.getSeconds()).slice(-2);
				return h + ":" + m + ":" + s;
			}
			
			$('.convertToDate').each(convertEpochToDateStr);

			function convertDecimalToPercent( ){
				var decimal = Number($(this).text());
				var percent = (decimal * 100).toFixed(1);
				$(this).text(percent);
			}
			
			$('.convertToPercent').each(convertDecimalToPercent);
			//plot graph
			Plotly.plot( graph, graphData, graphLayout);
			//OVERALL Section Event Listeners
			clickToggleWattsDollars( $('#monthTotal'), json.monthly_usage);

			clickToggleWattsDollars( $('#avgDay'), json.average_day);

			clickToggleWattsDollars( $('#avgWkDay'), json.weekday_average);

			clickToggleWattsDollars( $('#avgWkEnd'), json.weekend_average);

			//BEST 3 DAYS Section Event Listeners
			clickToggleWattsDollars( $('#bestDay1Energy'), json.best_three.data[0][1]);

			clickToggleWattsDollars( $('#bestDay2Energy'), json.best_three.data[1][1]);

			clickToggleWattsDollars( $('#bestDay3Energy'), json.best_three.data[2][1]);

			clickToggleWattsDollars( $('#best3Total'), json.best_three.total);


			//WORST 3 DAYS Section Event Listeners
			clickToggleWattsDollars( $('#worstDay1Energy'), json.worst_three.data[0][1]);

			clickToggleWattsDollars( $('#worstDay2Energy'), json.worst_three.data[1][1]);

			clickToggleWattsDollars( $('#worstDay3Energy'), json.worst_three.data[2][1]);

			clickToggleWattsDollars( $('#worst3Total'), json.worst_three.total);
			

		});