<script context="module"> 
  import TheTimeline from './TheTimeline.js';
  
  // #RENDU ICI!!!
  export function saveTimeline(token) {
    let timelineData = TheTimeline.getTimeline();
    
    fetch('/.netlify/functions/save-timeline', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ timelineData: timelineData }),
    })
    .then((res) => res.json())
    .then((data) => {
      console.log('@data: ', data);
      TheTimeline.setTimelineID(data.id);
    });
  }
</script>