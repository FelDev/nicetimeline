import { writable, get } from 'svelte/store';
import jquery from "jquery";
import {isValidDate, makeValid} from './DateFormatChecker.svelte'
import {showModal} from './modals/ModalsCommon.svelte'

export const description = writable("");
export const title = writable("");
export const changesSaved = writable(false );

export default {
	setupTimeline,
	loadTimeline,
	addLine,
	deleteLine,
	updateLineName,
	changeStartDate,
	changeEndDate,
	addEvent,
	editEvent,
	moveToFirstItem,
	showAllLine,
	clearTimeline,
	exportTimeline,
	showDemoTimeline,
}

let option; // option contient toutes les options de configuration de la timeline
let item; // Ce DataSet contient toutes les périodes/événements 
let group; // Et toutes les lignes de la timeline sont dans group
let lineIDCount = 0;
let itemIDCount = 0;
let timeline;
let container;
// let itemTemplate;
let idTimeline;
let lineCount = 0; //lineCount utilisé pour la propriété order des timelines
let lineBeingEdited = {};

let editedItemID = null;

option = {
		horizontalScroll: true,
		zoomKey: "ctrlKey",
		zoomFriction: 33,
		editable: {
				add: false,
				updateTime: true,
				updateGroup: true,
				remove: true,
				overrideItems: false
		},
		groupEditable: true,
		groupOrder: function (a, b) {
				return a.order - b.order;
		},
		groupOrderSwap: function (a, b, groups) {
				let v = a.order;
				a.order = b.order;
				b.order = v;
		},
		groupTemplate: function (group) {
				let container = document.createElement('div');
				let label = document.createElement('span');
				label.innerHTML = group.content + ' ';
				container.insertAdjacentElement('afterBegin', label);
				// Cacher une ligne se fait via btnHide
				let btnHide = document.createElement('button');
				btnHide.innerHTML = 'Hide';
				btnHide.title = "Hide this line";
				btnHide.style.fontSize = 'small';
				btnHide.addEventListener('click', function () {
						hideGroup(group.id);
				});
				container.insertAdjacentElement('beforeEnd', btnHide);
				// Suppression d'une ligne se fait via btnEdit
				let btnEdit = document.createElement('button');
				btnEdit.innerHTML = 'Edit';
				btnEdit.title = "Modify or delete this line";
				btnEdit.style.fontSize = 'small';
				btnEdit.addEventListener('click', function () {
						lineBeingEdited.id = group.id;
						showModal("modalEditLine", "EditLine", {
								groupID: group.id,
								groupOrder: group.order
						})
				});
				container.insertAdjacentElement('beforeEnd', btnEdit);
				// Ajout d'événements se fait via btnAddEvent
				let btnAddEvent = document.createElement('button');
				btnAddEvent.innerHTML = '+';
				btnAddEvent.title = "Add an event";
				btnAddEvent.style.fontSize = 'small';
				btnAddEvent.addEventListener('click', function () {
						jquery('#newEventTitle').val("");
						jquery('#datePickerStart').val("");
						jquery('#datePickerEnd').val("");
						jquery('#newEventDesc').val("");
						lineBeingEdited.id = group.id;
						console.log('@lineBeingEdited: ', lineBeingEdited);
						
						showModal("modalAddEvent");
				});
				container.insertAdjacentElement('beforeEnd', btnAddEvent);
				return container;
		},
		max: "3000-01-01",
		min: "1000-01-01",
		snap: null,
		template: function (item) {
				return '<p>' + item.name + '</p>';
		},
		zoomMax: 31556952000000, //1000 ans
		zoomMin: 86400000 // 24 heures
};

