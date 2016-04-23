var bad_pattern = {
  "？": 10,
  "?": 10,
  "！": 20,
  "!": 20,
  "喂": 40,
  "卵": 20,
  "呵呵": 50,
};


is_bad_content = function(content) {
  var score = 0;
  Object.keys(bad_pattern).forEach(pattern => {  
    score += (content.split(pattern).length - 1) * bad_pattern[pattern];
  });
  if (score > content.length) {
    return true;
  }
  if (content.indexOf('。') == -1) {
    return true;
  }
}