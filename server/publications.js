Meteor.publish('messages', function () {
  return Messages.find({});
})

Meteor.publish('users', function () {
  return Meteor.users.find({},
    {fields: {_id: 1, username: 1, topic: 1, goal:1, intro:1, score: 1, status:1}}
  );
})

Meteor.publish('rooms', function () {
  return Rooms.find({});
})

// will need this later
Meteor.publish('admin_id', function () {
  return AdminID.find();  
});

Meteor.publish('reviews', function () {
  return Reviews.find({});  
});

