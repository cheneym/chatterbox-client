var apiURL = 'https://api.parse.com/1/classes/messages';

var app = {};

app.init = function() {

};

$.get(apiURL, function(data) {
  var messages = data.results;
  console.log(data);
  var $selector = $('.chatroomNames');
  

  for (var i = 0; i < messages.length; i++) {
    var $chats = $('#chats');
    //var roomnames = 
    // console.log(messages[i].roomname)
    var $chatBox = $('<div></div>').addClass('chat');
    var $name = $('<p></p>').addClass('username').text(messages[i].username + ':');
    var $text = $('<p></p>').text(messages[i].text);
    $chatBox.append($name);
    $chatBox.append($text);
    $chats.append($chatBox);
  }
});