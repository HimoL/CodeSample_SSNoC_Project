var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var rest_api = require('../../config/rest_api');

function Msg(username_from, content, type, username_to, time){
  this.local = {
    author : username_from,
    content : content, 
    type : type, 
    target : username_to, 
    time : time
  };
}

Msg.savePublicMsg = function(user_name, msg, msg_time, callback) {
  var type = 'WALL';
  var target = '';
  var options = {
    url : rest_api.save_new_public_msg + '/' + user_name,
    body : {author: user_name, content: msg, messageType: type, postedAt: msg_time, target : target},
    json: true
  };
console.log("----------------------save public msg");
  request.post(options, function(err, res, body) {
    console.log("Callback on public msg");
    if (err){
      callback(err,null);
      return;
    }
    if (res.statusCode !== 200 && res.statusCode !== 201) {
      callback(res.body, null);
      return;
    }
    var new_msg = "msg done";
    callback(null, new_msg);
    return;
  });
};

Msg.savePrivateMsg = function(user_name, msg, msg_time, target, status, callback) {
  var temp = msg + "---->(with status:" + status + ")";
  var type = 'CHAT';
  var options = {
    url : rest_api.save_new_private_msg + '/' + user_name + '/' + target,
    body : {author: user_name, content: temp, messageType: type, postedAt: msg_time, target: target},
    json: true
  };

  request.post(options, function(err, res, body) {
    if (err){
      callback(err,'err');
      return;
    }
    if (res.statusCode !== 200 && res.statusCode !== 201) {
      callback(res.body, 'err');
      return;
    }
    //console.log("------------save PrivateMsg done with: " + JSON.stringify(res.body));
    var new_msg = new Msg(user_name, msg, type,target, msg_time);
    callback(null, new_msg);
    return;
  });
};



Msg.getAllPublicMsg = function(callback) {
  //console.log("getAllPublicMsg called");
  request(rest_api.get_all_public_msg, {json:true}, function(err, res, body) {
    if (err){
      callback(err,null);
      return;
    }
    if (res.statusCode === 200) {
      var public_msgs = body.map(function(item, idx, arr){
        return new Msg(item.author, item.content, item.messageType, item.target, item.postedAt);
      });

       public_msgs.sort(function(a,b) {
          return a.postedAt > b.postedAt;
        });

     // console.log("@@@@@ in Msg.getAllPublicMsg succeed users :" + JSON.stringify(public_msgs));
      callback(null, public_msgs);
      return;
    }
    if (res.statusCode !== 200) {
      callback(null, null);
      return;
    }
  });
};

Msg.getAllPrivateMsg = function(username1, username2, callback) {
  request(rest_api.get_all_private_msg + '/' + username1 + '/' + username2, {json:true}, function(err, res, body) {
    if (err){
      callback(err,null);
      return;
    }
    if (res.statusCode === 200) {
      var private_msgs = body.map(function(item, idx, arr){
        return new Msg(item.author, item.content, item.messageType, item.target, item. postedAt);
      });

       private_msgs.sort(function(a,b) {
         return a.time > b.time;
       });

     // console.log("@@@@@ in Msg.getAllPrivateMsg succeed users :" + JSON.stringify(private_msgs));
      callback(null, private_msgs);
      return;
    }
    if (res.statusCode !== 200) {
      callback(null, null);
      return;
    }
  });
};



module.exports = Msg;
