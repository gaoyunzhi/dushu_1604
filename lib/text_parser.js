MAX_BOOK_LEN = 10

var clean_up_bookname = function (book) {
  return book.replace('<','').replace('>','').
    replace('《','').replace('》','').trim();
}

TextParser = function() {}

TextParser.findBooks = function(text) {
    var books = [];
    var last = -1;
    for (var i=0; i<text.length; i++) {
        if (text[i] == '《' || text[i] == '<') {
            last = i + 1;
        }
        if (text[i] == '》' || text[i] == '>') {
            books.push(
                clean_up_bookname(text.substr(last, i - last))
            );
        }
    }
    if (books.length == 0 && text.length <= MAX_BOOK_LEN) {
        books.push(clean_up_bookname(text));
    } 
    return books;
}


