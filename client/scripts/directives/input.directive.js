angular
  .module('Root')
  .directive('input', input);
 
// The directive enable sending message when tapping return
// and expose the focus and blur events to adjust the view
// when the keyboard opens and closes
function input ($timeout) {
  return {
    restrict: 'E',
    scope: {
      'returnClose': '=',
      'onReturn': '&',
      'onFocus': '&',
      'onBlur': '&'
    },
    link: link
  };
 
  ////////////
 
  function link (scope, element, attrs) {
    element.bind('focus', function (e) {
      if (!scope.onFocus) return;
 
      $timeout(function () {
        scope.onFocus();
      });
    });
 
    element.bind('blur', function (e) {
      console.log("hereblur");
      if (!scope.onBlur) return;
 
      $timeout(function () {
        scope.onBlur();
      });
    });
 
    element.bind('keydown', function (e) {
      console.log("herekeydown", e.which);
      if (e.which != 13 || e.metaKey || e.shiftKey) return;
 
      if (scope.returnClose) {
        element[0].blur();
      }
      console.log("herekeydown1", e.which);
      if (scope.onReturn) {
        console.log("herekeydown2", scope);
        $timeout(function () {
          scope.onReturn();
        });
      }
    });
  }
}