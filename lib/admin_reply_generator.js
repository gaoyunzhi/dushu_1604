var ReplyGenerator = function(books, user_id) {
    this.books = books;
    this.userId = user_id;
}

ReplyGenerator.prototype.generate = function() {
  var user = Meteor.users.findOne(this.userId);
  var reply_text = '收到' + user.profile.name + '对' + 
    this.books.map(book => '《' + book + '》').join('，') + 
    '的评论，谢谢。正在为您找寻相关评论。如对本软件有任何建议/投诉，请微信联系。';
  if (this.books.length == 0) {
    reply_text = user.profile.name + '，你好。请用书名号将书评括出，' +
      '方便阿云为您寻找相关评论，谢谢。如对本软件有任何建议/投诉，请微信联系。';
  }
  admin_reply(this.userId, reply_text);
}

generate_admin_relpy = function(books, user_id) {
    var reply_generator = new ReplyGenerator(books, user_id);
    reply_generator.generate();
}


