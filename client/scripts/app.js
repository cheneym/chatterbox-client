
var myName = window.location.search.slice(10);
console.log(myName);
var app = {};

app.server = 'https://api.parse.com/1/classes/messages';

app.init = function() {
  //app.fetch();
};

app.fetch = function() {
  $.ajax({
    url: app.server,
    type: 'GET',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');

    },
    error: function (data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
}; 

var processFetch = function(data) {
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
};

app.send = function(message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.renderMessage = function (message) {
  var $chats = $('#chats');
  var $chatBox = $('<div></div>').addClass('chat');
  var $name = $('<p></p>').addClass('username').text(message.username + ':');
  var $text = $('<p></p>').text(message.text);
  $chatBox.append($name);
  $chatBox.append($text);



  $chats.append($chatBox);
};

//<option value="lobby" selected>lobby</option>
//<option value="superLobby">superLobby</option>


app.renderRoom = function(roomName) {
  $roomOption = $('<option></option>').val(roomName).text(roomName);
  $('#roomSelect').append($roomOption);
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
  //app.init();
});