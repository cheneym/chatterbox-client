
var apiURL = 'https://api.parse.com/1/classes/messages';
var myName = window.location.search.slice(10);
console.log(myName);
var app = {};

app.init = function() {

};

var retrieveMessages = function() {
  $.get(apiURL, function(data) {
    console.log(data);
    var messages = data.results;
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
}; 
retrieveMessages();
// var message = {
//   username: 'shawndrost',
//   text: 'trololo',
//   roomname: '4chan'
// };

app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      console.log(message);
      console.log(data);

    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

$(document).ready(function() {
  $('.submit').on('click', function() {
    var formInfo = $('#form').serializeArray();
    console.log(formInfo);
    $('#form').trigger('reset');
    var text = formInfo[0]['value'];

    var message = {};
    message.username = myName;
    message.text = text;
    message.roomname = 'lobby';
    send(message);    
  });
});