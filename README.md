## What
A jquery plugin for associating DOM elements with handlebar
templates in a way that supports and simplifies the typical use case.

## Why
I recently was exposed to the dojo framework, and while there
are things that I dislike about it, one of the things that
I think is a good idea is being able to define and reference a templated
region via an attribute on the containing node.

## Installation
```bash
bower install https://github.com/RutledgePaulV/jquery.handlebars.git
```

## Usage

1. Make sure you've already loaded jQuery!
2. Include handlebars (runtime if using compiled templates, or full if not).
3. Define your handlebars templates:
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

4. Reference the uri for the handlebar templates as the data-template attribute:
    ```html
    
    <div data-template='static/templates/users.handlebars'></div>
    <div data-template='static/templates/weather.handlebars'></div>
    
    <hr/>
    
    <div id='weather2' data-template='static/templates/weather.handlebars'></div>
    
    ```

5. Initialize the plugin and use your templated regions!
    ```JavaScript
    $(function(){
    
        // the callback will fire once all the required templates have been downloaded / compiled
        // (will return immediately if you already included precompiled templates on the page)
        $.handlebars(function(){

            // calling the template with context data automatically updates the associated divs that match the selector
            $.renderTemplate('users', {firstName: 'Paul', age: 22}, '*');

            // you choose which templated areas should be rendered by passing a css-selector as the third param
            $.renderTemplate('weather', {temperature: '20 degrees fahrenheit', status: 'sunny'}, '#weather2');

            // if you omit the parameter, it will just return the markup
            var weatherMarkup = $.renderTemplate('weather', {temperature: '20 degrees celsius', status: 'overcast'});

        });
        
        
    });
    ```
