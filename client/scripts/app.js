
var myName = window.location.search.slice(10);
var app = {};

app.server = 'https://api.parse.com/1/classes/messages';
app.friends = {};
app.rooms = {};
app.rendered = false;
app.init = function() {
  app.fetch();
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
      var messages = data.results;
      for (var i = 0; i < messages.length; i++) {
        app.addRoom(messages[i]);
        app.renderMessage(messages[i]);
      }
      //app.clearRooms();
      if (!app.rendered) {
        app.renderAllRooms();
        app.rendered = true;
      }
      app.boldFriends();
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
      app.fetch('?where={"roomname": ' + JSON.stringify($('#roomSelect').find(':selected').text()) + ' }?order=-createdAt');
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

app.clearRooms = function() {
  $('#roomSelect').empty();
};

app.addRoom = function(message) {
  app.rooms[message.roomname] = message.roomname;
};

app.renderRoom = function(roomname) {
  $roomOption = $('<option></option>').val(roomname).text(roomname);
  $('#roomSelect').append($roomOption);
};

app.renderAllRooms = function() {
  app.renderRoom('lobby');
  for (var roomname in app.rooms) {
    if (roomname !== 'lobby') {
      app.renderRoom(app.rooms[roomname]);
    }
  }
};

app.handleUsernameClick = function (username) {
  if (!(username in app.friends)) {
    app.friends[username] = username;

  }
};

app.boldFriends = function () {
  for (friend in app.friends) {
    $('p.' + friend).addClass('bold');
  }
};

app.handleSubmit = function () {
  var formInfo = $('#send').serializeArray();
  $('#send').trigger('reset');
  var text = formInfo[0]['value'];
  var message = {};
  message.username = myName;
  message.text = text;
  message.roomname = $('#roomSelect').find(':selected').text();
  app.send(message);
};

$(document).ready(function() {
  $('body').on('click', '.username', function() {
    app.handleUsernameClick($(this).attr('username'));
    app.boldFriends();
  });
  $('.submit').on('click', function(e) {
    e.preventDefault();
    app.handleSubmit();    
  });
  $('body').on('change', 'select', function(e) {
    console.log(this);
    console.log(this.value);
    app.fetch('?where={"roomname": ' + JSON.stringify(this.value) + ' }?order=-createdAt');
  });
  app.init();
});


//add friend
//sort by friend
//escape
