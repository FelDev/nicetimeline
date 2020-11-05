const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { faunaFetch } = require('./utils/fauna');

exports.handler = async (event, context) => {
  console.log('@event: ', event);
  const { timelineData } = JSON.parse(event.body);
  const { user } = context.clientContext;
  const roles = user ? user.app_metadata.roles : false;
  console.log('@timelineData: ', timelineData);
  console.log('@user: ', user);
  console.log('@roles: ', roles);
  
  
  // #RENDUICI: get le user via user.sub (netlifyID)
  // store the Netlify and Stripe IDs in Fauna
  let saveStatus = await faunaFetch({
    query: `
      query ($netlifyID: ID!) {
        getUserByNetlifyID(netlifyID: $netlifyID) {
          # stripeID
          # paidFor
          _id
        }
      }
    `,
    // saveStatus
    // mutation ($netlifyID: ID!) {
    //   # addTimeline(data: { netlifyID: $netlifyID, stripeID: $stripeID }) {
    //   addTimeline(data: { netlifyID: $netlifyID}) {
    //     netlifyID
    //     # stripeID
    //   }
    // }
    variables: {
      netlifyID: user.sub,
      // stripeID: customer.id,
    },
  });
  
  
  console.log('@saveStatus.data._id: ', saveStatus.data);
  let saveStatus2;

  if (timelineData.id && false) {
    console.log('@we must save it again');
    
  } else {
    console.log('@new timeline');
    
    saveStatus2 = await faunaFetch({
      query: `
        mutation createTimeline(
            $_id: ID!, 
            $name: String, 
            $version: String,
            $description: String,
            $start_date: String,
            $end_date: String,
            $lines: String,
          ) {
          createTimeline(
            data: {
              user: { connect: $_id }
              version: $version
              name: $name
              description: $description
              public: false
              start_date: $start_date
              end_date: $end_date
              lines: $lines
            }
          ) {
            _id
            name
            version
            public
            lines
          }
        }
      `,
      variables: {
        _id: saveStatus.data.getUserByNetlifyID._id,
        version: timelineData.version.toString(),
        name: timelineData.name,
        description: timelineData.description,
        // public: timelineData.public, // #TODO éventuellement un jour... public timelines.
        start_date: timelineData.start_date,
        end_date: timelineData.end_date,
        lines: JSON.stringify(timelineData.line), // #TODO bientôt bientôt!
      },
    });
  }

  
  console.log('@saveStatus: ', saveStatus);
  console.log('@saveStatus2: ', saveStatus2);
  if (saveStatus.errors) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        saveStatus.errors,
      ),
    };  
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      id: saveStatus2.data.createTimeline._id,
    }),
  };
};

