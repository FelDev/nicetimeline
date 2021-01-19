<script context="module"> 
  import TheTimeline from './TheTimeline.js';
  import {closeModal} from './modals/ModalsCommon.svelte'
  
  export async function saveTimeline(token) {
    let timelineData = TheTimeline.getTimeline();
    
    const response = await fetch('/.netlify/functions/save-timeline', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ timelineData: timelineData }),
    })
    const data = await response.json();
    console.log('@data: ', data);

    TheTimeline.setTimelineID(data.id);
    // #TODO: success message
  }

  export async function loadTimelines(token) {
    const response = await fetch('/.netlify/functions/load-timelines', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    const data = await response.json();
    console.log('@data: ', data);
    
    return data.ids.data
  }

  export async function loadTimeline(timelineID) {
    console.log('@timelineID: ', timelineID);
    let token;
    try {
      token = await netlifyIdentity.currentUser().jwt(true);
    } catch (err) {
      token = false;
    }
    const response = await fetch('/.netlify/functions/load-timeline', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ timelineID: timelineID })
    })
    const data = await response.json();
    console.log('@data: ', data);
    
    data.timeline.lines = JSON.parse(data.timeline.lines); // because the JSON for lines is just stringified without much fanciness in the DB
    TheTimeline.loadTimeline(data.timeline)
    return closeModal('modalLoadTimeline');
  }
</script>