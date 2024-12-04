import { TOKEN } from './envs.js';

document.addEventListener('DOMContentLoaded', function () {
    fetch('/Logo')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao executar requisição: ' + response.status);
            }
            return response.text() // Mudança aqui: use text() em vez de json()
        })
        .then(data => {
            console.log(data);
            let logo = document.getElementById('logo');
            logo.src = data;
            console.log(logo.src);
        })
        .catch(error => {
            console.error('Erro no fetch do Logo:', error);
        });


    const url = `https://api.themoviedb.org/3/search/tv?query=${nome}&include_adult=false&language=en-US&page=1`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TOKEN}`
        }
    };

    fetch(url, options)
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.error(err));

});