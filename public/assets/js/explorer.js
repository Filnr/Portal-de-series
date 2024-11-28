const url = 'http://localhost:3000/'
document.addEventListener('DOMContentLoaded', function(){
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
});