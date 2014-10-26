(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['dogs'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div>\n    <p>Sound: "
    + escapeExpression(((helper = (helper = helpers.sound || (depth0 != null ? depth0.sound : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"sound","hash":{},"data":data}) : helper)))
    + "</p>\n</div>";
},"useData":true});
})();
