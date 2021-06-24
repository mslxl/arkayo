
module.exports = function(source) {
    let content = Buffer.from(source).toString('base64')
    return `module.exports = {
        load: function(){
            return images.fromBase64('${content}');
        }
    }`;
};
