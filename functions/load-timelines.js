const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { faunaFetch } = require('./utils/fauna');

exports.handler = async (event, context) => {
  console.log('@event: ', event);
  const { user } = context.clientContext;
  const roles = user ? user.app_metadata.roles : false;
  console.log('@user: ', user);
  console.log('@roles: ', roles);
  
  let faunaData = await faunaFetch({
    query: `
      query ($netlifyID: ID!) {
        getUserByNetlifyID(netlifyID: $netlifyID) {
          timelines {
            data {
              _id
              name 
            }
          }
        }
      }
    `,
    variables: {
      netlifyID: user.sub,
    },
  });

  console.log('@faunaData: ', faunaData);
  
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
      ids: faunaData.data.getUserByNetlifyID.timelines,
    }),
  };
};

