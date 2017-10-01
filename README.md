# github-contributions-api
This api provides a json version of the contributions activity table on a github user's profile page. This was created because github does not provide an api for retrieving a users' total contributions.

Currently hosted on heroku: https://github-contributions-api.herokuapp.com

### Usage

`GET /:user/activity`

Returns whether or not user was active on a given day within the last year

```js
{
  "data": {
    "2016": {
      "9": {
        "25": false,
        "26": true,
        "27": true,
        "28": true,
        "29": true,
        "30": true
      },
      //...
    }
  }
}
```
----
`GET /:user/count`

Returns activity count of user on a given day within the last year

```js
{
  "data": {
    "2016": {
      "9": {
        "25": 0,
        "26": 10,
        "27": 6,
        "28": 3,
        "29": 7,
        "30": 6
      },
      //...
    }
  }
}
```

### Installation

Clone this repo:

```sh
git clone https://github.com/Didericis/github-contributions-api.git
```

Install node modules:

```sh
npm install
```

### Running

Development (will restart on code changes):

```sh
npm run start:dev
```

Production:

```sh
npm run start
```
