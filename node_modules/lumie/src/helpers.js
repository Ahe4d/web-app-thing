function joinPathSlash(path) {
    return path.replace(/\\/g, '/');
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
    joinPathSlash,
    capitalize
};
