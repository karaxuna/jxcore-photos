var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

db.serialize(function () {
    db.run('CREATE TABLE IF NOT EXISTS photos (id INTEGER PRIMARY KEY, image Blob)');
});

var express = require('express'),
    app = express(),
    http = require('http').Server(app);

var port = 1777;
http.listen(port);

app.get('/img/:id', function (req, res) {
    var id = req.params.id;
    db.all('SELECT image FROM photos WHERE id = ' + id, function (err, records) {
        if (err) {
            res.status(500).send(err);
        } else if (!records[0]) {
            res.status(404).send();
        } else {
            res.send(records[0].image);
        }
    });
});

Mobile('savePhoto').registerAsync(function (blob, callback) {
    var query = 'INSERT INTO photos (id, image) VALUES (NULL, ?)';
    db.run(query, blob, function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null, buildImageUrl(this.lastID));
        }
    });
});

Mobile('getPhotoUrls').registerAsync(function (callback) {
    db.all('select id from photos', function (err, records) {
        if (err) {
            log(err);
        } else {
            callback(null, records.map(function (record) {
                return buildImageUrl(record.id);
            }));
        }
    });
});

function buildImageUrl(id) {
    return 'http://127.0.0.1:' + port + '/img/' + id;
}

function log(text) {
    Mobile('alert').call(text);
}