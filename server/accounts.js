Accounts.onCreateUser(function(options, user) {
  user.topic = options.topic;
  user.goal = options.goal;
  user.intro = options.intro;
  user.score = options.score;
  return user;
});