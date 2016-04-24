Meteor.methods({
  newMessage(message, roomId) {
    var room = Rooms.findOne({_id: roomId});
    if (!room) {
      console.error("Invalid room ID" + roomId);
      return;
    }
    Rooms.update(room._id, {
      $set: { 
        lastMessage: message,
        lastUpdated: Date.now(),
        lastUpdatedUser: this.userId
      },
    });

    Messages.insert({
      timestamp: Date.now(),
      author: this.userId,
      room: room._id,
      text: message,
    });
  },

  createRoom (userId) {
    if (!Meteor.user()) throw new Meteor.Error('not-logged-in');
    var users = [this.userId, userId].sort();
    var room = Rooms.findOne({users});
    if (room) {
      return room._id;
    }

    var theOtherUser = Meteor.users.findOne({_id: userId});
    if (!theOtherUser) {
      console.error("Can not find the other user to create chat room" + userId);
      return;
    }

    var roomId = Rooms.insert({
      users: users,
      lastMessage: generate_intro(Meteor.user()),
      lastUpdated: Date.now(),
      lastUpdatedUser: this.userId,
      title: Meteor.user().username + ', ' + theOtherUser.username,
      creater: this.userId,
    });

    Messages.insert({
      timestamp: Date.now(),
      author: userId,
      room: roomId,
      text: generate_intro(theOtherUser),
    });

    Messages.insert({
      timestamp: Date.now(),
      author: this.userId,
      room: roomId,
      text: generate_intro(Meteor.user()),
    });
    
    return roomId;
  }
});