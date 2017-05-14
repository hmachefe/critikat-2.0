
var DEVICE_WIDTH_THRESHOLD = 412;

// THIS DOESN'T WORK
var app = angular.module('starter.controllers')
.controller('lastArticlesCtrl', function($scope, ArticlesFactory, $timeout, $ionicLoading) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});


  $scope.formatDate = function(date) {
    var newDate = new Date(date);
    var daysList = new Array( "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche" );
    var monthsList = new Array( "Janvier", "Férvier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout" , "Septembre", "Octobre", "Novembre", "Décembre");

    var newDayInteger = newDate.getDay() - 1;
    var newDayString = daysList[newDayInteger];

    var newMonthInteger = newDate.getMonth();
    var newMonthString = monthsList[newMonthInteger];

    var newYear = newDate.getFullYear();
    var newMonthString = monthsList[newMonthInteger];

    return newDayString + " " + newDayInteger + " " + newMonthString + " " + newYear;
      //$scope.setCurrEntry(entry);
      //$location.path('/detail');
    };


  // Setup the loader
  $ionicLoading.show({
  template: '<ion-spinner icon="spiral" class="spinner-assertive"></ion-spinner>',
  animation: 'fade-in',
  showBackdrop: true,
  maxWidth: 200,
  showDelay: 0
  });
  //$scope.articles = [];

  ArticlesFactory.all().success(function(response) {
    //debugger;
    $scope.articles = response;
    ArticlesFactory.set($scope.articles);
    console.log($scope.articles);
    //console.log($scope.stories[0].image);
    //console.log($scope.stories[3].synopsis);
    /*
    var element = document.body.querySelector("#curlList");
    $scope.$evalAsync(function() {
      // Finally, directives are evaluated
      // and templates are renderer here
      var children = element.children();
      console.log(children);
    });
    */
    /*
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
      console.log(children);
    });*/

    $timeout(function() {
      $ionicLoading.hide();
      stroll.bind('ul.list');
    }, 1000);
  });

    $scope.checkIfDeviceIsWideEnough = function() {
    if (window.screen.width >= DEVICE_WIDTH_THRESHOLD) {
      return true;
    }

    return false;
    }

  /* $scope.layoutDone = function() {
    $scope.setLoading(false);
    $timeout(function() { // wait for DOM
      $('a[data-toggle="tooltip"]').tooltip();
    }, 100);
    $timeout(function() { // wait for DOM
    var labelArray = document.querySelectorAll("span.label");
    [].forEach.call(
      labelArray,
      function(item){
      //item.classList.remove("label");
      item.style.display = "none";
      }
    );
    [].forEach.call(
      labelArray,
      function(item){
      //item.classList.add("label");
      item.style.display = "inline-block";
      }
    );
    stroll.bind( 'ul' );
    }, 5000);
  }
  */

  $scope.viewDetail = function(entry) {
    debugger;
    $scope.setCurrEntry(entry);
    $location.path('/detail');
  }

    $scope.shrink = function(entry) {
  //return entry.slice(0, 140) + " (...)";
  return entry;
  }

  $scope.checkIfRequestedContentIsEmpty = function(requestedContent) {
    if (requestedContent !== undefined) {
      requestedContent = true;
    } else {
      requestedContent = false;
    }
    return requestedContent;
  }


  $scope.formatLabel = function(category) {
  return category;
  }


  $scope.remove = function(article) {
    Articles.remove(article);
  };


});


app.service('commonService', function() {
    var data = {};
    this.getData = function () {
        //debugger;
        return data;
    }
    this.setData = function (dataToSet) {
        //debugger;
        data = dataToSet;
    }
});


app.controller('lastArticleDetailCtrl', function($scope, $stateParams, ArticlesFactory, commonService) {
  //$scope.article = { }
  $scope.article = ArticlesFactory.get($stateParams.articleId);
  //debugger;
  gapi.client.load("youtube", "v3", function() {
      //yt api is ready
      console.log("readyy");
      var request = gapi.client.youtube.search.list(
        {
            part: "snippet",
            type: "video",
            q: $scope.article.title,
            maxResults: 3
        }
      );
      request.execute(function (response) {
          var videoId = response.items[0].id.videoId;
          console.log("videoId == " + videoId);
          var iframe = document.querySelector("iframe");
          //iframe.src = "http://www.youtube.com/embed/" + videoId;
          $scope.article.videoFrameUrlId = "http://www.youtube.com/embed/" + videoId;
          commonService.setData($scope.article);
      });
  });
})


.controller('teaserCtrl', function($scope, $stateParams, $sce, commonService) {
  $scope.getArticleTitle = function() {
    //debugger;
    var article = commonService.getData();
    //debugger;
    return article.title;
  };
  $scope.getArticleVideoFrameUrlId = function() {
    //debugger;
    var article = commonService.getData();
    console.log('getArticleVideoFrameUrlId  :  article.videoFrameUrlId == ', article.videoFrameUrlId);
    return $sce.trustAsResourceUrl(article.videoFrameUrlId);
  }
})
;
