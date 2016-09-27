
var myName = window.location.search.slice(10);
var app = {};

app.server = 'https://api.parse.com/1/classes/messages';
app.friends = {};
app.rooms = {};

app.init = function() {
  app.fetch();
};

app.fetch = function() {
  var order = '?order=-createdAt';
  $.ajax({
    url: app.server + order,
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Data retrieved');
      console.log(data);
      var messages = data.results;
      for (var i = 0; i < messages.length; i++) {
        app.addRoom(messages[i]);
        app.renderMessage(messages[i]);
      }
      app.renderAllRooms();
    },
    error: function (data) {
      console.error('chatterbox: Failed to retrieve data', data);
    }
  });
}; 

var processFetch = function(data) {
  var messages = data.results;
  var $selector = $('.chatroomNames');
};

app.send = function(message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      app.clearMessages();
      app.init();
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
  var $name = $('<a></a>').addClass('username').attr('username', message.username).text(message.username + ':');
  var $text = $('<p></p>').text(message.text);
  $chatBox.append($name);
  $chatBox.append($text);
  $chats.append($chatBox);
};

app.addRoom = function(message) {
  app.rooms[message.roomname] = message.roomname;
};

app.renderRoom = function(roomname) {
  $roomOption = $('<option></option>').val(roomname).text(roomname);
  $('#roomSelect').append($roomOption);
};

app.renderAllRooms = function() {
  for (var roomname in app.rooms) {
    app.renderRoom(app.rooms[roomname]);
  }
};

app.handleUsernameClick = function (username) {
  if (!(username in app.friends)) {
    app.friends[username] = username;
  }
};

app.handleSubmit = function () {
  var formInfo = $('#send').serializeArray();
  $('#send').trigger('reset');
  var text = formInfo[0]['value'];
  var message = {};
  message.username = myName;
  message.text = text;
  message.roomname = 'lobby';
  app.send(message);
};

$(document).ready(function() {
  $('body').on('click', '.username', function() {
    app.handleUsernameClick($(this).attr('username'));
  });
  $('.submit').on('click', function(e) {
    e.preventDefault();
    app.handleSubmit();    
  });
  app.init();
});

