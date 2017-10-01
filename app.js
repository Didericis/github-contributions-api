const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');
const cheerio = require('cheerio');
const _ = require('lodash');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/:user/:format', (req, res, next) => {
  const { format, user } = req.params;

  // Render 400 if invalid format given
  const VALID_FORMATS = ['activity', 'count'];
  if (!VALID_FORMATS.includes(format)) {
    return next({ 
      status: 400, 
      message: `Format must be one of ${JSON.stringify(VALID_FORMATS)}`
    });
  }

  const url = `https://www.github.com/${user}`;
  request.get(url, (err, response, body) => {
    // Return error if request had an error
    if (err) return next(err);

    // Return 404 if user not found
    if (response.statusCode === 404) return next({
      status: 404,
      message: `User '${user}' not found`
    });

    // Parse github profile page
    const $ = cheerio.load(body);
    const data = $('rect').get().reduce((data, rect) => {
      // Parse contributions value
      const value = (() => {
        const count = $(rect).data('count');
        if (format === 'activity') return count > 0;
        if (format === 'count') return count;
      })();

      // Parse contributions date
      const [year, month, day] = $(rect).data('date').split('-').map(
        dateNum => parseInt(dateNum));
      _.setWith(data, [year, month, day], value, Object);

      return data;
    }, {});

    // Render parsed contributions data
    res.json({ data });
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ message: err.message });
});

module.exports = app;
