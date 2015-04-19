
module.exports = function(_, io, participants, publicMsgList, privateMsgList,annList, unReadMsgList, searchList) {
  
	io.on("connection", function(socket){
		
    socket.on("newUser", function(data) {
      participants.online[data.id] = {'userName' : data.name, 'password': data.password, 'status': data.status, 'privilege': data.type, 'accountStatus' : data.accountStatus};

      io.sockets.emit("newConnection", {participants: participants, unReadMsgList: unReadMsgList});
    });

    socket.on("disconnect", function() {
      delete participants.online[socket.id];
      io.sockets.emit("userDisconnected", {id: socket.id, sender:"system", participants:participants});
    });


      //To get all public message --- showed on people.jade  
	Msg.getAllPublicMsg(function(err, msgList) {
  	    publicMsgList.public = [];
      	if (!err) {
 	      msgList.forEach(function(msg) {
             publicMsgList.public.push({author : msg.local.author, content : msg.local.content, messageType : msg.local.type, target : msg.local.target, postedAt : msg.local.time});
          });
        io.sockets.emit("publicMsg", {publicMsgList: publicMsgList, participants: participants});
        }    
     });

     //Private chat socket part
     socket.on("startPrivateChat", function(data) {
        Msg.getAllPrivateMsg(data.my_name,data.target,function(err, privateChatList){
              privateMsgList.all = [];
              if (!err) {
                  privateChatList.forEach(function (msg) {
                      privateMsgList.all.push({author: msg.local.author, content: msg.local.content, target: msg.local.target, time: msg.local.time});
                  });
                  io.sockets.emit("privateChatHistory", {privateMsgList: privateMsgList});
              }
          });
      });

      socket.on('showNewChat', function(data){
          var num = unReadMsgList.all.length;

          for( var i = 0 ; i < num ; i++){
              var temp = unReadMsgList.all.shift();
              if(temp.target != data.my_name ){
              unReadMsgList.all.push(temp);
              }
          }
          Msg.getAllPrivateMsg(data.my_name,data.target,function(err, privateChatList){
              privateMsgList.all = [];
              if (!err) {
                  privateChatList.forEach(function (msg) {
                      privateMsgList.all.push({author: msg.local.author, content: msg.local.content, target: msg.local.target, time: msg.local.time});
                  });
                  io.sockets.emit("privateChatHistory", {privateMsgList: privateMsgList});
              }
          });

      });

      socket.on("postChat", function(data) {
          Msg.savePrivateMsg(data.user_name, data.content, data.time, data.target, data.status, function (err, newMsg) {
              if (!err) {
                  unReadMsgList.all.push({
                      author: newMsg.local.author,
                      content: newMsg.local.content,
                      time: newMsg.local.time,
                      target: newMsg.local.target
                  });
                  console.log("------------result in unReadMsgList@postChat socket: " + JSON.stringify(unReadMsgList.all));
                    io.sockets.emit("startPrivateChat", {my_name:newMsg.local.author, target : newMsg.local.target});
              }
          });
      });

      //To get all announcements --- showed on announcement.jade  --- related with socket on js/announce.js
      socket.on("newAnnConnect", function() {
          Ann.getAllAnn(function(err, List) {
              annList.all = [];
              if (!err) {
                  List.forEach(function(ann) {
                      annList.all.push({author : ann.local.author, content : ann.local.content, postedAt : ann.local.time});
                  });
                  io.sockets.emit("announcement", {annList: annList});
              }
          });

      });
      
      //Search Usecase
      socket.on("newSearch", function(data) {
          //console.log("NewSearch is triggered with keyword: " + data.keyword);
          //calling function in SearchRest.js to get result of search announcement
          Search.getSearchAnnouncement(data.keyword, function(err, announcementResultList) {
              searchList.all = [];

              //push the information in resultList into searchList
              if (!err) {
                  announcementResultList.announcements.forEach(function(ann) {
                      searchList.all.push({author : ann.author, content : ann.conent, postedAt : ann.postedAt});
                 });
                  console.log("------------result in SearchList@newSearch socket: "+JSON.stringify(searchList.all));
                  io.sockets.emit("searchResult", {searchList:searchList});
              }
          });
      });
      
      socket.on("newSearchUserName", function(data) {
          //console.log("NewSearch is triggered with keyword: " + data.keyword);
          //calling function in SearchRest.js to get result of search announcement
          Search.getSearchUserName(data.keyword, function(err, usernameResultList) {
              searchList.all = [];
              console.log("------------get the search result in new Search@newSearchUserName socket : "+JSON.stringify(usernameResultList));

              //push the information in resultList into searchList
              if (!err) {
            	  usernameResultList.users.forEach(function(user) {
                      searchList.all.push({username : user.userName, status : user.status});
                 });
                  console.log("------------result in newSearchUserName@newSearchUserName socket: "+JSON.stringify(searchList.all));
                  io.sockets.emit("searchResult", {searchList:searchList});
              }
          });
      });
          
      socket.on("newSearchStatus", function(data) {
          //console.log("NewSearch is triggered with keyword: " + data.keyword);
          //calling function in SearchRest.js to get result of search announcement
          Search.getSearchUserWithStatus(data.keyword, function(err, userStatusResultList) {
              searchList.all = [];
              console.log("------------get the search result in new Search@newSearchUserStatus socket : "+JSON.stringify(userStatusResultList));
			  
              //push the information in resultList into searchList
              if (!err) {
            	  userStatusResultList.users.forEach(function(user) {
                      searchList.all.push({username : user.userName, status : user.status});
                 });
                  console.log("------------result in newSearchUserName@newSearchUserStatus socket: "+JSON.stringify(searchList.all));
                  io.sockets.emit("searchResult", {searchList:searchList});
              }
          });
      });
      
      socket.on("newSearchPublicMessage", function(data) {
          //console.log("NewSearch is triggered with keyword: " + data.keyword);
          //calling function in SearchRest.js to get result of search announcement
          Search.getSearchPublicMessages(data.keyword, function(err, publicMessageResultList) {
              searchList.all = [];
              console.log("------------get the search result in new Search@newSearchPublicMessages socket : "+JSON.stringify(publicMessageResultList));

              //push the information in resultList into searchList
              if (!err) {
            	  publicMessageResultList.messages.forEach(function(message) {
                      searchList.all.push({author : message.author, content : message.content, postedAt: message.target});
                 });
                  console.log("------------result in newSearchUserName@newSearchPublicMessages  socket: "+JSON.stringify(searchList.all));
                  io.sockets.emit("searchResult", {searchList:searchList});
              }
          });
      });
      
      socket.on("newSearchPrivateMessage", function(data) {
              //console.log("NewSearch is triggered with keyword: " + data.keyword);
              //calling function in SearchRest.js to get result of search announcement
              Search.getSearchPrivateMessage(data.keyword, function(err, privateMessageResultList) {
                  searchList.all = [];
                  console.log("------------get the search result in new Search@newSearchPrivateMessages socket : "+JSON.stringify(privateMessageResultList));

                  //push the information in resultList into searchList
                  if (!err) {
                	  privateMessageResultList.messages.forEach(function(message) {
                          searchList.all.push({author : message.author, content : message.content, postedAt: message.postedAt});
                     });
                      console.log("------------result in newSearchUserName@newSearchPrivateMessages  socket: "+JSON.stringify(searchList.all));
                      io.sockets.emit("searchResult", {searchList:searchList});
                  }
              });
         });
	});
}      


