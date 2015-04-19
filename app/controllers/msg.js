var Msg = require('../models/MsgRest.js');

module.exports =  function(_, io, participants, passport) {
  return {

    postPublicMsg : function(req, res) {
    
      var user_name = req.param('user_name');
      var msg = req.param('wallMessage');
      var msg_time = req.param('time');
      var status = req.param('user_status');
      var temp = (msg + "(with status:" + status + ")" );
      Msg.savePublicMsg(user_name, temp, msg_time, function(err, msg_posted){
        if(err){
          console.log('-----!!!Some err occur:' + err);
        }
        console.log('-----!!!save :' + msg_posted + " @ msg.js");
       res.redirect('/people');
      });
    },    
     
    postPrivateMsg : function(req, res) {
      var user_name = req.param('user_name');
      var msg = req.param('content');
      var msg_time = req.param('time');
      var target = req.param('target');
      Msg.savePrivateMsg(user_name, msg, msg_time, target, function(err, msg_posted) {
        if(err){
          console.log('-----!!!Some err occur:' + err);
        }
      console.log('-----!!!Private msg posted for ' + msg_posted);
        res.render("people",{});
 
      });
    }
  
  };
};
