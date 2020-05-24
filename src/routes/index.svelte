<style>
	h1, figure, p {
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

	<h1>Great success!?!?!</h1>

	<figure>
		<img alt='Success Kid' src='successkid.jpg'>
		<figcaption>Have fun with Sapper!</figcaption>
	</figure>

	<p><strong>Try editing this file (src/routes/index.svelte) to test live reloading.</strong></p>

	<div bind:this={container}></div>
</PageTransition>


<script>
	import PageTransition from '../components/PageTransition.svelte'
  import { Timeline } from "vis-timeline/standalone";
  console.log("@Timeline: ", Timeline);
  console.log('@vis: ', vis);
  console.log('@vis: ', typeof vis);
  console.log('@vis.DataSet: ', vis.DataSet);
  let container;
  
  import { onMount } from 'svelte';
  onMount(() => {
    console.log('the component has mounted');
    // DOM element where the Timeline will be attached
    console.log('@container: ', container);
    
    // Create a DataSet (allows two way data-binding)
    var items = new vis.DataSet([
      { id: 1, content: "item 1", start: "2014-04-20" },
      { id: 2, content: "item 2", start: "2014-04-14" },
      { id: 3, content: "item 3", start: "2014-04-18" },
      { id: 4, content: "item 4", start: "2014-04-16", end: "2014-04-19" },
      { id: 5, content: "item 5", start: "2014-04-25" },
      { id: 6, content: "item 6", start: "2014-04-27", type: "point" }
    ]);
    console.log('@items: ', items);
    
    // Configuration for the Timeline
    let options = {
      horizontalScroll:true,
      zoomKey: 'ctrlKey',
    };

    // Create a Timeline
    var timeline = new vis.Timeline(container, items, options);

	});

</script>



