
<script>

function getProfile2(){

	profile2 = document.getElementById("profile2").value;

	//query tableau public profile api
	$.ajax({url: "https://public.tableau.com/profile/api/" + profile2 + "/workbooks?count=300&index=0#", success: function(result){		
		
		var viewData2 = viewData.slice()
	
		//make array of view counts and titles
		for(i = 0; i < result.length; i++){
			var obs = {title: result[i].title, counts: result[i].viewCount, author:profile2}
			viewData2.push(obs)
		}
		
		//function to reverse sort array by an object
		function compare(a,b) {
		  if (a.counts > b.counts)
			return -1;
		  if (a.counts < b.counts)
			return 1;
		  return 0;
		}
		
		//sort array
		viewData2.sort(compare);
		
		
		//set graph height based on number of records
		graphHeight = viewData2.length*40
		
		//make arrays for c3.js
		titles=[];
		counts =['View Counts'];
		colors=[];
		for(i = 0; i < viewData2.length; i++){
			titles.push(viewData2[i].title);
			counts.push(viewData2[i].counts);
			if(viewData2[i].author == profile){colors.push('#006BA4')}
			else{colors.push('#FF800E')}
		}
		
		chart = c3.generate({
			bindto: '#chart',
			size: {
				height: graphHeight
			},
			data: {
				columns: [
					counts
				],
				type: 'bar',
				labels: true,
				color: function (color, d) {
				return colors[d.index];
				}
			},
			axis: {
				x: {
					type: 'category',
					categories: titles
				},
				rotated: true
			}
		});
		
	}});
};

function getProfile(){

	profile = document.getElementById("profile").value;

	//query tableau public profile api
    $.ajax({url: "https://public.tableau.com/profile/api/" + profile + "/workbooks?count=300&index=0#", success: function(result){		

		//make array of view counts and titles
		viewData = []
		for(i = 0; i < result.length; i++){
			var obs = {title: result[i].title, counts: result[i].viewCount, author:profile}
			viewData.push(obs)
		}
		
		//function to reverse sort array by an object
		function compare(a,b) {
		  if (a.counts > b.counts)
			return -1;
		  if (a.counts < b.counts)
			return 1;
		  return 0;
		}
		
		//sort array
		viewData.sort(compare);
		
		//set graph height based on number of records
		graphHeight = viewData.length*40
		
		//make arrays for c3.js
		titles=[];
		counts =['View Counts'];
		for(i = 0; i < viewData.length; i++){
			titles.push(viewData[i].title);
			counts.push(viewData[i].counts);
		}
		
		var chart = c3.generate({
			bindto: '#chart',
			size: {
				height: graphHeight
			},
			data: {
				columns: [
					counts
				],
				type: 'bar',
				labels: true
			},
			axis: {
				x: {
					type: 'category',
					categories: titles
				},
				rotated: true
			}
		});
		
		///add comparison
		document.getElementById("compare").innerHTML = '<br>Comparison profile? <input name="profile2" type="text" maxlength="256" id="profile2" class="searchField"/> <button onclick="getProfile2()">Submit</button>';
		
    }});
}

</script>