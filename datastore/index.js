const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const promise = require('bluebird');
var items = {};
var readFilePromise = promise.promisify(fs.readFile);
// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    var directory = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(directory, text, (err) => {
      if (err) {
        throw ('error saving text');
      } else {
        callback(null, {id, text});
      }
    });
  });
  //callback(null, { id, text });
};

exports.readAll = (callback) => {
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
};

exports.readOne = (id, callback) => {
  var directory = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(directory, (err, todoText) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      var combine = '' + todoText;
      callback(null, { id, text: combine });
    }
  });
};

exports.update = (id, text, callback) => {
  var directory = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(directory, (err, whatever) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(directory, text, (err) => {
        if (err) {
          throw ('failed update');
        } else {
          callback(null, {id, text});
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var directory = path.join(exports.dataDir, `${id}.txt`);
  fs.unlink(directory, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, id);
    }
  });
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
