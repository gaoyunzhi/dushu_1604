var ScoreCard = {
  1: -0.3,
  2: -0.05,
  3: 0,
  4: 0.03,
  5: 0.1,
}

Meteor.methods({
  updateRoom(roomId, newTitle) {
  var room = Rooms.findOne({_id: roomId});
    if (!room) {
      console.error("Invalid room ID" + roomId);
      return;
    }
    Rooms.update(room._id, {
      $set: { 
        title: newTitle
      },
    });
  },

  changeRating(userId, rating) {
    var review = Reviews.findOne({reviewer: this.userId, reviewee: userId});
    var reviewId;
    var oldRate = 3;
    if (!review) {
      reviewId = Reviews.insert({
        reviewer: this.userId, reviewee: userId
      });
    } else {
      reviewId = review._id;
      oldRate = review.rate;
    }
    Reviews.update(
      reviewId,
      {detail: rating.detail, rate: rating.rate});
    if (Meteor.user().score <=0) {
      return; // bad user does not affact other's score
    }
    var scoreInc = Meteor.user().score * 
      (ScoreCard[rating.rate] - ScoreCard[oldRate]);

    // this should be transactional, but we should be fine now.  
    var reviewee = Meteor.users.findOne({_id: userId});
    Meteor.users.update(userId, {score: reviewee.score + scoreInc});
  },

  newMessage(message, roomId) {
    var room = Rooms.findOne({_id: roomId});
    if (!room) {
      console.error("Invalid room ID" + roomId);
      return;
    }
    var newUsers = new Set(room.users);
    newUsers.add(this.userId);
    Rooms.update(room._id, {
      $set: { 
        users: [...newUsers].sort(),
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