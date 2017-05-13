angular.module('starter.services', [])


.factory('ArticlesFactory', ['$http', function ArticlesFactory($http) {
  var articles;
  return {
    set: function(list) {
      //debugger;
      articles = list;
    },
    all: function() {
      return $http({method: 'GET', url:'rssFeed.json'});
    },
    remove: function(article) {
      articles.splice(articles.indexOf(article), 1);
    },
    get: function(articleId) {
      //debugger;
      for (var i = 0; i < articles.length; i++) {
        if (articles[i].$$hashKey === articleId) {
          return articles[i];
        }
      }
      return null;
    }
  };
}]);
