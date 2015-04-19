var serverBaseUrl = document.domain;

var socket = io.connect(serverBaseUrl);

function init() {
    var sessionId = '';

    window.my_name = '';
    
    /* function to display public message */
    
    function updatePublicMsg(publicMsgList){
        var msg_list = '';
        $('#wallPosts').html('');

        publicMsgList.public.forEach(function(msgObj) {
            msg_list = msg_list + "<div><font size='2'><b>"+msgObj.author+" ("+msgObj.postedAt+")</b><br>" + msgObj.content + "</font>";
        });
        $('#wallPosts').append(msg_list);
    }

    function updateParticipants(participants,unReadMsgList) {
        $('#participants_online').html('');
        $('#participants_offline').html('');
        $('#modalChatWindow').html('');
        $("#privateMsgLink").hide();

        unReadMsgList.all.forEach(function(msgObj){
                if(msgObj.target == my_name){
                    alert("There is new chat message unread");
                    chat_to = msgObj.author;
                    $("#privateMsgLink").show();
                }
            }
        );

        var map = {};
        var userName = '';
        var userEle = '';
        var status = '';
        var chat_to ;
        var isAdmin = document.getElementById("isAdmin").value;
        var currentStatus = document.getElementById('currentUserStatus').value;

        for (var sId in participants.online){
            userName = participants.online[sId].userName;
            if (map[userName] == undefined || map[userName] !== sessionId){
                map[userName] = {sId:sId};
            }
        }
        keys = Object.keys(map);
        keys.sort();

        /* This for loop is to show the directory of online users */
        for (var i = 0; i < keys.length; i++) {
            var name = keys[i];
            var img_ele = '<img src="/img/photo4.png" height=40/>';
            var photo_ele = '<div class="col-xs-2 col-sm-2 col-md-1 col-lg-1"><img src="/img/green-dot.png" height=10/><br/>'+
			               img_ele + '</div>';
            var status_ele = 'user status' ;
            var type_ele = 'user type';
            var password_ele = 'user password';
            var acocunt_status = 'user status';

            //Set the user status information and user type information to HTML elements
            participants.all.forEach(function(userObj) {

                if(userObj.userName == name){
                    password_ele = userObj.password;
                    status_ele = userObj.status ;
                    type_ele = userObj.privilege;
                    acocunt_status = userObj.accountStatus;
                }
            });

            if(acocunt_status == 'Inactive'){}
            else {
                var name_ele = '<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 username"><strong>' + name + '</strong><br/><font size="2">Status: ' + status_ele + '<br/>Privilege: '+type_ele+'<br/>Acc. Status: '+acocunt_status+'</font></div>';
                var chat_ele = '<Button type="button" class="btn btn-info col-xs-6 col-sm-6 col-md-4 col-lg-4 chatDiv" data-chat=".' + name + '">Chat Privately</Button>';
                var dropdown_symbol = map[name].sId === sessionId ? '' : '<i class="glyphicon glyphicon-chevron-down text-muted"></i>';
                var dropdown_ele = '<div class="col-xs-1 col-sm-1 col-md-4 col-lg-4 dropdown-user" align="center" data-for=".' + name + '">' + dropdown_symbol + '</div>';
                var info_ele = '<div class="row user-row search_item">' + photo_ele + name_ele + chat_ele + dropdown_ele + '</div>';

                /* This part is to evaluate if the user is administrator
                 If so, will show the admin page only for administrator */
                if (isAdmin == 1) {
                    var detail_ele = '<div class="row user-info ' + name + '">' + updateForm() +
                        '<div class="col-sm-3 col-md-2 col-lg-2"><input type = "hidden" value = "' + name + '" name = "oldUsername" id = "oldUsername" >' +
                        '<input type = "hidden" value = "' + password_ele + '" name = "oldPassword" id = "oldPassword" >' +
                        '<input type = "hidden" value = "' + type_ele + '" name = "oldPrivilege" id = "oldPrivilege" >' +
                        '<input type = "hidden" value = "' + acocunt_status + '" name = "oldAccountStatus" id = "oldAccountStatus" >' +
                        '<br/><button type="submit" id="updateProfileBtn" class="btn btn-success">Update</button></form><br></div>' +
                        '</div>';
                }
                else {
                    var detail_ele = '<div class="row user-info ' + name + '">' +
                        '<hr/></div></div>';
                }

                //Skip the information of current user( which is not show on the users directory)
                if (map[name].sId === sessionId || name === my_name) {
                } else {
                    $('#participants_online').append(info_ele);
                    $('#participants_online').append(detail_ele);
                }
            }
        }

        /* This part is to list users information of all the users(offline) */
        participants.all.forEach(function(userObj) {
            if(userObj.accountStatus == 'Inactive' ){}
            else {
                if (map[userObj.userName] == undefined) {
                    var img_ele = '<img class="img-circle" src="/img/photo4.png" height=40/>';
                    var photo_ele = '<div class="offline col-xs-2 col-sm-2 col-md-1 col-lg-1"><img src="/img/grey-dot.png" height=10/><br/>' + img_ele + '</div>';
                    var name_ele = '<div class="offline col-xs-3 col-sm-3 col-md-3 col-lg-3 username" ><strong>' + userObj.userName + '</strong><br/><font size="2">Status: ' + userObj.status + '<br/>Privilege: '+userObj.privilege+'<br/>Acc. Status: '+userObj.accountStatus+'</font></div>';
                    var chat_ele = '<br/><div class="btn btn-info col-xs-6 col-sm-6 col-md-4 col-lg-4 chatDiv" data-chat=".' + userObj.userName + '">Chat Privately</div>';
                    var dropdown_ele = '<div class="col-xs-1 col-sm-1 col-md-4 col-lg-4 dropdown-user" align="center" data-for=".' + userObj.userName + '"><i class="glyphicon glyphicon-chevron-down text-muted"></i></div>';
                    var info_ele = '<div class="row user-row search_item">' + photo_ele + name_ele + chat_ele + dropdown_ele + '</div>';

                    /* This part is to evaluate if the user is administrator
                     If so, will show the admin page only for administrator */
                    if (isAdmin == 1) {
                        var detail_ele = '<div class="row user-info ' + userObj.userName + '">' + updateForm() +
                            '<div class="col-sm-3 col-md-2 col-lg-2"><input type = "hidden" value = "' + userObj.userName + '" name = "oldUsername" id = "oldUsername" >' +
                            '<input type = "hidden" value = "' + userObj.password + '" name = "oldPassword" id = "oldPassword" >' +
                            '<input type = "hidden" value = "' + userObj.privilege + '" name = "oldPrivilege" id = "oldPrivilege" >' +
                            '<input type = "hidden" value = "' + userObj.accountStatus + '" name = "oldAccountStatus" id = "oldAccountStatus" >' +
                            '<br/><button type="submit" id="updateProfileBtn" class="btn btn-success">Update</button></form></div>' +
                            '</div>';
                    }
                    else {
                        var detail_ele = '<div class="row user-info ' + userObj.userName + '">' +
                            '<hr/></div></div>';
                    }

                    $('#participants_online').append(info_ele);
                    $('#participants_online').append(detail_ele);
                }
            }
        });

        /* Part for private chat window.. */
        var chat_win_ele = '<div class="row chat-window">'+
            '<div id="oldMsg"><h4>No previous message</h4><br></div>'+
            '<div>'+
            '<textarea id="content_chat" name="content_chat"></textarea><br>' +
            '<input type = "hidden" value = "' + my_name + '" name = "user_name_chat" id="user_name_chat" >' +
            '<input type = "hidden" value = "' + new Date().toLocaleString() + '" name="time_chat" id = "time_chat" >' +
            '<input type = "hidden" value = "' + name + '" name = "target_chat" id="target_chat" >' +
            '<input type = "hidden" value = "' + currentStatus + '" name = "status_chat" id="status_chat" >' +
            '<button type="submit" onclick="postChat();window.location.reload();" class="btn btn-default">Post</button>'+
            '</div></div>';
        $('#modalChatWindow').append(chat_win_ele);

        $('.user-info').hide();
        $('.dropdown-user').click(function() {
            var dataFor = $(this).attr('data-for');
            var idFor = $(dataFor);
            var currentButton = $(this);
            idFor.slideToggle(400, function() {
                if(idFor.is(':visible'))
                {
                    currentButton.html('<i class="glyphicon glyphicon-chevron-up text-muted"></i>');
                }
                else
                {
                    currentButton.html('<i class="glyphicon glyphicon-chevron-down"></i>');
                }
            })
        });

        /* Showing private chat window when clicked */

        $('#modalChatWindow').hide();
        $('.chatDiv').click(function() {
            var target = $(this).siblings('.username').find('strong').html();

            $('#modalChatWindow .row input[name=target_chat]').val(target);

            socket.emit('startPrivateChat', {my_name: my_name, target: target});
            socket.on('privateChatHistory', function (data) {

                var chat_history_ele = '';
                $('#oldMsg').html('');

                if (data.privateMsgList.all.length == 0) {
                    chat_history_ele = 'No previous chat message';
                }
                else {
                    data.privateMsgList.all.forEach(function (msgObj) {
                        chat_history_ele = chat_history_ele + "<div><font size='2'><b>" + msgObj.author + " to " + msgObj.target + "(" + msgObj.time + ")</b><br>" + msgObj.content + "</font><br>";
                    });
                }
                $('#oldMsg').append(chat_history_ele);
            });
            $('#modalChatWindow').dialog({maxHeight:500});
        });

        /* Part for showing the private chat box when the envelope icon for alerting unread message is clicked */
        $('#privateMsgLink').click(function(){
            $("#privateMsgLink").hide();
            $('#modalChatWindow .row input[name=target_chat]').val(chat_to);

            socket.emit('showNewChat', {my_name: my_name, target: chat_to});
            socket.on('privateChatHistory', function (data) {

             var chat_history_ele = '';
                $('#oldMsg').html('');

                data.privateMsgList.all.forEach(function(msgObj) {
                    chat_history_ele = chat_history_ele + "<div><font size='2'><b>"+ msgObj.author+" to " +msgObj.target +"("+msgObj.time+")</b><br>" + msgObj.content + "</font><br><br>";
                });
                $('#oldMsg').append(chat_history_ele);
            });
            $('#modalChatWindow').dialog({maxHeight:500});
        });

        //Validation on Updating the user profile details - Piyush
        $('#alertMsg').hide();
        $('#updateProfileBtn').click(function(){
        	var newU = $('#newUsername').val();
        	var newP = $('#newPassword').val().trim();
        	var newPr = $('#newPrivilege').val().trim();
        	alert('newPr:'+newPr);
        	var newAS = $('#newAccountStatus').val().trim();
        	alert(newU);
        	alert('T2');
        	  if(newU == "" && newP == "" && newPr == "-" && newAS == "-"){
	    		    $('#alertMsg').text('No field is updated');
	    		    $('#alertMsg').show();
        	  }
        	  $('#alertMsg').show();
        	  alert("Test Piyush2");
  		    return false;
        });
    }

    //The form for administrator to update user information
    function updateForm(){
        var update_form_ele = '<p align="center" class="text-primary">Modify User Details</p>' +
            '<form action = "/updateUser" method = "post" name="typeForm">' +
            '<div class="text-muted col-sm-3 col-md-3 col-lg-3">Change Username<br/><input type="text" name="newUsername" id="newUsername" class="form-control" placeholder="Leave blank if no change!"></div>'+
            '<div class="text-muted col-sm-3 col-md-3 col-lg-3">Change Password<br/><input type="text" name="newPassword" id="newPassword" class="form-control" placeholder="Leave blank if no change!"></div>'+
            '<div class="text-muted col-sm-2 col-md-2 col-lg-2">Change Privelege<br/>' +
            '  <select id="newPivilege" name="newPivilege" class="form-control">' +
            '     <option value="">-</option>' +
            '     <option value="Citizen">Citizen</option>' +
            '     <option value="Administrator" >Administrator</option>' +
            '     <option value="Monitor">Monitor</option>' +
            '     <option value="Coordinator">Coordinator</option>' +
            '  </select></div>' +
            '<div class="text-muted col-sm-3 col-md-2 col-lg-2">Change Acc. Status<br/>'+
            '  <select id="newAccountStatus" name="newAccountStatus" class="form-control">'+
            '     <option value="">-</option>' +
            '     <option value="Active">Active</option>' +
            '     <option value="Inactive">Inactive</option>' +
            '  </select></div>';
        return update_form_ele;
    }
    
    socket.on('connect', function () {
        sessionId = socket.socket.sessionid;
        $.ajax({
            url:  '/user',
            type: 'GET',
            dataType: 'json'
        }).done(function(data) {
            var name = data.name;
            my_name = data.name;

            socket.emit('newUser', {id: sessionId, name: name,status: status});
        });
    });

    socket.on('newConnection', function (data) {
        updateParticipants(data.participants, data.unReadMsgList);
    });

    //socket to get all public message list
    socket.on('publicMsg', function(data) {
        updatePublicMsg(data.publicMsgList);
    });

    socket.on('userDisconnected', function(data) {
        updateParticipants(data.participants);
    });

    socket.on('error', function (reason) {
        console.log('Unable to connect to server', reason);
    });

    var panels = $('.user-info');
    panels.hide();
    $('.dropdown-user').click(function() {
        var dataFor = $(this).attr('data-for');
        var idFor = $(dataFor);
        var currentButton = $(this);
        idFor.slideToggle(400, function() {
            if(idFor.is(':visible'))
            {
                currentButton.html('<i class="glyphicon glyphicon-chevron-up text-muted"></i>');
            }
            else
            {
                currentButton.html('<i class="glyphicon glyphicon-chevron-down text-muted"></i>');
            }
        })
    });
}
/* When new private chat message is send.. */
function postChat(){
    var user_name = document.getElementById("user_name_chat").value;
    var time = document.getElementById("time_chat").value;
    var content = document.getElementById("content_chat").value;
    var target = document.getElementById("target_chat").value;
    var currentStatus = document.getElementById("status_chat").value;

    socket.emit('postChat',  {user_name : user_name, time:time, content:content, target:target, status:currentStatus });
}
$(document).on('ready', init);
