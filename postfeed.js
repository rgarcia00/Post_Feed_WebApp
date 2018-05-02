// Insert the click counter on top of the page.
d3.select('#click-counter').append('span')
	.text('Click Counter: ' + get_counter());

// Request post data from server.
fetch('https://jsonplaceholder.typicode.com/posts')
	.then(response => response.json())
	.then(json => build_feed(json));

function build_feed(post_list) {
	// Sort post list by id.
	post_list.sort(function(a, b) { return a['id'] > b['id']; });

	// Create one div for each post.
	post_divs = d3.select('#feed').selectAll('.post')
		.data(post_list, function(d) { return d['id']})
	.enter().append('div')
		.attr('class', 'post')
		.attr('id', function(d) { return 'post_id' + d['id']; });

	// Append to the div a span with the post title. Add CSS attributes with D3js.
	post_divs.append('span')
		.attr('class', 'title')
		.text(function(d) { return d['title']; })
		.style('background-color', "darkblue")
		.style('font-size', '20px')
		.style('color', 'white');

	post_divs.append('br');

	post_divs.append('span')
		.attr('class', 'user')
		.text(function(d) { return 'user id: ' + d['userId']; });

	post_divs.append('br');

	post_divs.append('span')
		.attr('class', 'body')
		.text(function(d) { return d['body']});

	post_divs.append('br');

	// Append to the div an input button to show the comments.
	post_divs.append('input')
		.attr('name', function(d) { return 'comment_button_' + d['id']; })
		.attr('type', 'button')
		.attr('value', 'show comments')
		.on('click', function(d) { // Event callback.
			if (d3.select(this).attr('value') == 'show comments') {
				// Request the comments from the server and show them in the front-end.
				fetch('https://jsonplaceholder.typicode.com/posts/' + d['id'] + '/comments')
					.then(response => response.json())
					.then(json => show_comments(d, json));

				d3.select(this).attr('value', 'hide comments');
			} else {
				// Remove comments from the front-end.
				hide_comments(d);

				d3.select(this).attr('value', 'show comments');
			}

			increment_click_counter();
		});

	// Append input button to delete post.
	post_divs.append('input')
		.attr('name', function(d) { return 'delete_button_' + d['id']; })
		.attr('type', 'button')
		.attr('value', 'delete')
		.on('click', function(d) { 
			delete_post(d);
			increment_click_counter();
		});


	// Div where comments will be attached.
	post_divs.append('div')
		.attr('class', 'comment_div');

	post_divs.append('br');
	post_divs.append('br');
}

function show_comments(post, comments) {
	comment_div = d3.select('#post_id' + post['id']).selectAll('.comment_div');

	// Fills comment div with a p element for each comment. Adds name, email and body.
	comment_p = comment_div.selectAll('.comments')
		.data(comments, function(d) { return d['id']; })
	.enter().append('p')
		.attr('class', 'comments');

	comment_p.append('span')
		.text(function(d) { return 'name: ' + d['name']; });

	comment_p.append('br');

	comment_p.append('span')
		.text(function(d) { return 'email: ' + d['email']; });

	comment_p.append('br');

	comment_p.append('span')
		.text(function(d) { return 'body: ' + d['body']; });
}

// Remove all p elements in the comment div.
function hide_comments(post) {
	d3.select('#post_id' + post['id']).selectAll('.comment_div').selectAll('.comments').remove('*');
}

// Remove post div and all child elements.
function delete_post(post) {
	d3.select('#post_id' + post['id']).remove('*');

	// Send delete request to server.
	fetch('https://jsonplaceholder.typicode.com/posts/' + post['id'], {
  		method: 'DELETE'
	})
}

// Increment click counter on cookies.
function increment_click_counter() {
	var new_value = parseInt(get_counter()) + 1;
	document.cookie = 'click-counter=' + new_value;

	d3.select('#click-counter').select('span')
		.text('Click Counter: ' + new_value);
}

// Get counter from cookies.
function get_counter(cname) {
	var cookie_name = 'click-counter=';
	var cookies = document.cookie.split(';');
	
	for(var i = 0; i < cookies.length; i++) {
		var c = cookies[i];
		
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}

		if (c.indexOf(cookie_name) == 0) {
			return c.substring(cookie_name.length, c.length);
		}
	}
	
	return "0";
}