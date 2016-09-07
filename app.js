(function( module ){

})( angular.module('datatablesPoc',[]));

(function( module ) {
	var TableCtrl = function( $http, $scope ) {
		var ctrl = this;
		ctrl.option = 1;

		ctrl.getOptions = function() {
			if( ctrl.option === 1) {
				url = '/mock-data/options.json';
				ctrl.option = 2;
			} else {
				url = '/mock-data/options2.json';
				ctrl.option = 1;
			}

			$http.get( url ).then( function( options ) {
				ctrl.dtOptions = options.data;
			}, function( err ) {
				console.error( "Unable to fetch options correctly from server: ", err );
			});
		};

		ctrl.openOptionsModal = function() {
			$.bootModal( "Title", "Body", {});
		};

		$scope.open = function() {
			$.bootModal( "Title", "Body", {});
		}
		
		ctrl.getOptions();
	};

	module.controller( 'tableCtrl', TableCtrl );
})( angular.module('datatablesPoc'));

(function( module ) {
	var Datatable = function( $compile ) {
		return {
			restrict : "A",
			scope    : {
				dtOptions: '=',
				open     : '&'
			},
			controller : function( $scope ) {
				$scope.openModal = function() {
					alert( 'Hi');
				}
			},
			link     : function( scope, element, attr ) {
				/* Helper Function */
				function getColumnIndexesWithClass( columns, className ) {
				    var indexes = [];
				    
				    $.each( columns, function( index, columnInfo ) {
				        if( columnInfo.className == className ) {
				            indexes.push( index );
				        }
				    } );
				 
				    return indexes;
				}

				function adjustTableHeight() {
					var oTable = element.dataTable();
				    element.parent().css('height', calculateDatatableHeight());
				    if (oTable != "") {
				        oTable.fnAdjustColumnSizing();
				        oTable.fnDraw(true);
				    }
				    $compile(element.contents())(scope);
				}

				function calculateDatatableHeight() {
					var dtTop  		   = $('#datatable1_wrapper .dataTables_scroll').offset().top || 100,
						dtFooterHeight = $('#datatable1_info').closest('.row').outerHeight() || 40,
						dtHeaderHeight = $('#datatable1_wrapper .dataTables_scrollHead').outerHeight() || 40,
						buffer = 10, datatableHeight;

						datatableHeight = $(window).height() - (dtTop + dtFooterHeight + dtHeaderHeight + buffer);
						return datatableHeight + 'px';
				}

				/* Window Resize Event*/
				angular.element(window).resize(function(){
					adjustTableHeight();
			    });

				scope.$watch('dtOptions', function( currentOptions, oldOptions ) {
					if( currentOptions && typeof currentOptions === 'object' ) {
						var bootstrapDOM = 	"<'row'<'col-sm-6'i><'col-sm-6'f>>" +
											"<'row'<'col-sm-12'tr>>" +
											"<'row'<'col-sm-5'l><'col-sm-7'p>>";

						var dom =  currentOptions.colResize == true ? "Z" + bootstrapDOM : bootstrapDOM; // 'Z' options is required for column resizing
						element.DataTable( {
					        "ajax"		: currentOptions.ajax,
					        "colReorder": currentOptions.colReorder,
					        "responsive": currentOptions.responsive, // by default it is true, you can make it false if required
					        "columns"	: currentOptions.columns,
					        "columnDefs": [{
										    targets: getColumnIndexesWithClass( currentOptions.columns, "dt-position" ),
										    render: $.fn.dataTable.render.ellipsis( currentOptions['ellipsis-len'] || 30, true )
										  },{
										  	targets   : currentOptions.columns.length,
										  	"data"    : null,
										  	"visible" : true,
										  	"sortable": false,
										  	"title"   : "Action",
										  	render    : function (data, type, full) {
									            return '<a href="#" ng-click="open()">Process</a>';
									        }
										  }],
					        "dom"		: dom,
					        "scrollY" 	: "100vh",
					        "scrollCollapse" : true,
					        "initComplete" : adjustTableHeight,
					        "destroy" : $.fn.dataTable.isDataTable( element )
					    });
					}
				});
			}
		}
	};

	module.directive( 'datatable', Datatable );
})( angular.module('datatablesPoc'));

// (function( module ) {
// 	var OpenModal = function() {
// 		return {
// 			restrict : "A",
// 			scope    : {
// 				modaldata: '='
// 			},
// 			link : function( scope, element, attr ) {
// 				element.bind( 'click', function() {
// 					$.bootModal( "Title", "Body", {});
// 				});
// 			}
// 		}
// 	};
// 	module.directive( 'openModal', OpenModal );
// })( angular.module('datatablesPoc'));





