const url = 'http://localhost:3000/';
let hashValue = window.location.hash; // Exemplo: "#1396"
let id = hashValue.substring(1);
const urlSerie = `https://api.themoviedb.org/3/tv/${id}?language=pt-BR`;
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZmIyZTU3ZGFkMTY1N2U3ZDQ3Yzg4M2YyZTVjMTdiYiIsIm5iZiI6MTczMjc0NTMwNC43NjA2ODM1LCJzdWIiOiI2NzI2NzFjNmFmZjdlMDFjNjE4NWNiNjgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.w1PDox2cb4RGcML-PGDKl5aVWnT4ZY1Z4QGeGUORPHQ'
  }
};
document.addEventListener('DOMContentLoaded', function () {
    const urlLogo = url + 'Logo';
    fetch('/Logo')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao executar requisição: ' + response.status);
            }
            return response.text() // Mudança aqui: use text() em vez de json()
        })
        .then(data => {
            let logo = document.getElementById('logo');
            logo.src = data;
        })
        .catch(error => {
            console.error('Erro no fetch do Logo:', error);
        });

    fetch(urlSerie, options)
        .then(res => res.json())
        .then(serie => {
            console.log(serie);
            const titulo = document.getElementById('titulo');
            const imagem = document.getElementById('imagem');
            const descricao = document.getElementById('descricao');
            const generos = document.getElementById('generos');
            const avaliacao = document.getElementById('avaliacao');
            const dataLancamento = document.getElementById('dataLancamento');
            const plataforma = document.getElementById('plataforma');
            if(titulo) titulo.textContent = serie.name;
            if(imagem) imagem.src = `https://image.tmdb.org/t/p/w500/${serie.poster_path}`;
            if(descricao) descricao.textContent = serie.overview;
            if(generos) generos.textContent = serie.genres.map(genero => genero.name).join(', ');
            if(avaliacao) avaliacao.textContent = serie.vote_average;
            if(dataLancamento) dataLancamento.textContent = serie.first_air_date;
            if(plataforma) plataforma.textContent = serie.networks.map(plataforma => plataforma.name).join(', ');


        })
        .catch(err => console.error(err));
});