function setupTimeline() {
	// #TODO: Make this a promise? return new Promise(function (resolve, reject) {
	// La timeline sera attachée à cet élément du DOM
	container = document.getElementById('timeline');
	item = new vis.DataSet();
	group = new vis.DataSet();
	console.log('@container: ', container);
	console.log('@item: ', item);
	console.log('@option: ', option);

	timeline = new vis.Timeline(container, item, option);
	timeline.setGroups(group);

	// Affichage des infos pour chaque items de la timeline + la faire fitter au complet sur double click
	timeline.on("doubleClick", function (properties) {
			let itemID = properties.item;
			let itemToShow = item.get(itemID)
			
			if (itemID == null) {
					timeline.fit();
			}
			else {
					let description = itemToShow.description == "" ? "(no description)" : itemToShow.description;
					document.querySelector("#modalInfoItem p:nth-of-type(1)").innerHTML = description;
					document.querySelector("#modalInfoItem header h6").innerHTML = itemToShow.name;
					
					showModal("modalInfoItem")
			}
	});

	// Gestion des clics sur les périodes/événements
	// Permet de modifier les infos de ceux-ci
	timeline.on('contextmenu', function (properties) {
		editedItemID = properties.item;
		if (editedItemID == null) {
				// On crée un nouvel événement à partir d'ici
				jquery('#newEventTitle').val("");
				jquery('#datePickerStart').val(makeValid(properties.snappedTime));
				jquery('#datePickerEnd').val("");
				jquery('#newEventDesc').val("");
				console.log('@lineBeingEdited: ', lineBeingEdited);

				lineBeingEdited.id = properties.group;
				console.log('@lineBeingEdited: ', lineBeingEdited);
				showModal("modalAddEvent");
		} else {
				let itemEdited = item.get(editedItemID);

				if (isValidDate(itemEdited.start)) {
						jquery("#editedEventDatePickerStart").val(itemEdited.start);
						jquery("#editedEventDatePickerEnd").val(itemEdited.end);
				} else {
						let start = makeValid(new Date(itemEdited.start));
						let end = makeValid(new Date(itemEdited.end));
						jquery("#editedEventDatePickerStart").val(start);
						jquery("#editedEventDatePickerEnd").val(end);
				}
				jquery("#editedEventTitle").val(itemEdited.name);
				jquery("#editedEventDescription").val(itemEdited.description);
				jquery("#editedEventColor").val(itemEdited.className);
				showModal("modalEditEvent")
		}
	});

	// #TODO: comment détecter les changements sur la timeline?
	// timeline.on('groupDragged', function () {
	// 		console.log("groupDragged");
	// })

}

function loadTimeline(info) {
  
  clearTimeline()

  // On garde le id de la timeline en rérérence pour la sauvegarder plus tard
  idTimeline = info.id;
  // On commence par mettre la timeline a jour avec les infos de base
  title.set(info.name);
  description.set(info.description);
  option.min = info.start_date;
	option.max = info.end_date;
	console.log('@doit');
	console.log('@info.start_date: ', info.end_date);
	 
  jquery('.dateIndicator:nth-of-type(1)').html(info.start_date);
  jquery('.dateIndicator:nth-of-type(2)').html(info.end_date);
  // if (info.public == 0) {
    // jquery("#checkBoxPrivate").prop('checked', true);
  // } else {
    // jquery("#checkBoxPrivate").prop('checked', false);
  // }

  // Faire le tour de toutes les lignes
  info.line.forEach(function (line, lineIndex) {
    group.add({
      id: lineIDCount,
      content: line.name,
      order: line.order,
      visible: true
    });
    // Faire le tour de toutes les périodes, pour chaque ligne
    line.allPeriod.forEach(function (period) {
      if (!period.start_date) {
        console.log('@period: ', period);
        
      }
      if (period.end_date == null) {
        item.add({
          id: itemIDCount,
          name: period.name,
          start: period.start_date,
          group: lineIDCount,
          description: period.description,
          "className": period.color,
          type: "point"
        });
      } else {
        item.add({
          id: itemIDCount,
          name: period.name,
          start: period.start_date,
          end: period.end_date,
          group: lineIDCount,
          description: period.description,
          "className": period.color
        });
      }
      itemIDCount++;
    });
    lineCount++;
    lineIDCount++;
  });

  timeline.setOptions(option);
  timeline.redraw();
  timeline.fit();

}

function addLine(lineName) {
	console.log('@TheTimeline; lineName: ', lineName);
	
		try {
				group.add({
						id: lineName,
						content: lineName,
						order: lineCount
				});
				lineCount++;
				changesSaved.set(false);
		} catch (err) {
				console.log(err)
				// #TODO: #BUG: only catches duplicates of newly added lines? (not of the Demo Timeline, at least)
				// Si la nouvelle ligne a le même nom qu'une ligne déjà existante, on avertit l'usager
				throw("lineNameTaken")
		}
}

function deleteLine() {
	group.remove({
			id: lineBeingEdited.id
	});
	// Il faut updater l'ordre des lignes qui sont après celle qu'on supprime
	group.forEach(element => {
			if (element.order >= lineBeingEdited.order) {
					group.update({
							id: element.id,
							order: element.order - 1
					});
			}
	});
	lineCount--;
	changesSaved.set(false);
}

function changeStartDate(newStartDate) {
	if (newStartDate > jquery(".dateIndicator:nth-of-type(2)").html()) {
			throw("Start date cannot be before end date!");
	} else {
			jquery(".dateIndicator:nth-of-type(1)").html(newStartDate);
			// Mise à jour des options de la timeline, puis on la redessine
			option.min = newStartDate;
			timeline.setOptions(option);
			timeline.setWindow(newStartDate, timeline.endDate, {
					animation: {
							duration: 500,
							easingFunction: 'linear'
					}
			});
			changesSaved.set(false);
	}
}

