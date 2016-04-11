angular.module('mol.point-filters',['mol-point-filters-templates'])
.directive('pointsHistogram', [
  'MOLServices',
  function(MOLServices) {
    return {
      restrict: 'E',
      scope: {
        scientificname: '=scientificname',
        uncertainty: "=uncertainty",
        year: "=years",
        types:'=types',
        filters:'=filters',
        limit:"=limit"
      },
      templateUrl: 'mol-point-filters-control.html',
      controller: function($scope) {
        $scope.initialized=false;
        $scope._year = {min:1970, max:2015, nulls : false};
        $scope._uncertainty = {min:0, max:32000};
        $scope.steps = {"uncertainty_bucket":10,"year_bucket":11 };

        $scope.selected = {
          uncertainty: {min: 1, max: 9},
          year: {min: 4, max:11, nulls: false},
          limit: 5000
        };
        $scope.getBucketCt = function(type,bucket) {
          var ct =0;
          if($scope.histogram) {
          angular.forEach(
            $scope.histogram.histogram_values,
            function(values,i) {
              ct += ((values[type] == bucket && $scope.checkDataset(values)) ? values.ct : 0);
            }
          );
          return ct;
        } else {return null;}
        }

        $scope.updateBucketCounts = function() {
          if(!$scope.histogram) {return;}
          $scope.steps = {"uncertainty_bucket":1,"year_bucket":1 };

          angular.forEach(
            $scope.histogram.limits,
            function(val, type) {
              angular.forEach(
                $scope.histogram['{0}s'.format(type)],
                function(bucket_values, bucket) {
                  var bucket_ct = $scope.getBucketCt(type,bucket);
                  $scope.histogram.limits[type] = (bucket_ct>$scope.histogram.limits[type])?
                    bucket_ct : $scope.histogram.limits[type];
                  $scope.steps[type]++;
                }
              );
            });

          angular.forEach(
            $scope.histogram.uncertainty_buckets,
            function(bucket,id) {
              bucket.ct = $scope.getBucketCt('uncertainty_bucket',id);
              bucket.height = $scope.getBucketHeight('uncertainty_bucket',bucket);
            }
          );
          angular.forEach(
            $scope.histogram.year_buckets,
            function(bucket,id) {
              bucket.ct = $scope.getBucketCt('year_bucket',id);
              bucket.height = $scope.getBucketHeight('year_bucket',bucket);
            }
          )
        }

        $scope.checkDataset = function(values) {
          if($scope.types) {
            if($scope.types[values.type]) {
              if($scope.types[values.type].visible) {
                if($scope.types[values.type].datasets[values.dataset_id]) {
                  if($scope.types[values.type].datasets[values.dataset_id].visible) {
                    return true;
                  }
                }
              }
            }
          }
          return false;
        }

        $scope.getBucketHeight = function(type,bucket) {

          function logScale(n, base) {
            return Math.log(n*(base-1)+1) / Math.log(base);
          }
          var height=1;
          if($scope.histogram.limits[type]>=1) {
              height = 20*logScale((bucket.ct/$scope.histogram.limits[type]),15);
          }

          return "{0}px".format(Math.max(height,0.01));
        }



        $scope.updateTotals = function() {
          var i;

          if(!$scope.histogram) {return;}

          $scope.totals = {
            total: 0,
            combined: 0,
            uncertainty: 0,
            years: 0
          }


          angular.forEach(
            $scope.histogram.histogram_values,
            function(values,i) {
              if($scope.checkDataset(values)&&values.uncertainty_bucket >= $scope.selected.uncertainty.min
                && values.uncertainty_bucket<$scope.selected.uncertainty.max) {
                $scope.totals.uncertainty+=values.ct;
              }
              if($scope.checkDataset(values)&&((values.year_bucket>=$scope.selected.year.min
                && values.year_bucket<$scope.selected.year.max)||($scope.year.nulls&&!values.year_bucket))) {
                  $scope.totals.years+=values.ct;
              }
              if($scope.checkDataset(values)&&(values.uncertainty_bucket >= $scope.selected.uncertainty.min
                && values.uncertainty_bucket<$scope.selected.uncertainty.max||!$scope.filters.uncertainty)
                &&(!$scope.filters.years||((values.year_bucket>=$scope.selected.year.min
                && values.year_bucket<$scope.selected.year.max)||($scope.year.nulls&&!values.year_bucket)))) {
                  $scope.totals.combined+=values.ct;
              }

              $scope.totals.total+=values.ct;


            }
          );
          $scope.updateModel();

        }

        $scope.updateModel = function() {
          $scope.year.min = $scope._year.min;
          $scope.year.max= $scope._year.max;
          $scope.uncertainty.min = $scope._uncertainty.min;
          $scope.uncertainty.max = $scope._uncertainty.max;
          $scope.limit = $scope.selected.limit;
        }

        $scope.$watch('year',
          function(newValue, oldValue) {
            if(newValue) {
              $scope.updateTotals();
            }
          },true
        );

        $scope.$watch('filters',
          function(newValue, oldValue) {
            if(newValue) {
              $scope.updateTotals();
            }
          },true
        );

        $scope.$watch(
          'selected',
          function(newValue,oldValue) {
            if(newValue && $scope.histogram && $scope.initialized) {
              $scope._year.min = $scope.histogram.year_buckets[newValue.year.min].min;
              $scope._year.max= $scope.histogram.year_buckets[newValue.year.max-1].max;
              $scope._year.nulls = newValue.year.nulls;
              $scope._uncertainty.min = $scope.histogram.uncertainty_buckets[newValue.uncertainty.min].min;
              $scope._uncertainty.max = $scope.histogram.uncertainty_buckets[newValue.uncertainty.max-1].max;
              $scope.updateTotals();
            }
          },true);
          $scope.$watch(
            'types.points',
            function(newValue,oldValue) {
              if(newValue && $scope.histogram && $scope.initialized) {
                $scope.updateBucketCounts();
                $scope.updateTotals();
              }
            },true);
        $scope.$watch(
          'scientificname',
          function(newValue,oldValue) {
            if(newValue) {
              $scope.initialized=false;
              MOLServices(
                'pointshistogram',
                {"scientificname":newValue},
                true
              ).success(
                function(result) {
                  $scope.histogram = result;
                  $scope.histogram.limits = {"uncertainty_bucket":1,"year_bucket":1};
                  $scope.steps = {"uncertainty_bucket":1,"year_bucket":1 };

                  $scope.updateBucketCounts();
                  $scope.updateTotals();
                  $scope.updateModel()
                  $scope.initialized=true;
              });
            }
          }
        );


      }
    };
}]);
