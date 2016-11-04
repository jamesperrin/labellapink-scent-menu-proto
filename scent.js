		//===================================
		// Document Ready
		//===================================
		$(document).ready(function(){
			ScentMenu.init();
		});// end document ready

		var ScentMenu = new function () {
			//~~~~~~~~~~~~~~~~~~~~~~
			// Declared variables
			//~~~~~~~~~~~~~~~~~~~~~~
			var xmlData = 'http://www.labellapink.com/api/scent_menu/scents.xml';
			var catArray = new Array();
			var myCategory = '';

			this.init = function () {
				//~~~~~~~~~~~~~~~~~~~~~~
				// Call LoadCatArray Function
				//~~~~~~~~~~~~~~~~~~~~~~
				ScentMenu.LoadCatArray();

				ScentMenu.CategoriesAll();
				$('#divCategory').html('<p>Scents A to Z</p>');

				//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				// Handles click event for Category list
				//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~	
				$('#CatMenu').on("click keypress", "li", function () {

					var $_selected = $(this).text();

					if ($_selected === 'Scents A to Z') {
						ScentMenu.CategoriesAll();
					}
					else {
						ScentMenu.Categories($_selected);
					}

					$('#divCategory').empty();
					$('#divCategory').html('<p>' + $_selected + '</p>');

				});
			};

			this.ErrorMessage = function (e) {
				$('#ScentList').empty();
				$('#ScentList').html('<p>ERROR: Data source invalid.</p>');
			};

			this.CategoriesAll = function () {
				$.ajax({
					type: "GET",
					url: xmlData,
					dataType: "xml",
					success: function (xmlData) {

						$('#ScentList').empty();

						$(xmlData).find('scent').each(function () {
							var $_scent = $(this);
							var $_html = '';

							$_html += '<ul id="scents" class="list-inline2">';
							$_html += '<li class="scentname">' + $_scent.attr('scentname') + '</li>';
							$_html += '<li class="picture"><img src="http://www.labellapink.com/' + $_scent.find('picture').text() + '" alt="LaBellaPink ' + $_scent.attr('scentname') + ' scent" title="LaBellaPink scent ' + $_scent.attr('scentname') + '"/></li><li class="description">' + $_scent.find('description').text() + '</li>';
							$_html += '</ul>'

							$('#ScentList').append($_html);

						}); // End data for each scent
					}, // end success
					error: function () {
						ScentMenu.ErrorMessage();
					} // end error
				}); // end ajax
			}; // End Categories Function

			//===================================
			// Displays data based on base argument
			//===================================
			this.Categories = function (myCategory) {
				$.ajax({
					type: "GET",
					url: xmlData,
					dataType: "xml",
					success: function (xmlData) {
						$('#ScentList').empty();
						$(xmlData).find('scent').each(function () {
							var $_scent = $(this);
							var $_html = '';
							var $_categories = $_scent.find('categories');
							$_categories.find('category').each(function () {
								if ($(this).text() == myCategory) {
									$_html += '<ul id="scents" class="list-inline2">';
									$_html += '<li class="scentname">' + $_scent.attr('scentname') + '</li>';
									$_html += '<li class="picture"><img src="http://www.labellapink.com/' + $_scent.find('picture').text() + '" alt="LaBellaPink ' + $_scent.attr('scentname') + ' scent" title="LaBellaPink scent ' + $_scent.attr('scentname') + '"/></li><li class="description">' + $_scent.find('description').text() + '</li>';
									$_html += '</ul>'
								} //End
							}); // Categories find
							$('#ScentList').append($_html);
						}); // End data for each scent
					}, // end success
					error: function () {
						ScentMenu.ErrorMessage();
					} // end error
				}); // end ajax
			}; // End Categories Function

			//===================================
			// Generates menu from Categories Array
			//===================================
			this.CategoryList = function() {
				var $_newHTML = [];
				$('#CatMenu').empty();
				$('#CatMenu').append('<ul id="CategoryList" class="list-inline2"></ul>');

				$_newHTML.push('<li id="allScents" title="LaBellaPink scents from A to Z">Scents A to Z</li>');

				$.each(catArray, function ($_index, $_value) {
					$_newHTML.push('<li class="notCurrent" title="LaBellaPink ' + $_value + ' scent category">' + $_value + '</li>');
				});

				$("#CategoryList").html($_newHTML.join(""));
			};

			//===================================
			// Loads Categories into an array
			//===================================
			this.LoadCatArray = function () {
				$.ajax({
					type: "GET",
					url: xmlData,
					dataType: "xml",
					success: function (xmlData) {
						$(xmlData).find('scent').each(function () {
							var $_scent = $(this);
							var $_categories = $_scent.find('categories');
							$_categories.find('category').each(function () {
								var $_CategoryName = $(this).text();
								if (jQuery.inArray($_CategoryName, catArray) == -1) {
									catArray.push($_CategoryName);
								}
							}); // Categories find
						}); // End data for each scent
					}, // end success
					error: function () {
						ScentMenu.ErrorMessage();
					} // end error
				}).done(function () {
					//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					// Alpha Sorts Category Array
					//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					catArray.sort(ScentMenu.SortByName);

					//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					// Display list of categories
					//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					ScentMenu.CategoryList();
				}); // end ajax
			}; // END LoadCatArray

			//===================================
			// This will sort your array
			//===================================
			this.SortByName = function ($_a, $_b) {
				var $_aName = $_a.toLowerCase();
				var $_bName = $_b.toLowerCase();
				return (($_aName < $_bName) ? -1 : (($_aName > $_bName) ? 1 : 0));
			};
		};