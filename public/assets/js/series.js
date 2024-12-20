import { TOKEN } from './envs.js';
// Encontra o id
const url = 'http://localhost:3000/';
let hashValue = window.location.hash; // Exemplo: "#1396"
let id = hashValue.substring(1);
// Url dos detalhes
const urlSerie = `https://api.themoviedb.org/3/tv/${id}?language=pt-BR`;
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TOKEN}`
    }
};

const urlElenco = `https://api.themoviedb.org/3/tv/${id}/credits?language=pt-BR`;
const detalhes = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TOKEN}`
    }
};

document.addEventListener('DOMContentLoaded', function () {
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
            //Visão Geral
            const titulo = document.getElementById('titulo');
            const imagem = document.getElementById('imagem');
            const descricao = document.getElementById('descricao');
            const generos = document.getElementById('generos');
            const avaliacao = document.getElementById('avaliacao');
            const dataLancamento = document.getElementById('dataLancamento');
            const plataforma = document.getElementById('plataforma');
            if (titulo) titulo.textContent = serie.name;
            if (imagem) imagem.src = `https://image.tmdb.org/t/p/w500/${serie.poster_path}`;
            if (descricao) descricao.textContent = serie.overview;
            if (generos) generos.textContent = serie.genres.map(genero => genero.name).join(', ');
            if (avaliacao) avaliacao.textContent = serie.vote_average;
            if (dataLancamento) dataLancamento.textContent = serie.first_air_date;
            if (plataforma) plataforma.textContent = serie.networks.map(plataforma => plataforma.name).join(', ');

            //Temporadas
            const temporadas = document.getElementById('temporadas');
            if (temporadas) {
                serie.seasons.forEach(temporada => {
                    const div = document.createElement('div');
                    div.className = 'row p-1';
                    div.innerHTML = `
                        <div class="row p-4 bg-light rounded shadow-sm mb-4">
                        <div class="col-md-3">
                            <img src="https://image.tmdb.org/t/p/w500/${temporada.poster_path}" alt="${temporada.name}">
                        </div>
                        <div class="col-md-9">
                            <h5 class="card-title">${temporada.name}</h5>
                             <p class="card-text">${temporada.overview}</p>
                            <p class="card-text">Episódios: ${temporada.episode_count}</p>
                        </div>
                    </div>`;
                    temporadas.appendChild(div);
                }

                )
            };
        }
        )
        .catch(err => console.error(err));

    //Elenco
    fetch(urlElenco, detalhes)
        .then(res => {
            if (!res.ok) {
                throw new Error('Erro ao executar requisição: ' + res.status);
            }
            return res.json();
        })
        .then(elenco => {
            const elencoDiv = document.getElementById('elenco');
            if (elencoDiv) {
                for (let i = 0; i < 8; i++) {
                    let pessoa = elenco.cast[i];
                    const div = document.createElement('div');
                    div.className = 'col-md-3';
                    div.innerHTML = `
                        <div class="col">
                            <div class="card h-5">
                                <img src="https://image.tmdb.org/t/p/w500/${pessoa.profile_path}" alt="${pessoa.name}" class="img-thumbnail">
                                <div class="card-body">
                                    <h5>${pessoa.name}</h5>
                                    <p>${pessoa.character}</p>
                                </div>
                            </div>
                        </div>`;
                    elencoDiv.appendChild(div);
                };
            }
        })
        .catch(err => console.error(err));
    

    document.getElementById('favoritos').addEventListener('click', function () {
        this.classList.toggle('active');
    });

    //Add favoritos
    document.getElementById('favoritos').addEventListener('click', function () {
        // Primeiro, verifique se o item já existe no banco de dados
        fetch(`/Favoritos/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 404) {
                // Item não encontrado, pode adicionar
                return null;
            } else {
                throw new Error('Erro ao verificar favoritos: ' + response.status);
            }
        })
        .then(data => {
            if (data) {
                fetch(`/Favoritos/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            } else {
                // Item não encontrado, faça a requisição POST para adicionar
                return fetch('/Favoritos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        id: id,
                        name: titulo.textContent,
                    })
                });
            }
        })
        .then(response => {
            if (response && !response.ok) {
                throw new Error('Erro ao adicionar aos favoritos: ' + response.status);
            }
            return response ? response.json() : null;
        })
        .catch(error => {
            console.error('Erro no fetch dos Favoritos:', error);
        });
    });
    //deixar o botão de favoritos ativo
    window.onload = function () {
        fetch(`/Favoritos/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 404) {
                return null;
            } else {
                throw new Error('Erro ao verificar favoritos: ' + response.status);
            }
        })
        .then(data => {
            if (data) {
                document.getElementById('favoritos').classList.add('active');
            }
        })
        .catch(error => {
            console.error('Erro no fetch dos Favoritos:', error);
        });
    }

});