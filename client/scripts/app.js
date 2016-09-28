
var app = {};

app.server = 'https://api.parse.com/1/classes/messages';
app.friends = {};
app.rooms = {};
app.rendered = false;
app.roomname = 'lobby';
app.username = 'anonymous';
app.messages = [];

app.init = function() {
  app.fetch();
  app.username = window.location.search.slice(10);
  //setInterval(app.fetch, 2000);
};

app.fetch = function(filter) {
  filter = filter || '?order=-createdAt';
  $.ajax({
    url: app.server + filter,
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Data retrieved');
      console.log(data);
      app.clearMessages();
      app.messages = data.results;

      app.renderMessages(app.messages);
      app.renderAllRooms(app.messages);
      app.renderBoldText();
    },
    error: function (data) {
      console.error('chatterbox: Failed to retrieve data', data);
    }
  });
};

app.send = function(message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      app.fetch('?order=-createdAt');
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
  var $text = $('<p></p>').text(message.text).addClass(message.username);
  $chatBox.append($name);
  $chatBox.append($text);
  $chats.append($chatBox);
};

app.renderMessages = function(messages) {
  app.clearMessages();

  messages.filter(function(message) {
    if (app.roomname === 'lobby') {
      return true;
    } else if (app.roomname === message.roomname) {
      return true;
    } else {
      return false;
    }
  }).forEach(app.renderMessage);
};

app.addRoom = function(message) {
  app.rooms[message.roomname] = message.roomname;
};

app.renderRoom = function(roomname) {
  $roomOption = $('<option></option>').val(roomname).text(roomname);
  $('#roomSelect').append($roomOption);
};

app.renderAllRooms = function(messages) {
  $('#roomSelect').html('<option val="newRoom">New Room...</option>');
  
  var rooms = {};
  if (messages) {
    messages.forEach(function(message) {
      if (message.roomname && !(message.roomname in rooms)) {
        app.renderRoom(message.roomname);
        rooms[message.roomname] = true;
      }
    });
  }

  $('#roomSelect').val(app.roomname);
};

app.handleRoomChange = function(event) {
  var index = $(event.currentTarget).prop('selectedIndex');
  if (index === 0) {
    var newRoom = prompt('Enter room name');
    app.renderRoom(newRoom);
    $('#roomSelect').val(newRoom);
    app.roomname = newRoom;
  } else {
    app.roomname = $('#roomSelect').find(':selected').text();
  }
  app.renderMessages(app.messages);
};

app.handleUsernameClick = function (event) {
  var username = $(event.currentTarget).attr('username');
  if (!(username in app.friends)) {
    app.friends[username] = username;
  } else {
    delete app.friends[username];
  }
  $('p.' + username).toggleClass('bold');
};

app.handleSubmit = function () {
  var formInfo = $('#send').serializeArray();
  $('#send').trigger('reset');
  var text = formInfo[0]['value'];
  var message = {};
  message.username = app.username;
  message.text = text;
  message.roomname = $('#roomSelect').find(':selected').text();
  app.send(message);
};

$(document).ready(function() {
  $('body').on('click', '.username', app.handleUsernameClick);
  $('.submit').on('click', function(e) {
    e.preventDefault();
    app.handleSubmit();    
  });
  $('body').on('change', 'select', app.handleRoomChange);
  app.init();
});

