var request = require('request');
var cheerio = require('cheerio');
var sanitizer = require('sanitizer');
//var htmlparser = require("htmlparser2");
var htmlToText = require('html-to-text');


var getImgSrcFromContentEncoded = function (contentEncoded, hostName) {
  	var str = contentEncoded;
    console.log('getImgSrcFromContentEncoded 1', str);
  	if (!str || (str == null)) return;

    var re = /\ssrc=(?:(?:'([^']*)')|(?:"([^"]*)")|([^\s]*))/i; // match src='a' OR src="a" OR src=a
    var res = str.match(re);

    console.log('getImgSrcFromContentEncoded 2', res);
    var src = res[1]||res[2]||res[3]; // get the one that matched

  	//console.log(src)
  	if (!src) return;

    if (src.indexOf(hostName) == -1) {
      src = hostName + src;
    }
  	return src;
};

var getImgOnMouseOverSrcFromContentEncoded = function (contentEncoded, hostName) {
  	var str = contentEncoded;
   	//console.log("str == " + str);
  	if (!str || (str == null)) return;

    var pattern = / on\w+="[^"]*"/g
    var onmouse = str.match(pattern);
    if (onmouse) {
	    //console.log("onmouse[0] == " + onmouse[0]);
	    var re =  /this.*?src='(.*?)'/;
	    var res0 = onmouse[0].match(re);
	    //console.log("res0 == " + hostName + res0[1]);
	    //console.log("onmouse[1] == " + onmouse[1]);
	    var re =  /this.*?src='(.*?)'/;
	    var res1 = onmouse[1].match(re);
	    //console.log("res1 == " + res1[1]);
	    var res = [hostName + res0[1], res1[1]];
	    //console.log("res == " + res);
  		return res;
  	}
};


var FeedProcessing = function () {};

FeedProcessing.prototype.createIdKeyFromHash = function (jsonString) {
    var jsonObjectWithId = jsonString.map(function(item, index) {
        //console.log(index);
        item['id'] = index;
        return item;
    });
    return jsonObjectWithId;
};

FeedProcessing.prototype.createOneLineBasedTitleKeyFromSummary = function (jsonString, maxLength) {
	var jsonObjectWithTitle = jsonString.map(function(item) {
	var title = item['title'];
	title = title.replace(/« /g, '');
	title = title.replace(/ »/g, '');
		if (title.length > maxLength) {
			title = title.substr(0, maxLength);
			title += '...';
		}
		item['oneLineBasedTitle'] = title;
		return item;
	});
	return jsonObjectWithTitle;
};

FeedProcessing.prototype.overrideDescriptionKey = function (jsonString) {
  var jsonStringArray = JSON.parse(jsonString);
	var jsonObjectWithOverridenDescription = jsonStringArray.map(function(item) {
	   var description;
		var dirtyDescription = item['description'];
		var cleanedDescription = sanitizer.sanitize(dirtyDescription);
		description = htmlToText.fromString(cleanedDescription, {
/*			wordwrap: 130		*/
		});


        var MAX = 200;
        var i = 0, j = 0;
        var descriptionParagraphArray = [];
        var originalDescriptionLength = description.length;

        while (description.length > MAX) {
            while (description.charAt(i) !== '.') {
                i++;
                j++;
	        	//console.log(description.charAt(i));
	        	if (j == originalDescriptionLength) break;
            }
            descriptionParagraphArray.push(description.substring(0, i+1));
            description = description.substring(i+1);
            i = MAX;
        }


		item['description'] = descriptionParagraphArray;
		//console.log(synopsisParagraph);


		return item;
	});
  var string = JSON.stringify(jsonObjectWithOverridenDescription);
  //console.log('IN... createShortSynopsisKeyFromSummary:  string == ' + string);
	return string;
};


