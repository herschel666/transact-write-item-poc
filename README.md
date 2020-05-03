# `transactWrite` proof-of-concept

As I was fiddling around with [`@architect/architect`](https://arc.codes/), I stumbled upon the
issue, that it's not possible to call `transactWrite` on the DynamoDB API locally. It rather leads to a
`UnknownOperationException: null` error. On the real DynamoDB API this works fine, so it might be
an issue with [`dynalite`](https://www.npmjs.com/package/dynalite). But I have yet to figure that
out.

## Installation

First create an AWS profile & then adjust the `.arc` file. Set your preferred region in there and a
working AWS profile with the appropriate rights. This is even required for running the tests locally!

```diff
@aws
- region <region>
+ region your-preferred-region
- profile <profile>
+ profile your-aws-profile
```

After that install the dependencies by running `npm install` in your terminal.

## Running the proof-of-concept

There's a test suite, that creates a user & updates its email. Run `npm test` in your terminal, to
see it fail.

If you deploy that app to AWS, you'll be able to verify that you can in fact make a `PUT`-call to `/` and do the update of the
email address.
