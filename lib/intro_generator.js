generate_intro = function(user) {
    return user.name + "对" + user.topic + "很感兴趣，Ta想在聊天中" + 
        user.goal + "。这是Ta的自我介绍：" + user.intro;
}