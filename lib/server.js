module.exports = (function() {
    if (global.__enableProxy__)
        return require('tower-proxy');
    else
        return require('tower-server');
})();