/**
* Assemble Contrib Plugin: TOC
* https://github.com/assemble/assemble-contrib-toc
*
* Copyright (c) 2013 Brian Woodward
* @author: https://github.com/doowb
*
* @param {[type]} params [description]
* @param {Function} callback [description]
* @return {[type]} [description]
*/


var options = {
  stage: 'render:post:page'
};

var cheerio = require('cheerio');

/**
 * Anchor Plugin
 * @param  {Object}   params
 * @param  {Function} callback
 */
module.exports = function(params, callback) {

  'use strict';

  // load current page content
  var $ = cheerio.load(params.content);
  var toc = cheerio.load('<ul></ul>');

  // get all the anchor tags from inside the headers
  var anchors = $('h1 a[name],h2 a[name],h3 a[name],h4 a[name]');
  anchors.map(function(i, e) {
    var item = [
      '<li>',
      '   <a href="#' + e.attribs.name + '">' + $(e.parent).text().trim() + '</a>',
      '</li>',
      ''
    ].join('\n');
    toc('ul').append(item);
  });

  $('body').prepend(toc.html());
  params.content = $.html();
  callback();
};

module.exports.options = options;
