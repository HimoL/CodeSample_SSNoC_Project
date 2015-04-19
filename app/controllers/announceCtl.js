/**
 * Created by Himo on 14-11-5.
 */

var Ann = require('../models/AnnRest.js');
var User = require('../models/UserRest.js');

module.exports =  function(_, io, participants, passport) {
    return {


        postAnn : function(req, res) {

            var user_name = req.param('user_name');
            var content = req.param('content');
            var time = req.param('time');
            console.log('-----!!!!!!!Post ann@announceCtl.js for: username - ' + user_name + ' msg - ' + content + ' at ' + time);

            Ann.postAnn(user_name, content, time, function(err, ann_posted){
                if(err){
                    console.log('-----!!!Some err occur:' + err);
                }
                console.log("-------!!!postAnn saved  : " + ann_posted+ " @ announceCtl.js");
                res.redirect('/announcement');
            });
        },

        getAnn : function(req, res) {
            var my_name = req.session.passport.user.user_name;
            var currentUserType = "Citizen" ;
            var canPostAnnouncement = 0;   //if user can post announcement --- for Coordinator & Administrator

            User.getUser(my_name, function(err, user) {
                if (!err) {
                    currentUserType = user.local.type;

                    //Coordinator & Administrator have the right to post announcement
                    if(currentUserType == "Coordinator" || currentUserType == "Administrator") canPostAnnouncement = 1;

                    res.render('announcement', {user_name: my_name, canPostAnnouncement: canPostAnnouncement});
                }
            });

  }

    };
};