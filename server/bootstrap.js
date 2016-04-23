Meteor.startup(function () {
  if (Meteor.users.find(
    {email: Meteor.settings.admin.email}
  ).count() == 0) {
    result = Accounts.createUser({
      email: Meteor.settings.admin.email,
      password: Meteor.settings.admin.password,
      username: '阿云',
      topic: '读书，人生',
      goal: '交朋友',
      intro: '上海人，程序员，喜爱技术，也爱读书。最近迷茫中，正在探索人生的意义。'
    });
  }
  ADMIN = Meteor.users.findOne({email: Meteor.settings.admin.email});
  if (AdminID.find().count() == 0) {
    AdminID.insert({admin_id: ADMIN._id});
  }  
});