export function getUrlParam(name) {
 name = name.replace(/[]/, '\\]');
 
 const regex = new RegExp('[\\?&]' + name + '=([^]*)');
 
 const results = regex.exec(location.href);
 
 return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));

}