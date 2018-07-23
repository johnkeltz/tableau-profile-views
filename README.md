# How to: Query Tableau profile api and graph view counts

Tableau Public makes it possible to view an author's work and view counts on their [public profile](https://public.tableau.com/profile/john5005#!/). If we want to summarize an author's view counts, we can [scrape the author's public profile](https://www.ryansleeper.com/tablueprint-2-my-tableau-public-viz-views/), but an alternative solution is to query Tableau's [profile api](https://public.tableau.com/profile/api/john5005/workbooks?count=300&index=0#) to build a graph. This way we can get real-time counts for any profile we want.

Tableau doesn't connect directly to an api without building a web connector, so instead I built a visual in D3. Here's a quick preview:

![](https://raw.githubusercontent.com/johnkeltz/tableau-profile-views/master/images/Tableau%20view%20count%20example.gif)

One caveat: Tableau doesn't have open permissions for this api, so you'll need to use a [CORS extension](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en) to actually use this tool. So- probably not a useful tool for a website, but I also like it as a quick example of how to build a graph from an ajax call in JavaScript.

To build this, first load three libraries- jQuery, c3.js, and d3.js. [C3.js](https://c3js.org/) is a library built on top of d3.js to simplify code for making graphs.

```html
<head>
<title>Tableau Profile Views</title>

	<!-- Load c3.css -->
	<link href="https://apsinsights.org/wp-content/uploads/2018/03/c3.min_.css" rel="stylesheet">

	<!-- Load d3.js and c3.js -->
	<script src="https://apsinsights.org/wp-content/uploads/2018/03/d3.min_.js" charset="utf-8"></script>
	<script src="https://apsinsights.org/wp-content/uploads/2018/03/c3.min_.js"></script>
	
	<!-- Load jquery -->
	<script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>

</head>
```

Next, use html to add an input box and a couple divs that we'll use to attach content with JavaScript:

```html
Enter profile name: 
<input name="profile" type="text" maxlength="256" id="profile" class="searchField"/> <button onclick="getProfile()">Submit</button>

<div id="compare"></div>

<h3>Views by Dashboard</h3>
<div id="chart"></div>
```

Notice that the submit button kicks off the function, **getProfile()**. Here's the javascript to start that function:

```javascript
function getProfile(){

  //get user inputted text
	profile = document.getElementById("profile").value;

	//query tableau public profile api
    $.ajax({url: "https://public.tableau.com/profile/api/" + profile + "/workbooks?count=300&index=0#", success: function(result){		
```

Once we've made a call to the profile, our next step is to pull out the results and reshape them for graphing:

```javascript
//make array of view counts and viz titles
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

  //sort array so that graph will be sorted
  viewData.sort(compare);

  //set graph height based on number of records
  graphHeight = viewData.length*40

  //format arrays to use for c3.js
  titles=[];
  counts =['View Counts'];
  for(i = 0; i < viewData.length; i++){
    titles.push(viewData[i].title);
    counts.push(viewData[i].counts);
  }
```

Now that we have our formatted data, making a [bar graph](https://c3js.org/samples/chart_bar.html) in c3.js is quick:

```
var chart = c3.generate({
	bindto: '#chart', ///attaches chart to our div
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
```

This code builds a graph for one author. Check out the [html file](https://github.com/johnkeltz/tableau-profile-views/tree/master/code) to how to add data from a second author.

Want to try it for yourself? [Try it here](http://htmlpreview.github.io/?https://github.com/johnkeltz/tableau-profile-views/blob/master/code/Tableau%20Profile%20Views%20comparison.html). But remember, you'll need a CORS extension to use it.
