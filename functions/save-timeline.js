// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { faunaFetch } = require('./utils/fauna');

exports.handler = async (event, context) => {
  // console.log('@event: ', event);
  const { timelineData } = JSON.parse(event.body);
  const { user } = context.clientContext;
  const roles = user ? user.app_metadata.roles : false;
  console.log('@timelineData: ', timelineData);
  console.log('@user: ', user);
  console.log('@roles: ', roles);
  
  let userInfo = await faunaFetch({
    query: `
      query ($netlifyID: ID!) {
        getUserByNetlifyID(netlifyID: $netlifyID) {
          # stripeID
          # paidFor
          _id
          timelines {
            data {
              _id
            }
          }
        }
      }
    `,
    variables: {
      netlifyID: user.sub,
      // stripeID: customer.id,
    },
  });
  
  console.log('@userInfo: ', userInfo);
  if (userInfo.errors) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        userInfo.errors,
      ),
    };  
  }

  // console.log('@userInfo.data.getUserByNetlifyID.timelines.data: ', userInfo.data.getUserByNetlifyID.timelines.data);
  let idExistsInDB = userInfo.data.getUserByNetlifyID.timelines.data.find(x => x._id === timelineData.id)
  console.log('@idExistsInDB: ', idExistsInDB);
  
  if (idExistsInDB) {
    console.log('@updating an existing timeline.');

    const saveStatus = await faunaFetch({
      query: `
        mutation updateTimeline(
            $_id: ID!, 
            $timelineID: ID!,
            $name: String, 
            $version: String,
            $description: String,
            $start_date: String,
            $end_date: String,
            $lines: String,
          ) {
          updateTimeline(
            id: $timelineID,
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
        _id: userInfo.data.getUserByNetlifyID._id,
        timelineID: idExistsInDB._id,
        version: timelineData.version.toString(),
        name: timelineData.name,
        description: timelineData.description,
        // public: timelineData.public, // #TODO éventuellement un jour... public timelines.
        start_date: timelineData.start_date,
        end_date: timelineData.end_date,
        lines: JSON.stringify(timelineData.lines), // #TODO bientôt bientôt!
      },
    });

    console.log('@saveStatus (update): ', saveStatus);
    return {
      statusCode: 200,
      body: JSON.stringify({
        id: saveStatus.data.updateTimeline._id,
      }),
    };

  } else {
    console.log('@Creating a new timeline.');
    
    const saveStatus = await faunaFetch({
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
        _id: userInfo.data.getUserByNetlifyID._id,
        version: timelineData.version.toString(),
        name: timelineData.name,
        description: timelineData.description,
        // public: timelineData.public, // #TODO éventuellement un jour... public timelines.
        start_date: timelineData.start_date,
        end_date: timelineData.end_date,
        lines: JSON.stringify(timelineData.lines), // #TODO bientôt bientôt!
      },
    });

    console.log('@saveStatus (create): ', saveStatus);
    return {
      statusCode: 200,
      body: JSON.stringify({
        id: saveStatus.data.createTimeline._id,
      }),
    };
  }

};

