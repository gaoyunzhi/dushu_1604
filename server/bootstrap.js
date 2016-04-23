Meteor.startup(function () {
  if (Accounts.findUserByEmail(Meteor.settings.admin.email) == undefined) {
    result = Accounts.createUser({
      email: Meteor.settings.admin.email,
      password: Meteor.settings.admin.password,
      username: '阿云',
      topic: '读书，人生',
      goal: '交朋友',
      intro: '上海人，程序员，喜爱技术，也爱读书。最近迷茫中，正在探索人生的意义。\n' +
        '我有志帮助这个世界，也常常为自己的脆弱打败。\n心有猛虎，细嗅蔷薇。',
      score: 10.1
    });
  }
  ADMIN = Accounts.findUserByEmail(Meteor.settings.admin.email);
  if (AdminID.find().count() == 0) {
    AdminID.insert({admin_id: ADMIN._id});
  }  
});