var ng = require("nodegrass");
var env = require('jsdom').env;
var jQuery = require('jquery');
var querystring = require("querystring");

var base_song_path = "http://www.songtaste.com/song/";
var base_music_path = "http://www.songtaste.com/music/";
var base_music_time = "http://www.songtaste.com/time.php";
var base_path = 'http://www.songtaste.com';

function MSL(songname, songid) {
  //start party
  ng.get(base_song_path + songid + "/", function(data, status, headers) {
    var reg = /var strURL = \"(\w+)\"/;
    var reg_title = /<p class=\"mid_tit\">(.+?)<\/p>/;
    var reg_match = data.match(reg);
    var reg_match_title = data.match(reg_title);
    
    if (reg_match != null) {
      var music_hash = reg_match[1];
      var music_title = reg_match_title[1];
      
      var params = {
        str                : music_hash,
        sid                : songid,
        t                  : 0
      };
  
      params = querystring.stringify(params);
      
      var headers = {
        'Content-Type'     : 'application/x-www-form-urlencoded',
        'X-Requested-With' : 'XMLHttpRequest',
        'User-Agent'       : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.89 Safari/537.36',
        'Referer'          : base_music_path + songid + "/",
        'Origin'           : base_path,
        "Content-Length"   : params.length
      };
  
      ng.post(base_music_time, function(data, status, headers) {
        var music_url = data;
        console.log(songid + ", " + music_title + ", " + music_url);
      }, headers, params, "gbk");
    }
  }, "gbk")
}

function progress_page(page) {
  ng.get(base_music_path + page, function(data, status, headers) {
    env(data, function (errors, window) {
      var $ = jQuery(window);
      var href_list = $("script");
      var msl_text = $(href_list[15]).text();
      //parse music item 
      eval(msl_text);
    });
  }, "gbk");
}

for (var i = 1; i < 5; i++) {
  progress_page(i);
}