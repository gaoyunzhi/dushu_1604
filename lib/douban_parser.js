var DoubanParser = function(content, user_id, book) {
  this.content = content;
  // why a parser need user_id? because sometime a parser reply
  // message.. this is shitty design, but for now, let's leave
  // it here. 
  this.userId = user_id; 
  this.book = book;
  this.texts = [];
}

DoubanParser.prototype.getComments = function() {
  summary = this.pushSummary();
  var start_index = this.content.indexOf('<li class="comment-item">');
  while (start_index !== -1) {
    this.content = this.content.substr(start_index);
    var end_index = this.content.indexOf('</li>');
    var comment = this.content.substr(0, end_index);
    var text = this.parseComment(comment);
    if (text) {
      this.texts.push(text)
    }
    this.content = this.content.substr(end_index);
    start_index = this.content.indexOf('<li class="comment-item">');
  }
  return this.texts;
}

DoubanParser.prototype.pushSummary = function() {
  var start_pocker = '<strong class="ll rating_num " property="v:average">';
  var start_index = this.content.indexOf(start_pocker);
  this.content = this.content.substr(start_index + start_pocker.length);
  var rate = this.content.slice(0, 4).trim();
  start_pocker = '<span property="v:votes">';
  start_index = this.content.indexOf(start_pocker)
  this.content = this.content.substr(start_index + start_pocker.length);
  end_index = this.content.indexOf('</span>');
  var num_people = this.content.substr(0, end_index);
  // Does not mention the book name so that it wouldn't be searchable next
  // time. Yes, this is hacky, but currently I don't see the need to 
  // refactor it. If later we do refactor, add a searchable tag on the 
  // text.
  var text = '这本书在豆瓣上平分为' + rate +', 有' + num_people + '人评价。';
  var text_row = {
    text: text,
    timestamp: new Date(), 
    user_id: CRAWLER._id
  };
  var old_text = Text.findOne({text: text});
  var text_id;
  if (old_text) {
    text_id = old_text._id;
  }
  text_id = Text.insert(text_row);
  var reply = {
    timestamp: new Date(),
    user_id: this.userId,
    text_id: text_id,
    type: 'receive',
    text: text
  };
  Messages.insert(reply);
}

DoubanParser.prototype.parseComment = function(comment) {
  var start_pattern = '<p class="comment-content">';
  var start_index = comment.indexOf(start_pattern);
  var end_index = comment.indexOf('</p>');
  content = comment.substr(
    start_index + start_pattern.length,
    end_index - start_index - start_pattern.length);
  var comment_info_start = comment.indexOf('<span class="comment-info">');
  comment = comment.substr(comment_info_start);
  var author = comment.match('<a href="(.*)">(.*)<\/a>');
  author = author && author[2];
  // I will use the current date as date, if there is need, I can always find the
  // original post date.
  var text = content
  if (author) {
    text = text + ' (' + author + '评《' + this.book + '》)';
  }
  var text_row = {
    text: text,
    timestamp: new Date(), 
    user_id: CRAWLER._id
  };
  var old_text = Text.findOne({text: text});
  if (old_text) {
    return;
  }
  var text_id = Text.insert(text_row);
  if ((content.length > TEXT_MIN_LENGTH) && (!is_bad_content(content))) {
    return Text.findOne(text_id);
  }
}

parse_douban = function(content, user_id, book) {
  var parser = new DoubanParser(content, user_id, book);
  return parser.getComments();
};