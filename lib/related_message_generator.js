MAX_REPLY = 3
TEXT_MIN_LENGTH = 20

var ReplyGenerator = function(books, user_id) {
  this.books = books;
  this.userId = user_id;
}

ReplyGenerator.prototype.generate = function() {
  var replies = this.books.map(book => this.getRelated(book));
  replies = new Set([].concat.apply([], replies));
  replies = Array.from(replies);
  replies.sort( function() { return 0.5 - Math.random() } );
  replies.slice(0, MAX_REPLY).forEach(reply => {
    Messages.insert(reply);
  });
  var reply_number = replies.slice(0, MAX_REPLY).length; 
  fetch_from_douban(
    this.userId, 
    books[0], 
    MAX_REPLY - reply_number, 
    douban_number => {this.finishFetchFromDouban(douban_number + reply_number)}
  );
  this.books.slice(1).forEach(book => {
    fetch_from_douban(this.userId, books[0], 0);
  });
}

ReplyGenerator.prototype.finishFetchFromDouban = function(num_reply) {
  var user = Meteor.users.findOne(this.userId);
  var reply_text = '阿云为' + user.profile.name + 
    '找到了' + num_reply +'条相关评论。好开心！如果厌烦我的自动回复的话，请在发言里加@号，这样' +
      '我就不来打搅你啦。也可以@别的朋友哦。';
  if (num_reply == 0) {
    reply_text = '非常不好意思，阿云没有为' + user.profile.name + 
      '找到任何相关评论，这都是阿云的错，请再给我一次机会！' +
      '发表书评的时候，书名请打上书名号。可以换一本更大众的书试一试~' + 
      '如果厌烦我的自动回复的话，请在发言里加@号，这样' +
      '我就不来打搅你啦。也可以@别的朋友哦。';
  }
  admin_reply(this.userId, reply_text);
}

ReplyGenerator.prototype.getRelated = function(book) {
  var replies = [];
  Text.find({
    text: {$regex: ".*" + book + ".*"},
    user_id: {$nin: [this.userId, ADMIN._id]}
  }).forEach(text => {
    if (text.text.length < TEXT_MIN_LENGTH || is_bad_content(text.text)) {
      return; 
    }  
    replies.push({
      timestamp: new Date(),
      user_id: this.userId,
      text_id: text._id,
      type: 'receive',
      text: text.text,
    });
  });
  return replies;
}

generate_related_relpy = function(books, user_id) {
    var reply_generator = new ReplyGenerator(books, user_id);
    reply_generator.generate();
}


