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
    // Fetch Logo 
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
    // Fetch Autor
    fetch('/Autor')
        .then(res => {
            if (!res.ok) {
                throw new Error('Erro ao executar requisição: ' + res.status);
            }
            return res.json()
        })
        .then(data => {
            const autor = data;

            // Verificação de existência dos elementos
            const nomeAutor = document.getElementById('nomeAutor');
            const cursoAutor = document.getElementById('cursoAutor');
            const sobreAutor = document.getElementById('sobreAutor');
            const imagemAutor = document.getElementById('imagemAutor');
            if (nomeAutor) nomeAutor.textContent = autor.Nome;
            if (cursoAutor) cursoAutor.textContent = autor.Curso;
            if (sobreAutor) sobreAutor.textContent = autor.Sobre;
            if (imagemAutor) imagemAutor.src = autor.Img;

            // Adicionar redes sociais
            const redesSociais = document.getElementById('redesSociais');
            if (redesSociais) {
                autor.Redes_Sociais.forEach(rede => {
                    const link = document.createElement('a');
                    link.href = rede.Link;
                    link.target = '_blank';

                    const img = document.createElement('img');
                    img.src = rede.Img;
                    img.alt = rede.Nome;

                    link.appendChild(img);
                    redesSociais.appendChild(link);
                });
            }
        })
        .catch(error => {
            console.error('Erro no fetch do Autor:', error);
        });
    //Series Populares
    //Series Populares
    fetch(urlAPI, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao executar requisição: ' + response.status);
            }
            return response.json();
        })
        .then(populares => {
            const series = populares.results;
            const carousel = document.getElementById('carouselSeries');
            const carouselIndicators = document.getElementById('carouselIndicators');

            // Clear any existing indicators (if any)
            carouselIndicators.innerHTML = '';
            carousel.innerHTML = '';

            // Generate carousel indicators and items dynamically
            series.forEach((serie, index) => {
                // Create Indicator
                const indicator = document.createElement('button');
                indicator.type = 'button';
                indicator.setAttribute('data-bs-target', '#carouselExampleCaptions');
                indicator.setAttribute('data-bs-slide-to', index);
                indicator.setAttribute('aria-label', `Slide ${index + 1}`);

                // Add active class to first indicator
                if (index === 0) {
                    indicator.classList.add('active');
                    indicator.setAttribute('aria-current', 'true');
                }

                carouselIndicators.appendChild(indicator);

                // Create Carousel Item
                const carouselItem = document.createElement('div');
                carouselItem.classList.add('carousel-item');

                // Add active class to first item
                if (index === 0) {
                    carouselItem.classList.add('active');
                }

                carouselItem.innerHTML = `
            <a href="serie.html#${serie.id}">
                <img class="d-block w-100" 
                     src="https://image.tmdb.org/t/p/original${serie.backdrop_path}" 
                     alt="${serie.name}">
            </a>
            <div class="carousel-caption d-none d-md-block">
                <h5>${serie.name}</h5>
            </div>
        `;

                carousel.appendChild(carouselItem);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar séries populares:', error);
        });

    // Fetch Series
    fetch('/Favoritos')
        .then(res => {
            if (!res.ok) {
                throw new Error('Erro ao executar requisição: ' + res.status);
            }
            return res.json();
        })
        .then(ids => {
            const seriesFavoritas = document.getElementById('listaFavoritos');
            if (seriesFavoritas) {
                for (let i = 0; i < ids.length; i++) {
                    const urlSerie = `https://api.themoviedb.org/3/tv/${ids[i].id}?language=pt-BR`;
                    fetch(urlSerie, options)
                        .then(res => {
                            if (!res.ok) {
                                throw new Error('Erro ao executar requisição: ' + res.status);
                            }
                            return res.json();
                        })
                        .then(favoritos => {
                            const favoritosDiv = document.getElementById('listaFavoritos');
                            if (favoritosDiv) {
                                const div = document.createElement('div');
                                div.className = 'col-md-2 col-sm-6 my-3';
                                div.innerHTML = `
                                        <div class="card h-100">
                                            <a href="serie.html#${favoritos.id}">
                                                <img src="https://image.tmdb.org/t/p/w500/${favoritos.poster_path}" alt="${favoritos.name}" class="img-thumbnail">
                                            </a>
                                                <div class="card-body">
                                                    <h5>${favoritos.name}</h5>
                                                </div>
                                        </div>`;
                                favoritosDiv.appendChild(div);
                            }
                        })
                        .catch(err => console.error(err));
                };
            }
        });
    //Novas séries
    const urlNovas = 'https://api.themoviedb.org/3/tv/airing_today?language=pt-BR&page=1';
    fetch(urlNovas, options)
        .then(res => {
            if (!res.ok) {
                throw new Error('Erro ao executar requisição: ' + res.status);
            }
            return res.json();
        })
        .then(seriesNovas => {
            const NovasDiv = document.getElementById('listaNovas');
            if (NovasDiv) {
                for (let i = 0; i < 6; i++) {
                    const serie = seriesNovas.results[i]; // Acessa a série individualmente
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
                    NovasDiv.appendChild(div);
                }
            }
        })
        .catch(err => console.error(err));
});