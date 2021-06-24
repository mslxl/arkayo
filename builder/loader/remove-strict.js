function removeStrict(code) {
    return code.replace(/(\"|\')use strict(\"|\');/gi, '');
}
module.exports = function(source) {
    source = removeStrict(source);
    return source;
};
