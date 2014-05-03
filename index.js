/**
* Assemble Contrib Middleware: TOC
* https://github.com/assemble/assemble-contrib-toc
*
* Copyright (c) 2014 Brian Woodward
* @author: https://github.com/doowb
*
* @param {[type]} params [description]
* @param {Function} next [description]
* @return {[type]} [description]
*/

var cheerio = require('cheerio');

module.exports = function (assemble) {
  var opts = assemble.config;
  opts.toc = opts.toc || {};

  /**
   * TOC Middleware
   * @param  {Object}   params
   * @param  {Function} next
   */
  var middleware = function(params, next) {
    'use strict';

    // id to use to append TOC
    var id = '#' + (opts.toc.id || 'toc');
    var modifier = opts.toc.modifier || '';
    var li = opts.toc.li ? (' class="' + opts.toc.li + '"') : '';

    // load current page content
    var $ = cheerio.load(params.content);
    var toc = cheerio.load('<ul id="toc-list" class="' + modifier + '"></ul>');

    // get all the anchor tags from inside the headers
    var anchors = $('h1 a[name],h2 a[name],h3 a[name],h4 a[name]');
    anchors.map(function(i, e) {
      var text  = $(e.parent).text().trim();
      var link  = e.attribs.name;
      var depth = parseInt(e.parent.name.replace(/h/gi, ''), 10);

      var arr = new Array(depth);
      var level = arr.join('<li><ul>') + '<li><a href="#' + link + '">' + text + '</a></li>' + arr.join('</ul></li>');
      toc('#toc-list').append(level);
    });
    $(id).append(toc.html()
         .replace(/(<li>\s*<ul>\s*)+/g, '<li><ul>')
         .replace(/(<\/ul>\s*<\/li>\s*)+/g, '</ul></li>')
         .replace( /(<\/li>\s*<\/ul>\s*<\/li>\s*<li>\s*<ul>\s*<li>)/g, '</li><li>'));

    params.content = $.html();
    next();
  };

  middleware.event = 'page:after:render';
  return {
    'assemble-middleware-toc': middleware
  };
};
