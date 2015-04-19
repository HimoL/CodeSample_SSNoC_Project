/**
 * Created by Himo on 14-11-6.
 */

var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var rest_api = require('../../config/rest_api');

function Ann(author, content, time){
    this.local = {
        author : author,
        content : content,
        time : time
    };
}

Ann.postAnn = function(author, content, time, callback) {
    var options = {
        url : rest_api.post_announce ,
        body : {author: author, content: content, postedAt: time},
        json: true
    };

    request.post(options, function(err, res, body) {
        if (err){
            callback(err,null);
            return;
        }
        if (res.statusCode !== 200 && res.statusCode !== 201) {
            callback(res.body,null);
            return;
        }
        var new_ann = "ann done";
        callback(null, new_ann);

        return;
    });
};


Ann.getAllAnn = function(callback) {
    request(rest_api.get_all_ann, {json:true}, function(err, res, body) {
        if (err){
            callback(err,null);
            return;
        }
        if (res.statusCode === 200) {
            var annList = body.map(function(item, idx, arr){
                return new Ann(item.author, item.content, item.postedAt);
            });

            //  public_msgs.sort(function(a,b) {
            //     return a.time > b.time;
            //   });

            // console.log("@@@@@ in Msg.getAllPublicMsg succeed users :" + JSON.stringify(public_msgs));
            callback(null, annList);
            return;
        }
        if (res.statusCode !== 200) {
            callback(null, null);
            return;
        }
    });
};

// GET LAST ANN not finished yet
Ann.getLastAnn = function( callback) {
    request(rest_api.get_all_ann, {json:true}, function(err, res, body) {
        if (err){
            callback(err,null);
            return;
        }
        if (res.statusCode === 200) {
            var annList = body.map(function(item, idx, arr){
                return new Ann(item.author, item.content, item.postedAt);
            });

            annList.sort(function(a,b) {
                return a.time > b.time;
            });

            // console.log("@@@@@ in Msg.getAllPublicMsg succeed users :" + JSON.stringify(public_msgs));
            callback(null, annList[0]);
            return;
        }
        if (res.statusCode !== 200) {
            callback(null, null);
            return;
        }
    });
};


module.exports = Ann;