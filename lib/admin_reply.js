admin_reply = function(user_id, text) {
  var text_row = {
    text: text,
    timestamp: new Date(), 
    user_id: ADMIN._id
  };
  var text_id = Text.insert(text_row);
  var reply = {
    timestamp: new Date(),
    user_id: user_id,
    text_id: text_id,
    type: 'receive',
    text: text,
  }
  Messages.insert(reply);
};