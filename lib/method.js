Meteor.methods({
  newMessage (text) {
    if (!this.userId) throw new Meteor.Error('not-logged-in');
    text_row = 
      {text: text, timestamp: new Date(), user_id: this.userId};
    text_id = Text.insert(text_row);
    message = {
      timestamp: new Date(),
      user_id: this.userId,
      text_id: text_id,
      type: 'send',
      text: text
    };
    Messages.insert(message);

    if (Meteor.isClient || text.indexOf('@') !== -1) return;
    books = TextParser.findBooks(text);
    generate_admin_relpy(books, this.userId);
    generate_related_relpy(books, this.userId);
  },

  welcome () {
    if (!this.userId) throw new Meteor.Error('not-logged-in');
    if (Meteor.isClient) return;
    var user = Meteor.users.findOne(this.userId);
    reply_text = user.profile.name + '，你好呀~ 欢迎欢迎。最近读了什么书，能告诉我吗？我可以倾听你，为你找到相关的' + 
      '书评。也可以为你找到爱书的同好，建立友谊。(发表书评的时候，书名请打上书名号，谢谢~)';
    admin_reply(this.userId, reply_text);
  },

  welcomeBack () {
    if (!this.userId) throw new Meteor.Error('not-logged-in');
    if (Meteor.isClient) return;
    var user = Meteor.users.findOne(this.userId);
    reply_text = user.profile.name + '，欢迎回来！最近读了什么书，能告诉我吗？我可以倾听你，为你找到相关的' + 
      '书评。也可以为你找到爱书的同好，建立友谊。如果厌烦我的自动回复的话，请在发言里加@号，这样' +
      '我就不来打搅你啦。也可以@别的朋友哦。';
    admin_reply(this.userId, reply_text);
  }
});