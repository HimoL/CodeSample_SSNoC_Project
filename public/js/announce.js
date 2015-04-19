/**
 * Created by Himo on 14-11-6.
 */
/**
 * Created by Himo on 14-11-5.
 */
function init() {
   var serverBaseUrl = document.domain;

   var socket = io.connect(serverBaseUrl);

   var sessionId = '';

   window.my_name = '';

   socket.emit('newAnnConnect');

   function updateAnn(annList) {
       $('#post_form').html('');

       var canPostAnnouncement = document.getElementById("canPostAnnouncement").value;
       my_name = document.getElementById("my_name").value;
       // alert(JSON.stringify(annList.all));

       //If current user has the right to post announcement
       if(canPostAnnouncement == 1) {
           var form_ele =
             '<br><h5 class="text-primary">Only Coordinators & Administrators can post public announcements</h5>' +
             '<form action = "/post_announce" method = "post" name="annForm">' +
             '<input type = "hidden" name = "user_name" id = "user_name" value ="' + my_name + '"  placeholder = "username" >' +
             '<input type = "hidden" name = "time" id = "time" value ="' + document.getElementById("time").value + '" >' +
             '<input type = "text" name = "content" id = "content" placeholder="content here" class="form-control"><br>' +
             '<button type = "submit" class="btn btn-default">Post</button></form><br>';

           $('#post_form').append(form_ele);
        }

           var announcementList = '';
           $('#wallAnnouncement').html('');

           annList.all.forEach(function(annObj) {
              announcementList = announcementList + "<div><font size='2'><b>"+annObj.author+" ("+annObj.postedAt+")</b><br>" + annObj.content + "</font><br><br>";
         });
           $('#wallAnnouncement').append(announcementList);

           /* The forEach loop is to show the announcement list to jade */
           annList.all.forEach(function(annObj) {
          //alert("AnnList author:" + annObj.author + " content:" + annObj.content + " time:" + annObj.postedAt);
     });
 }

    socket.on('announcement', function(data) {
        updateAnn(data.annList);
    });
}

$(document).on('ready', init);