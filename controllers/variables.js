//* API
export const URL_API = "https://collectionapi.metmuseum.org/public/collection/v1";
export const URL_API_SEARCH_IMAGE = `${URL_API}/search?&hasImages=true`

/* 
https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q="flores"&departmentId=1
*/

export const totalObras = 15;
export const registrosPaginas = 5;
export let totalPaginas = parseInt(Math.ceil(totalObras / registrosPaginas));

export let iterador;