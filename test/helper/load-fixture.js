export const loadFixtureAsArrayBuffer = (fixture, callback) => {
    const request = new XMLHttpRequest();

    request.onerror = function () {
        callback(new Error('The request failed.'));
    };
    request.onload = function (event) {
        callback(null, event.target.response);
    };
    request.open('GET', '/base/test/fixtures/' + fixture);
    request.responseType = 'arraybuffer';
    request.send();
};

export const loadFixtureAsJson = (fixture, callback) => {
    const request = new XMLHttpRequest();

    request.onerror = function () {
        callback(new Error('The request failed.'));
    };
    request.onload = function (event) {
        try {
            callback(null, JSON.parse(event.target.response));
        } catch (err) {
            callback(new Error('The request failed.'));
        }
    };
    request.open('GET', '/base/test/fixtures/' + fixture);
    request.send();
};
