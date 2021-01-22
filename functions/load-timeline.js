// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { faunaFetch } = require('./utils/fauna');

exports.handler = async (event, context) => {
  // console.log('@event: ', event);
  const { timelineID } = JSON.parse(event.body);
  const { user } = context.clientContext;
  const roles = user ? user.app_metadata.roles : false;
  console.log('@user: ', user);
  console.log('@roles: ', roles);
  console.log('@timelineID: ', timelineID);
  
  // #RENDUICI: get le user via user.sub (netlifyID)
  // store the Netlify and Stripe IDs in Fauna
  let faunaData = await faunaFetch({
    query: `
      query($timelineID: ID!) {
        findTimelineByID(id: $timelineID) {
          _id
          name
          user {netlifyID}
          version
          description
          name
          public
          start_date
          end_date
          lines
        }
      }
    `,
    variables: {
      timelineID: timelineID,
    },
  });
  console.log('@faunaData: ', faunaData);
  const timelineData = faunaData.data.findTimelineByID;
  console.log('@timelineData.user.netlifyID: ', timelineData.user.netlifyID);
  
  if (timelineData.user.netlifyID !== user.sub) {
    // This if block should be executed if the timelineID provided exists, but belongs to another user. Very edge case.
    return {
      statusCode: 403,
      body: JSON.stringify(
        "It looks like you're trying to access a timeline from another user... If you're hacking me. Please stop. Otherwise, reach out.",
      ),
    };
  }
  if (faunaData.data.findTimelineByID == null) {
    // This if block should be executed if the timeline requested is not found. Very edge case.
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: "timeline not found."
      }),
    };
  }
  if (faunaData.errors) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        faunaData.errors,
      ),
    };  
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      timeline: timelineData,
    }),
  };
};

