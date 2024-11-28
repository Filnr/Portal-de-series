import { token } from './token.js';
const url = 'http://localhost:3000/'
const urlAPI = 'https://api.themoviedb.org/3/tv/top_rated?language=pt-BR&page=1';
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`
    }
};

document.addEventListener('DOMContentLoaded', function () {
    // Fetch Logo 
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
    // Fetch Autor
    const urlAutor = url + 'Autor';
    fetch(urlAutor)
        .then(res => {
            if (!res.ok) {
                throw new Error('Erro ao executar requisição: ' + res.status);
            }
            return res.json()
        })
        .then(data => {
            const autor = data[0];

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
    console.log(populares);
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
        
});