function changeEndDate(newEndDate) {
	if (jquery(".dateIndicator:nth-of-type(1)").html() > newEndDate) {
			throw("Start date cannot be before end date!");
	} else {
			jquery('.dateIndicator:nth-of-type(2)').html(newEndDate);
			// Mise à jour des options de la timeline, puis on la redessine
			option.max = newEndDate;
			timeline.setOptions(option);
			timeline.setWindow(timeline.startDate, newEndDate, {
					animation: {
							duration: 500,
							easingFunction: 'linear'
					}
			});
			changesSaved.set(false);
	}

}

function showAllLine() {
	group.forEach(function (g) {
			group.update({ id: g.id, visible: true });
	})
};

function hideGroup(groupID) {
    group.update({ id: groupID, visible: false });
}

function updateLineName(newLineName) {
	console.log('@newLineName: ', newLineName);
	console.log('@lineBeingEdited: ', lineBeingEdited);
	
	group.forEach((element) => {
		console.log('@element: ', element);
		
		if (element.id == lineBeingEdited.id) {
			console.log('@yay');
			
				group.update({
						id: element.id,
						content: newLineName,
				});
				element.id = newLineName;
				element.content = newLineName;
		}
	});
	changesSaved.set(false);
}

function addEvent(title, startDate, endDate, desc, color) {
	console.log('@lineBeingEdited: ', lineBeingEdited);
	
	let groupID = lineBeingEdited.id;
	console.log('@groupID: ', groupID);
	console.log('@startDate: ', startDate);
	console.log('@isValidDate(startDate): ', isValidDate(startDate));
	
	if (isValidDate(startDate)) {
			if (endDate == "") {
					item.add({
							id: itemIDCount,
							name: title,
							start: startDate,
							end: null,
							group: groupID,
							type: "point",
							description: desc,
							'className': color
					});
					itemIDCount++;
					changesSaved.set(false);
					// closeModal("modalAddEvent")
			} else if (isValidDate(endDate)) {
					if (jquery("#datePickerStart").val() > jquery("#datePickerEnd").val()) {
							jquery("#modalAddEvent p:last-of-type").html("Start date cannot be before end date!");
					} else {
							item.add({
									id: itemIDCount,
									name: title,
									start: startDate,
									end: endDate,
									group: groupID,
									description: desc,
									'className': color
							});
							itemIDCount++;
							changesSaved.set(false);
							// closeModal("modalAddEvent")
					}
			} else {
					throw("YYYY-MM-DD");
			}
	} else {
			throw("YYYY-MM-DD");
	}

}

function editEvent(title, startDate, endDate, color) {
	if (isValidDate(startDate)) {
			if (endDate == "") {
					// Mise à jour de l'item concerné (accès à celui-ci via son ID)
					item.update({
							id: editedItemID,
							type: "point",
							name: title,
							description: jquery("#editedEventDescription").val(),
							"className": color,
							start: startDate,
							end: null
					});

					editedItemID = null;
					changesSaved.set(false);
					// closeModal("modalEditEvent")
			} else if (isValidDate(endDate)) {
					if (startDate > endDate) {
							throw("Start date cannot be before end date!");
					} else {
							item.update({
									id: editedItemID,
									type: "range",
									name: title,
									description: jquery("#editedEventDescription").val(),
									"className": color,
									start: startDate,
									end: endDate
							});

							editedItemID = null;
							changesSaved.set(false);
							// closeModal("modalEditEvent")
					}
			} else {
					throw("YYYY-MM-DD");
			}
	} else {
			throw("YYYY-MM-DD");
	}
	timeline.redraw();

}

function moveToFirstItem() {
	// S'il y a au moins un item
	if (item.length > 0) {
			// Trouver la date du premier élément...
			let first = new Date(item.get()[0].start);
			item.forEach(i => {
					let d = new Date(i.start)
					if (d < first) {
							first = d
					}
			})
			// let minDate = item.min("start"); // should work but doesn't 🤷‍♀️
			// Et y aller!
			timeline.moveTo(first);
	}
}

function clearTimeline() {
  timeline.groupsData._data._data.forEach( g => {
    group.remove({
      id: g.id
    });
    lineCount--;
  })
  item.clear()
}

