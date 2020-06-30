<style>
  h1,
  figure,
  p {
    text-align: center;
    margin: 0 auto;
  }

  h1 {
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  figure {
    margin: 0 0 1em 0;
  }

  img {
    width: 100%;
    max-width: 400px;
    margin: 0 0 1em 0;
  }

  p {
    margin: 1em auto;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
</style>

<svelte:head>
  <title>Sapper project template</title>
</svelte:head>

<PageTransition>

  <h1>Nice Timeline</h1>
  <!-- <figure>
		<img alt='Success Kid' src='successkid.jpg'>
		<figcaption>Have fun with Sapper!</figcaption>
	</figure> -->

  <p>
    <strong>Try editing this timeline and do send feedback!</strong>
  </p>
  <label for="startDate">Start date</label>
  <input id="startDate" bind:value={options.min} type="date" />
  <label for="endDate">End date</label>
	<button on:click="{showAllGroups}">Show All Lines</button>
  <input
    id="endDate"
    bind:value={options.max}
    on:change={updateTimeline}
    type="date" />
  <h2>John Doe's life</h2>
  <div bind:this={container} />
</PageTransition>

<script>
  import PageTransition from "../components/PageTransition.svelte";
  import { Timeline } from "vis-timeline/standalone";
  import { onMount } from "svelte";
  let container;
  let timeline;
  let startDate = "2000-01-01";
	let endDate = "2100-01-01";
	let groups;
  let items;
  let options = {
    horizontalScroll: true,
    zoomKey: "ctrlKey",
    editable: {
      add: false,
      updateTime: true,
      updateGroup: true,
      remove: true,
      overrideItems: false
    },
    max: endDate,
    min: startDate,
    groupEditable: true,
    groupOrder: function(a, b) {
      return a.order - b.order;
    },
    groupOrderSwap: function(a, b, groups) {
      let v = a.order;
      a.order = b.order;
      b.order = v;
    },
    groupTemplate: function(group){
      var container = document.createElement('div');
      var label = document.createElement('span');
      label.innerHTML = group.content + ' ';
      container.insertAdjacentElement('afterBegin',label);
      var hide = document.createElement('button');
      hide.innerHTML = 'hide';
      hide.style.fontSize = 'small';
      hide.addEventListener('click',function(){
        groups.update({id: group.id, visible: false});
      });
      container.insertAdjacentElement('beforeEnd',hide);
      return container;
    }
      
  };
  onMount(() => {
    // Create a DataSet (allows two way data-binding)
    items = new vis.DataSet([
      { id: 1, content: "123 fake Street", start: "2000-04-20", end:"2012-12-12", group:"g1"},
      { id: 2, content: "456 famous avenue", start: "2012-12-13", end:"2015-05-05", group:"g1"},
      { id: 3, content: "789 college boulevard", start: "2015-05-06", end:"2018-06-22", group:"g1"},
      { id: 4, content: "666 elm Street", start: "2018-06-22", end: "2020-06-16", group:"g1"},
      { id: 6, content: "Joe's Garage", start: "2014-04-27", end: "2015-06-16", group:"g2" },
      { id: 7, content: "Evil Corp", start: "2016-07-27", end: "2020-06-06", group:"g2" },
      { id: 8, content: "Gap Year in Canada", start: "2015-06-27", end: "2016-06-22", group:"g3" },
      { id: 9, content: "Primary School", start: "2006-08-27", end: "2012-06-22", group:"g4" },
      { id: 10, content: "High School", start: "2012-08-27", end: "2019-06-22", group:"g4" },
      { id: 11, content: "College", start: "2019-08-27", end: "2022-06-22", group:"g4" },
    ]);
    groups = new vis.DataSet([
      {"content": "Address", "id": "g1", "order": 1, className:'openwheel'},
      {"content": "Work", "id": "g2", "order": 2, className:'openwheel'},
      {"content": "Travels", "id": "g3", "order": 3, className:'openwheel'},
      {"content": "School", "id": "g4", "order": 4, className:'openwheel'}
    ]);
    console.log("@groups: ", groups);
    // Configuration for the Timeline

    // Create a Timeline
		timeline = new vis.Timeline(container);
		timeline.setOptions(options);
		timeline.setGroups(groups);
		timeline.setItems(items);

  });
  function updateTimeline() {
    console.log("@updateTimeline", options);
    timeline.setOptions(options);
    // timeline.setWindow(startDate, endDate, { animation: { duration: 500, easingFunction: 'linear' } });
	}
	
	function showAllGroups(){
    groups.forEach(function(group){
      groups.update({id: group.id, visible: true});
    })
  };
</script>