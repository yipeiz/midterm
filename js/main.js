/* ================================
Week 6 Assignment: Midterm Functions + Signatures
================================ */

var map = L.map('map', {
  center: [41.847716, -87.637431],
  zoom: 12
});

var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
});

var PointString = "https://raw.githubusercontent.com/yipeiz/JS_Midterm/master/world_community_point.json";
var CountString = "https://raw.githubusercontent.com/yipeiz/JS_Midterm/master/tripcount.json";
var downloadData = $.ajax(PointString);
var downloadCounts = $.ajax(CountString);
$('#text-input1').val(35);

downloadData.done(function(data){
  downloadCounts.done(function(counts){
    var parsedPoints = JSON.parse(data);
    var parsedCounts = JSON.parse(counts);
    var chosenMarkers = [];
    var chosenCircles = [];


    var myPoints = _.map(parsedPoints.features, function(theP){
     return {
       "community": theP.attributes.area_numbe,
       "lng": theP.geometry.y,
       "lat": theP.geometry.x};
    });
    var myMarkers = _.map(myPoints, function(theP){
       return L.marker([theP.lng, theP.lat]);
    });

    var theA = Array.apply(null, {length: 77}).map(Number.call, Number);
    var myCircles = _.map(theA, function(i){
       return L.circleMarker([parsedPoints.features[i].geometry.y, parsedPoints.features[i].geometry.x],{
              color: 'red',
              fillColor: '#f03',
              fillOpacity: 0.5,
              radius: Math.log(parsedCounts[i].Counts) * 5
          });
    });

    var addMap = function(){
      _.each(myMarkers, function(theP){
          map.removeLayer(theP);
      });
      map.removeLayer(chosenCircles);

      map.setView([41.847716, -87.637431], 12);
      Stamen_TonerLite.addTo(map);
    };

    var plotPoints = function(){
      _.each(myCircles, function(theC){
          map.removeLayer(theC);
        });

      _.each(myMarkers, function(theP){
        theP.addTo(map);
      });

      var group = new L.featureGroup(myMarkers);
      map.fitBounds(group.getBounds());
    };

    var plotCircles = function(){
      console.log(chosenMarkers);
      if (chosenMarkers.length > 0){
        map.closePopup();
        _.each(chosenMarkers, function(theCP){
          map.removeLayer(theCP);
        });
      }
      _.each(myMarkers, function(theP){
        map.removeLayer(theP);
      });
      _.each(myCircles, function(theC){
        theC.addTo(map);
      });

      var group = new L.featureGroup(myCircles);
      map.fitBounds(group.getBounds());
    };

    var plotCP = function(){
      console.log(chosenCircles);
      map.removeLayer(chosenCircles);

      var theNum = parseInt($('#text-input1').val());
      if (theNum > 77) {
        theNum = "77";
      } else if (theNum < 1) {
        theNum = "1";
      } else {
        theNum = theNum.toString();
      }

      var chosenPoints = _.filter(myPoints, function(theP){
         return theP.community == theNum;
      });
      chosenMarkers = _.map(chosenPoints, function(theCP){
         return L.marker([theCP.lng, theCP.lat]);
      });
      //console.log($('#text-input1').val().toString());
      _.each(myCircles, function(theC){
        map.removeLayer(theC);
      });

      _.each(chosenMarkers, function(theCM){
        theCM.addTo(map).bindPopup("This is Community "+ theNum).openPopup();
        map.setView([theCM._latlng.lat, theCM._latlng.lng], 15);
      });
    };

    var plotCC = function(){
      if (chosenMarkers.length > 0){
        map.closePopup();
        _.each(chosenMarkers, function(theCP){
          map.removeLayer(theCP);
        });
      }

      var theNum = parseInt($('#text-input1').val());
      if (theNum > 77) {
        theNum = "77";
      } else if (theNum < 1) {
        theNum = "1";
      } else {
        theNum = theNum.toString();
      }

      var chosenCP = _.filter(parsedPoints.features, function(theF){
        return theF.attributes.area_num_1 == theNum;
      });

      console.log(chosenCP);
      console.log(Math.exp( Math.log(5)));
      _.each(chosenCP, function(theCP){
         chosenCircles = L.circleMarker([theCP.geometry.y, theCP.geometry.x],{
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: Math.log(parsedCounts[theCP.attributes.FID].Counts) * 5
         });
        chosenCircles.addTo(map).bindPopup(parsedCounts[theCP.attributes.FID].Counts + " trips happened here.").openPopup();
        map.setView([theCP.geometry.y, theCP.geometry.x], 16);
      });

    };

    var showTitle = function(num){
      var theSt = "#TT" + (num+1).toString();
      $(".title").not(theSt).hide();
      $(theSt).show();
    };

    var theCount = 0;
    var operations = function(count){
      switch (count){
        case 0:
          $('#previous').hide();
          showTitle(theCount);
          addMap();
          break;
        case 1:
          $('#previous').show();
          showTitle(theCount);
          plotPoints();
          break;
        case 2:
          showTitle(theCount);
          plotCircles();
          break;
        case 3:
          showTitle(theCount);
          $('#next').show();
          plotCP();
          break;
        case 4:
          showTitle(theCount);
          $('#next').hide();
          plotCC();
          break;
      }
    };

    operations(theCount);

    $( "#next" ).click(function() {
        theCount += 1;
        if(theCount > 4){
          theCount = 0;
        }
        operations(theCount);
    });

    $( "#previous" ).click(function() {
        theCount -= 1;
        if(theCount < 0){
          theCount = 4;
        }
        operations(theCount);
    });

  });
});