function exportTimeline() {
	console.log('@export...');
	
	let currentTitle = get(title);
	let allLine = [];
	let line = {
		content: null,
		order: null,
		id: null,
		allPeriod: []
	};
	let item = {
		name: null,
		description: null,
		color: null,
		start: null,
		end: null,
		group: null
	};
	let timelineGeneral = {
		id: idTimeline,
		version: 1.0,
		description: get(description),
		name: currentTitle,
		public: !(jquery("#checkBoxPrivate").is(":checked")),
		start_date: jquery(".dateIndicator:nth-of-type(1)").html(),
		end_date: jquery(".dateIndicator:nth-of-type(2)").html()
	};

	// Créer un tableau qui contient toutes les lignes
	timeline.groupsData._data._data.forEach(g => {
		line = {
			name: g.content,
			order: g.order,
			id: g.id,
			allPeriod: []
		}
		allLine.push(line);

	})

	// Puis ajouter tous les items (période) dans le tableau d'items de leur ligne respective
	timeline.itemsData.forEach(element => {
		item = {
			name: element.name,
			description: element.description,
			color: element.className,
			start_date: element.start,
			end_date: element.end,
			group: element.group
		};
		allLine.forEach(element => {
			if (element.id == item.group) {
				element.allPeriod.push(item);
			}
		});
	});

	console.log('@allLine: ', allLine);
	timelineGeneral.line = allLine;

	let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(timelineGeneral));
	let dlAnchorElem = document.getElementById('exportTimeline');
	dlAnchorElem.setAttribute("href", dataStr);
	let beginningOfFileName = currentTitle == "" ? "your_timeline" : currentTitle;
	const fileName = `${beginningOfFileName}_${makeValid(new Date())}.timeline`

	dlAnchorElem.setAttribute("download", fileName);
	dlAnchorElem.click();

}

function showDemoTimeline() {

	loadTimeline(
		{"id":"42","version":1,"description":"I use this timeline to reflect on how I've spent my time and how I will spend what's left.","name":"John Doe's life","public":true,"start_date":"2000-01-01","end_date":"2030-07-02","line":[{"name":"Adress","order":"0","id":4,"allPeriod":[{"name":"123 Fake street","description":"","color":"green","start_date":"2000-01-01","end_date":"2008-08-22","group":4},{"name":"456 famous avenue","description":"With my good friends Snoop Dogg and Mr. Quaker.","color":"default","start_date":"2008-08-23T00:00:00.000Z","end_date":"2010-07-27T23:58:18.814Z","group":4},{"name":"789 college boulevard","description":"That was nice","color":"default","start_date":"2016-02-05T13:14:32.459Z","end_date":"2018-10-10T20:03:33.622Z","group":4},{"name":"666 elm Street","description":"That was a little spooky","color":"default","start_date":"2010-08-06T00:18:26.309Z","end_date":"2014-04-26T04:55:00.939Z","group":4}]},{"name":"school","order":"2","id":5,"allPeriod":[{"name":"High School","description":"","color":"default","start_date":"2009-06-26T09:13:05.864Z","end_date":"2014-04-25T09:13:05.864Z","group":5},{"name":"Primary School","description":"","color":"default","start_date":"2003-11-24T04:52:38.928Z","end_date":"2009-03-07T04:52:38.928Z","group":5},{"name":"College","description":"ATM Prod","color":"default","start_date":"2016-02-15T19:29:56.639Z","end_date":"2018-10-21T19:29:56.639Z","group":5}]},{"name":"Work","order":"3","id":6,"allPeriod":[{"name":"Joe's Garage","description":"BusBoy","color":"default","start_date":"2006-04-16T10:25:24.916Z","end_date":"2008-07-13T01:23:36.837Z","group":6},{"name":"Evil Corp","description":"Assistant-Cuisinier","color":"default","start_date":"2018-06-06T13:42:59.089Z","end_date":"2020-10-03T19:41:54.737Z","group":6}]},{"name":"Traveling","order":4,"id":7,"allPeriod":[{"name":"Gap Year in Canada","description":"Full BackPack, full solo.","color":"default","start_date":"2014-05-25T11:49:01.753Z","end_date":"2016-02-27T18:20:44.441Z","group":7},{"name":"¡Cuba!","description":"First time I took an airplane!","color":"default","start_date":"2010-02-12","end_date":"2010-02-28","group":7}]},{"name":"Misc","order":"4","id":8,"allPeriod":[{"name":"COVID-19","description":"The WHO declared coronavirus was a global pandemic.","color":"default","start_date":"2020-03-11","group":8},{"name":"September 11th 2001","description":"The twin towers fall after Al Quaïda slams 2 planes into them. ","color":"default","start_date":"2001-09-11","group":8}]}]}
	)
}

