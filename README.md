## What
A jquery plugin for associating DOM elements with handlebar
templates in a way that supports the typical use cases.

## Why
I recently was exposed to the dojo framework, and while there
are things that I dislike about it, one of the things that
I think is a good idea is being able to define a templated
region via an attribute on the containing node.

## Installation
```bash
bower install https://github.com/RutledgePaulV/jquery.handlebars.git
```

## Usage

1. Make sure you've already loaded jQuery!
2. Make sure that if you're not using pre-compiled templates that you include the full handlebars library.
3. If you have pre-compiled templates, then just include the runtime!

Check my handlebars, yo:
```handlebars
<!-- users.handlebars -->
<div>
    <p>Name: {{firstName}}</p>
    <p>Age: {{age}}</p>
</div>


<!-- weather.handlebars -->
<div>
    <p>Temperature: {{temperature}}</p>
    <p>Status: {{status}}</p>
</div>
```

Get yourself some markup:
```html

<div data-template='static/templates/users.handlebars'></div>
<div data-template='static/templates/weather.handlebars'></div>

<hr/>

<div id='weather2' data-template='static/templates/weather.handlebars'></div>

```

Now, inside your custom js for the page:
```JavaScript
$(function(){

    // locates all nodes with data-template and makes 
    // get requests to obtain their templates and compile if necessary
    $.handlebars();
    
    // calling the template with context data automatically updates the div associated with it
    Handlebars.users({firstName: 'Paul', age: 22});
    
    
    Handlebars.weather({temperature: '20 degrees fahrenheit', status: 'sunny'});
    
    
    // you can render shared templates individually by passing a css-selector as the second param
    // if you don't specify, it will render all the areas that share that template.
    Handlebars.weather({temperature: '20 degrees celsius', status: 'overcast'}, '#weather2');
    
    
});
```