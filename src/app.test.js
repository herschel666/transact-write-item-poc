const test = require('ava');
const fetch = require('node-fetch');
const sandbox = require('@architect/sandbox');

const URL = 'http://localhost:3333/';

let userId;

test.before(async () => {
  await sandbox.start({
    quiet: true,
  });
});

test.after(async () => {
  await sandbox.end();
});

test.serial('Create user', async (t) => {
  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: String(
      new URLSearchParams({
        email: 'foo@bar.tld',
      })
    ),
  });
  const { Sk: id, email } = await response.json();
  userId = id;

  t.is(email, 'foo@bar.tld');
});

test.serial('Update user', async (t) => {
  const response = await fetch(URL, {
    method: 'PUT',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: String(
      new URLSearchParams({
        email: 'bar@foo.tld',
        userId,
      })
    ),
  });
  const { email } = await response.json();

  t.is(response.status, 200);
  t.is(email, 'bar@foo.tld');
});
