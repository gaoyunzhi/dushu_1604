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
  if (Accounts.findUserByEmail('1') == undefined) {
    result = Accounts.createUser({
        email: '1',
        password: '1',
        username: '大猫',
        topic: '喵喵一家',
        goal: '猫猫猫！',
        intro: '大猫',
        score: 0.1
      });
    result = Accounts.createUser({
        email: '2',
        password: '2',
        username: '二猫',
        topic: '喵喵一家',
        goal: '猫猫猫！',
        intro: '二猫',
        score: 0.1
      });
    result = Accounts.createUser({
        email: '3',
        password: '3',
        username: '三猫',
        topic: '喵喵一家',
        goal: '猫猫猫！',
        intro: '三猫',
        score: 0.1
      });
    result = Accounts.createUser({
        email: '4',
        password: '4',
        username: '四猫',
        topic: '喵喵一家',
        goal: '猫猫猫！',
        intro: '四猫',
        score: 0.1
      });
  }  
  ADMIN = Accounts.findUserByEmail(Meteor.settings.admin.email);
  if (AdminID.find().count() == 0) {
    AdminID.insert({admin_id: ADMIN._id});
  }  
});