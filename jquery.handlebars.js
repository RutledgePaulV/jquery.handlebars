/**
 * This jQuery plugin is for supporting handlebars templates being linked with DOM elements.
 * To use it, specify a data-template attribute on the dom element that should act as the rendering
 * frame. This attribute should provide a URI at which the template can be accessed. If the template
 * has not already been precompiled onto the handlebars object, a get request will be created to fetch
 * the template and then compile it, or just execute if a precompiled template.
 *
 * The idea behind handling things this way, is that it leaves the presentation layer without the markup
 * but gives you full control over the rendering inside the JS. The intention is that this will promote
 * best practices and keep a clean and intuitive relationship between DOM and JS.
 *
 * Written by Paul Rutledge
 * Open source under the MIT license.
 */
(function ($) {

    var TemplateElements = {};

    function getFileNameWithExtension(path){
        return path.substr(path.lastIndexOf('/') + 1);
    }

    function getFileExtension(nameOrPath){
        return nameOrPath.substr(nameOrPath.lastIndexOf('.'));
    }

    function getTemplateName(uri){
        var name = getFileNameWithExtension(uri);
        var extension = getFileExtension(name);
        return name.replace(extension, '');
    }

    /**
     * Makes sure that all handlebars templates are retrieved and compiled if not already existing
     * for any elements that are marked, and also associate the rendering with the element(s) to which
     * they were assigned.
     *
     *
     * @param {string} [uriPrefix] An optional path prefix to prepend to each
     *                             encountered path in the data-template attribute.
     */
    $.handlebars = function (uriPrefix) {


        // if no prefix was supplied, assume that the full path to the template was provided.
        uriPrefix = uriPrefix || '';

        Handlebars.templates = Handlebars.templates || {};

        $('[data-template]').each(function () {

            // getting the path to the template to pull in with an optional global prefix
            var templateUri = uriPrefix + $(this).data('template');

            var extension = getFileExtension(templateUri);
            var handlebarsPrefix = getTemplateName(templateUri);


            // keeping track of the elements that have templates associated with them, and which template
            if (!TemplateElements.hasOwnProperty(handlebarsPrefix)) {
                TemplateElements[handlebarsPrefix] = [this];
            } else {
                TemplateElements[handlebarsPrefix].push(this);
            }

            // requesting and compiling the template if the filename had a handlebars extension
            // otherwise request and execute as a script if js extension (precompiled)
            if (!Handlebars.templates.hasOwnProperty(handlebarsPrefix)) {
                if(extension === '.handlebars'){
                    $.get(templateUri).done(function (contents) {
                        Handlebars.templates[handlebarsPrefix] = Handlebars.compile(contents);
                    });
                } else if(extension === '.js'){
                    $.getScript(templateUri);
                }
            }
        });
    };

    /**
     * This function wraps the normal handlebars template function in a way
     * that allows us to scope it specifically to the elements to which the
     * data-template attribute was provided.
     *
     * @param {string} templateName The name of the template to render.
     * @param {object} data The data to render the template with.
     * @param {string} selector A css selector to identify the element of the available set. use ('*') for all.
     * @returns {null|string} Returns null if a selector was provided, else returns the rendered html.
     */
    $.renderHandlebars = function(templateName, data, selector){
        var rendered = Handlebars.templates[templateName](data);
        if(!selector){
            return rendered;
        } else {
            $(TemplateElements[templateName]).filter(selector).each(function (index, element) {
                $(element).html(rendered);
            });
        }
    };

}(jQuery));