const arc = require('@architect/functions');
const { generate: shortid } = require('shortid');

exports.handler = async (req) => {
  try {
    const { email } = arc.http.helpers.bodyParser(req);
    const data = await arc.tables();
    const user = { Pk: 'User', Sk: shortid.generate(), email };
    const emailDuplicatePrevention = { Pk: 'User', Sk: email };

    await Promise.all([
      data.twipoc.put(user),
      data.twipoc.put(emailDuplicatePrevention),
    ]);

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json; charset=utf8' },
      body: JSON.stringify(user),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      headers: { 'content-type': 'text/plain; charset=utf8' },
      body: 'Something went wrong.',
    };
  }
};
