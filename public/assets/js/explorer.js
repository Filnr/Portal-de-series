import { TOKEN } from './envs.js';
const urlAPI = 'https://api.themoviedb.org/3/tv/top_rated?language=pt-BR&page=1';
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TOKEN}`
    }
};

document.addEventListener('DOMContentLoaded', function () {
    // Fetch para carregar a logo
    fetch('/Logo')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao executar requisição: ' + response.status);
            }
            return response.text(); // Mudança aqui: use text() em vez de json()
        })
        .then(data => {
            let logo = document.getElementById('logo');
            logo.src = data;
        })
        .catch(error => {
            console.error('Erro no fetch do Logo:', error);
        });
    let buscaSerie = '';
    const buscaInput = document.getElementById('busca');
    const seriesDiv = document.getElementById('listaSeries');
    fetch(urlAPI, options)
        .then(res => res.json())
        .then(series => {
            console.log(series);
            if (seriesDiv) {
                seriesDiv.innerHTML = ''; // Limpa os resultados anteriores
                for (let i = 0; i < series.results.length; i++) {
                    const serie = series.results[i]; // Acessa a série individualmente
                    const div = document.createElement('div');
                    div.className = 'col-md-2 col-sm-6 my-3';
                    div.innerHTML = `
                        <div class="card h-100">
                            <a href="serie.html#${serie.id}">
                                <img src="https://image.tmdb.org/t/p/w500/${serie.poster_path}" alt="${serie.name}" class="img-thumbnail">
                            </a>
                            <div class="card-body">
                                <h5>${serie.name}</h5>
                            </div>                            
                        </div>`;
                    seriesDiv.appendChild(div); // Adiciona o div ao seriesDiv
                }
            }
        })

    // Função debounce para limitar a frequência das requisições
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Função para buscar séries
    function buscarSeries() {
        if (buscaSerie.trim() !== '') {
            const url = `https://api.themoviedb.org/3/search/tv?query=${buscaSerie}&include_adult=false&language=pt_BR&page=1`;

            fetch(url, options)
                .then(res => res.json())
                .then(series => {
                    console.log(series);
                    if (seriesDiv) {
                        seriesDiv.innerHTML = ''; // Limpa os resultados anteriores
                        for (let i = 0; i < series.results.length; i++) {
                            const serie = series.results[i]; // Acessa a série individualmente
                            const div = document.createElement('div');
                            div.className = 'col-md-2 col-sm-6 my-3';
                            div.innerHTML = `
                                <div class="card h-100">
                                    <a href="serie.html#${serie.id}">
                                        <img src="https://image.tmdb.org/t/p/w500/${serie.poster_path}" alt="${serie.name}" class="img-thumbnail">
                                    </a>
                                    <div class="card-body">
                                        <h5>${serie.name}</h5>
                                    </div>                            
                                </div>`;
                            seriesDiv.appendChild(div); // Adiciona o div ao seriesDiv
                        }
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar série:', error);
                });
        }
    }

    // Adiciona o evento de input com debounce
    buscaInput.addEventListener('input', debounce(function (event) {
        buscaSerie = event.target.value;
        console.log('String de busca:', buscaSerie);
        buscarSeries();
    }, 300)); // 300ms de debounce

    // Previne o comportamento padrão do formulário ao pressionar Enter
    buscaInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    });
});