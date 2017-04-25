var app = angular.module('app', ['ui.grid', 'ui.grid.selection','ngDraggable']);

app.factory('tweetService', function ($rootScope) {
    var tweetID = 0;
    var setTweet = function (id) {
        tweetID = id;
        $rootScope.$broadcast('tweetChanged', id);
    };
    var getTweet = function()
    {
        return tweetID;
    }
    return {
        setTweet: setTweet,
        getTweet: getTweet
    };
});

app.controller('MainCtrl', ['$scope', '$http', '$interval', 'uiGridConstants','tweetService', function ($scope, $http, $interval,  uiGridConstants, tweetService) {
    $scope.gridOptions = { enableRowSelection: true, enableRowHeaderSelection: false, showGridFooter: true };

    $scope.gridOptions.columnDefs = [
      { name: 'text', displayName: 'Text',cellClass: 'noborder' },
    ];

    $scope.gridOptions.multiSelect = false;
    $http.get('/api/Tweets', {
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem("accessToken")
        }
    })
      .success(function (data) {
          $scope.gridOptions.data = data;
          // $interval whilst we wait for the grid to digest the data we just gave it
          $interval(function () { $scope.gridApi.selection.selectRow($scope.gridOptions.data[0]); }, 0, 1);
      });

    $scope.gridOptions.multiSelect = false;
    $scope.gridOptions.modifierKeysToMultiSelect = false;
    $scope.gridOptions.noUnselect = true;
    $scope.gridOptions.enableHorizontalScrollbar = 0;
    $scope.gridOptions.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            //$scope.selectedItem = row.entity;
            tweetService.setTweet(row.entity.id);
           //alert(row.entity.id);
        });
    };
}]);

app.controller('TagsController', ['$scope', '$http', 'tweetService', function ($scope, $http, tweetService) {
    $http.get('/api/Tags').success(function (data) {
        $scope.tags = data;
    });
  
    $scope.onDragComplete = function (data, evt) {
        //alert(data.tag.id);
    }
}]);

app.controller('DropController', ['$scope', '$http', 'tweetService', function ($scope, $http, tweetService) {
    $scope.droppedObjects = [];
    $scope.onDropComplete = function (data, evt) {
        $scope.droppedObjects.push(data);
    }
}]);

app.controller('KeywordsController', ['$scope', '$http', 'tweetService', function ($scope, $http, tweetService) {
    $scope.keywordTags = [];
    $scope.$on('tweetChanged', function (response) {
        //alert('ss');
        $http.get('/api/Keywords?tweetid=' + tweetService.getTweet()).success(function (data) {
            $scope.data = data;
        });
        $http.get('/api/Tags').success(function (data) {
            $scope.tags = data;
        });
        $http.get('/api/Tweets?id='+tweetService.getTweet()).success(function (data) {
            $scope.tweet = data;
        });
        $("mainBtn").disabled = false;
        $scope.droppedObjects = [];
    });
    //
    $scope.droppedObjects = [];
    $scope.onDropComplete = function (data, evt) {
        var item = { key: evt.dropedAtEl.context.parentElement.id, value: data };
        //alert(evt.dropedAtEl.context.parentElement.id); //keyword
        $scope.droppedObjects.push(item); //tag
    }
    //
    $scope.getData = function(condition)
    {
        var tags = [];
        //tags = $scope.droppedObjects;

        //
        for(i=0;i<$scope.droppedObjects.length;i++)
        {
            if($scope.droppedObjects[i].key == condition.id)
            {
                tags.push($scope.droppedObjects[i].value)
            }
        }
        return tags;
    }
    $scope.RemoveTag = function(tag)
    {
        for (i = 0; i < $scope.droppedObjects.length; i++) {
            if ($scope.droppedObjects[i].value.tag.id == tag.tag.id) {
               $scope.droppedObjects.splice(i,1);
            }
        }
    }
    //
    $scope.OnTagClicked = function(keyId, tagId, indicator)
    {
        //$("#keyword" + keyId).css("background", "#d9edf7");
        //$("#keyword" + keyId + tagId).css("display", "inline");
        //var obj = { 'TagId': tagId, 'KeywordId': keyId };
        //$scope.keywordTags.push(obj);

        //Find the number of tags for that keyId
        var itemExists = false;
        var numKeyItems = 0;
        var spliceIndex = 0;
        for(var i =0; i < $scope.keywordTags.length; i++)
        {
            var item = $scope.keywordTags[i];
            //
            if(item.KeywordId == keyId && item.TagId == tagId)
            {
                itemExists = true;
                spliceIndex = $scope.keywordTags.indexOf($scope.keywordTags[i]);
                //continue;
            }
            if(item.KeywordId ==keyId)
            {
                numKeyItems++;
            }
        }
       // Check if the combination exits
        if(!itemExists)
        {
            $("#keyword" + keyId).css("background", "#d9edf7");
            $("#keyword" + keyId + tagId).css("display", "inline");
            var obj = { 'TagId': tagId, 'KeywordId': keyId };
            $scope.keywordTags.push(obj);
            numKeyItems++;
        }
        else
        {
            $scope.keywordTags.splice(spliceIndex, 1);
            numKeyItems--;
            $("#keyword" + keyId + tagId).css("display", "none");
        }
        //alert(numKeyItems);
        if(numKeyItems <= 0)
        {
            //alert('here');
            $("#keyword" + keyId).css("background", "white");

        }
        if(indicator == 1)
        {
            for(var j=0;j< $scope.data.fromText.length;j++)
            {
                var item = $scope.data.fromText[j];
                if(item.id == keyId)
                {
                    if (!itemExists)
                        $scope.data.fromText[j].tagCount++;
                    else
                        $scope.data.fromText[j].tagCount--;
                }
            }
        }
        if(indicator == 2)
        {
            for (var j = 0; j < $scope.data.fromHashtag.length; j++) {
                var item = $scope.data.fromHashtag[j];
                if (item.id == keyId) {
                    if (!itemExists)
                        $scope.data.fromHashtag[j].tagCount++;
                    else
                        $scope.data.fromHashtag[j].tagCount--;
                }
            }
        }
        if(indicator == 3)
        {
            for (var j = 0; j < $scope.data.fromURL.length; j++) {
                var item = $scope.data.fromURL[j];
                if (item.id == keyId) {
                    if (!itemExists)
                        $scope.data.fromURL[j].tagCount++;
                    else
                        $scope.data.fromURL[j].tagCount--;
                }
            }
        }
    }

    $scope.PostChanges = function()
    {
        //$scope.newKeywordTags = [];
        for (i = 0; i < $scope.droppedObjects.length; i++)
        {
            var obj = $scope.droppedObjects[i];
            var newObj = { 'KeywordId': parseInt(obj.key), 'TagId': parseInt(obj.value.tag.id) };
            //var obj = { 'TagId': tagId, 'KeywordId': keyId };
            //
           $scope.keywordTags.push(newObj);
        }
        $http({
            url: 'api/KeywordTags',
            method: "POST",
            isArray: true,
            data: JSON.stringify($scope.keywordTags),
            headers: {
                "Content-Type": "application/json"
            }
        })
     .then(function (response) {
         $("mainBtn").disabled = true;
         alert('Response Saved ! Thanks');
     },
     function (response) { // optional
         // failed
     });
       
    }
    //$scope.whateerfunction = function (keyid,tagid) {
    //    $scope.array = []
    //    var ojb = {tagid:tagid,}
    //    array.push(ojb)
    //}
}]);