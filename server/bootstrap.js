Meteor.startup(function () {
  if (Meteor.users.find(
    {username: Meteor.settings.admin.email}
  ).count() == 0) {
    result = Accounts.createUser({
      username: Meteor.settings.admin.email,
      password: Meteor.settings.admin.password,
      profile: {
        name: '阿云',
        wechat_id: 'fenxiangdushu',
      }
    });
    Accounts.createUser({
      username: Meteor.settings.crawler.email,
      password: Meteor.settings.crawler.password,
      profile: {
        name: '阿云看豆瓣',
        wechat_id: 'fenxiangdushu'
      }
    });
  }
  ADMIN = Meteor.users.findOne({username: Meteor.settings.admin.email});
  CRAWLER = Meteor.users.findOne({username: Meteor.settings.crawler.email});
  if (AdminID.find().count() == 0) {
    AdminID.insert({admin_id: ADMIN._id});
  }  
});