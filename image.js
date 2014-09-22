var sharp = require('sharp'),
    fs = require('fs'),
    url = 'https://dl.dropboxusercontent.com/s/zd0ehos3mk0ghti/canada_010alt-2012-09-29-0813.jpg?dl=0'
    request = require('request'),
    read = request(url),
    write = fs.createWriteStream('6.small.jpg')
    write2 = fs.createWriteStream('6.big.jpg')
    transformer = sharp().resize(300, 200).max();
    transformer2 = sharp().resize(1200, 1024).max();

read.pipe(transformer).pipe(write);
read.pipe(transformer2).pipe(write2);
