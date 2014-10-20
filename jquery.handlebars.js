/**
 * This jQuery plugin is for supporting handlebars templates being linked with DOM elements.
 * To use it, specify a data-template attribute on the dom element that should act as the rendering
 * frame. This attribute should provide a URI at which the template can be accessed. If the template
 * has not already been precompiled onto the handlebars object, a get request will be created to fetch
 * the template and then compile it.
 *
 * Once the compiled template is available, it's render function will be modified to automatically
 * place the rendered contents in the pane to which the data-template attribute was attached. If you
 * do not wish to render all areas that use the template, you can pass a selector as the second argument
 * to the render function and it will only render those panes which match the selector.
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

    function getFileName(uri){
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
     * @param {string} [uriPrefix] An optional path prefix to append to each
     *                             encountered path in the data-template attribute.
     */
    $.handlebars = function (uriPrefix) {


        // if no prefix was supplied, assume that the full path to the template was provided.
        uriPrefix = uriPrefix || '';

        Handlebars.templates = Handlebars.templates || {};

        $('[data-template]').each(function () {

            // getting the path to the template to pull in with an optional global prefix
            var templateUri = uriPrefix + $(this).data('template');

            // getting the name to place the template under
            var handlebarsPrefix = getFileName(templateUri);

            // keeping track of the elements that have templates associated with them, and which template
            if (!TemplateElements.hasOwnProperty(handlebarsPrefix)) {
                TemplateElements[handlebarsPrefix] = [this];
            } else {
                TemplateElements[handlebarsPrefix].push(this);
            }

            //optionally requesting the script and compiling it if it doesn't already exist.
            if (!Handlebars.templates.hasOwnProperty(handlebarsPrefix)) {
                // loading and compiling script if it doesn't already exist on the Handelbars object
                // and then overriding its default behavior once it's compiled.
                $.get(templateUri).done(function (contents) {
                    Handlebars.templates[handlebarsPrefix] = Handlebars.compile(contents);
                    override(handlebarsPrefix);
                });
            } else {

                //if it already exists, we can just override the behavior - it must have been precompiled.
                override(handlebarsPrefix);
            }
        });
    };


    /**
     * This overrides a particular handlebars template's rendering function to be scoped to only
     * those elements for which it was defined and also makes the rendering function filterable
     * against those elements.
     *
     * @param {string} templateName The name of the template to be overridden.
     */
    function override(templateName) {

        // capturing the original rendering function
        var originalCompileFunc = Handlebars.templates[templateName];

        /**
         * We're overriding the default handlebars renderer to accept both the template context
         * as well as a selector for the available elements for which it should be rendered at
         * any given time. This way elements can share templates but be rendered independently.
         *
         * @param {object} context An object with keys and values to render the template with.
         *
         * @param {string|function():boolean} selector A selector to decide which of the available
         *                                             elements should have the newly rendered template
         *                                             applied.
         */
        Handlebars.templates[templateName] = function (context, selector) {
            $(TemplateElements[templateName]).filter(selector || '*').each(function (index, element) {
                $(element).html(originalCompileFunc(context));
            });
        }
    }

}(jQuery));