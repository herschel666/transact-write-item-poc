const arc = require('@architect/functions');

exports.handler = async (req) => {
  try {
    const { email, userId } = arc.http.helpers.bodyParser(req);
    const data = await arc.tables();
    const dedupe = await data.twipoc.get({ Pk: 'User', Sk: email });

    // TODO: integrate this as a condition check into `transactWrite`
    if (dedupe) {
      return {
        statusCode: 403,
        headers: { 'content-type': 'application/json; charset=utf8' },
        body: JSON.stringify({ error: 'email already exists' }),
      };
    }

    const user = await data.twipoc.get({ Pk: 'User', Sk: userId });
    const tableName = data._name('twipoc');

    await data._doc
      .transactWrite({
        TransactItems: [
          {
            Put: {
              TableName: tableName,
              Item: {
                Pk: 'User',
                Sk: email,
              },
            },
          },
          {
            Delete: {
              TableName: tableName,
              Key: { Pk: 'User', Sk: user.email },
            },
          },
          {
            Update: {
              TableName: tableName,
              Key: { Pk: 'User', Sk: userId },
              UpdateExpression: 'set #e = :e',
              ExpressionAttributeNames: {
                '#e': 'email',
              },
              ExpressionAttributeValues: {
                ':e': email,
              },
            },
          },
        ],
      })
      .promise();

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json; charset=utf8' },
      body: JSON.stringify({ ...user, ...{ email } }),
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