FeedProcessing.prototype.createShortSynopsisKeyFromSummary = function(jsonString) {
  //console.log("createShortSynopsisKeyFromSummary  :  jsonString == " + jsonString);
  var jsonStringArray = JSON.parse(jsonString);
  //console.log("IN... createShortSynopsisKeyFromSummary:  jsonStringArray == " + jsonStringArray);

  var jsonStringArrayWithoutHtmlizedDescription = jsonStringArray.map(function(item) {
    		var description = item['description'];
        //console.log("createShortSynopsisKeyFromSummary  :  description == " + description);
		    var cleanedSummary = sanitizer.sanitize(description);
		    var synopsisParagraph = htmlToText.fromString(cleanedSummary, {
          /*			wordwrap: 130		*/
	      });
        //console.log("createShortSynopsisKeyFromSummary  :  synopsisParagraph == " + synopsisParagraph);
        item['description'] = synopsisParagraph;
        return item;
  });
  var string = JSON.stringify(jsonStringArrayWithoutHtmlizedDescription);
  //console.log('IN... createShortSynopsisKeyFromSummary:  string == ' + string);
	return string;
};

var indexPromises = 0;
var lengthArray = 0;
var requests = [];

FeedProcessing.prototype.createImageKeyFromContentEncoded = function(jsonString) {

  var jsonStringArray = JSON.parse(jsonString);
  //console.log("IN... createShortSynopsisKeyFromSummary:  jsonStringArray == ");
  lengthArray = jsonStringArray.length;
  return new Promise(function (resolve, reject) {
    //console.log("IN... return new Promise(function (resolve, reject) { ");
    for (var index=0; index<lengthArray; index++){
          //console.log("IN... for (var index=0; index<lengthArray; index++){");
          var url =   jsonStringArray[index]['guid'];
          console.log("createImageKeyFromContentEncoded  index == " + index);
          console.log("createImageKeyFromContentEncoded  jsonStringArray[index]['title'] == " + jsonStringArray[index]['title']);
          var options = {
            index: index,
      	    url: url,
      	    headers: {
      	      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
      	      'Referer': 'http://www.critikat.com/'
      	    }
      	  };

          (function(param) {
            var req = request(param, function (error, response, body) {
                if (error) return reject(error) //
                var $ = cheerio.load(body);
                jsonStringArray[param.index]['index'] = param.index;         
                console.log("------");
                console.log('(function(param) {   ...    param.index == ', param.index, 'lengthArray == ', lengthArray, 'indexPromises == ', indexPromises, 'jsonStringArray[param.index]["guid"] == ', jsonStringArray[param.index]["guid"]);
                //if (param.index === 11) {
                    console.log('(function(param) {   ...     body.indexOf("attachment-bones-article size-bones-article wp-post-image" == ', body.indexOf("attachment-bones-article size-bones-article wp-post-image"));
                //}
                if (param.index === 11) {
                  //console.log('(function(param) {   ...     body" == ', body);
                }
                //console.log("IN... for (var index=0; index<len; index++){     body == " + body);
                $('img.attachment-bones-article.size-bones-article.wp-post-image').each(function () {
                    console.log("________________________________________________________________________");
                    console.log('(function(param) {   ...    param.index == ', param.index, 'lengthArray == ', lengthArray, 'indexPromises == ', indexPromises);
                    jsonStringArray[param.index]['imageBig'] = $(this).attr('src');
                    jsonStringArray[param.index]['imageSmall'] = jsonStringArray[param.index]['imageBig'].replace("-980x0.jpg", "-125x125-c.jpg");

                    //console.log("BINGOOOOO  item['image'] == " + item['image']);
                    console.log("BINGOOOOO  jsonStringArray[param.index]['guid'] == " + jsonStringArray[param.index]['guid']);
                    console.log("BINGOOOOO  jsonStringArray[param.index]['title'] == " + jsonStringArray[param.index]['title']);
                    console.log("BINGOOOOO  jsonStringArray[param.index]['imageBig'] == " + jsonStringArray[param.index]['imageBig']);
                    console.log("BINGOOOOO  jsonStringArray[param.index]['imageSmall'] == " + jsonStringArray[param.index]['imageSmall']);
                    console.log("________________________________________________________________________");
                });//$('img.attachment-bones-article.size-bones-article.wp-post
                indexPromises++;
                //console.log("indexPromises == " + indexPromises);
                //console.log("length-1 == " + (lengthArray-1));
                if (indexPromises === (lengthArray)) {
                  //console.log("BINGOOOOO000000000000000000000000000000000000000000000");
                  resolve(jsonStringArray);
                  indexPromises = 0;
                }
            });//var req = request(options, function (error, response, body) {
          })(options);

    }//for ...
  }); //return new Promise(function (resolve, reject) {

};//createImageKeyFromContentEncoded

exports.FeedProcessing = new FeedProcessing();
