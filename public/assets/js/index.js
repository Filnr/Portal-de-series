const url = 'http://localhost:3000/'

document.addEventListener('DOMContentLoaded', function(){
    // Fetch Logo 
    const urlLogo = url + 'Logo';
    fetch('/Logo')
        .then(response => {
            if(!response.ok){
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
    // Fetch Autor
    const urlAutor = url + 'Autor';
    fetch(urlAutor)
        .then(res => {
            if(!res.ok){
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
});