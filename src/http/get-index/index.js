const arc = require('@architect/functions');

exports.handler = async () => {
  const data = await arc.tables();
  const { Items: items = [] } = await data.twipoc.scan({});

  return {
    headers: {
      'content-type': 'application/json; charset=utf8',
    },
    body: JSON.stringify(items),
  };
};
