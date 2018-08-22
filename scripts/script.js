var tbody = document.querySelector('table tbody');
var aluno = {};

function cadastrar() {
    aluno.Nome = document.querySelector('#nome').value;
    aluno.Sobrenome = document.querySelector('#nobrenome').value;
    aluno.Telefone = document.querySelector('#telefone').value;
    aluno.Ra = document.querySelector('#ra').value;

    if (aluno.Id === undefined || aluno.Id === 0) {
        salvarEstudante('POST', 0, aluno);
    }
    else {
        salvarEstudante('PUT', aluno.Id, aluno);
    }

    $('#cadastroModal').modal('hide');
    carregaEstudantes();
}

function cancelar() {
    var btnSalvar = document.querySelector('#btnSalvar');
    var btnCancelar = document.querySelector('#btnCancelar');
    document.querySelector('#nome').value = '';
    document.querySelector('#nobrenome').value = '';
    document.querySelector('#telefone').value = '';
    document.querySelector('#ra').value = '';

    aluno = {};
    btnSalvar.textContent = 'Cadastrar';
    btnCancelar.textContent = 'Limpar';

    $('#cadastroModal').modal('hide');
}

function carregaEstudantes() {
    tbody.innerHTML = ''; //antes de mais nada, limpa a tabela
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:59189/api/Teste', true);
    
    xhr.onload = function () {
        var estudantes = JSON.parse(this.responseText);
        for (var index in estudantes) {
            adicionaLinha(estudantes[index]);
        }
    }

    xhr.send();
}

function salvarEstudante(metodo, id, corpo) {
    var xhr = new XMLHttpRequest();

    if (id === undefined || id === 0) {
        id = '';
    }
    
    xhr.open(metodo, `http://localhost:59189/api/Teste/${id}`, false);
    
    if (corpo !== undefined) {
        xhr.setRequestHeader('content-type', 'application/json'); //igual no postman, o tipo de envio
        xhr.send(JSON.stringify(corpo)); //antes converte para string
    }

    $('#cadastroModal').modal('hide');
}

carregaEstudantes();

function editarEstudante(estudante) {
    var btnSalvar = document.querySelector('#btnSalvar');
    var btnCancelar = document.querySelector('#btnCancelar')
    var tituloModal = document.querySelector('#cadastroModalLabel')
    document.querySelector('#nome').value = estudante.Nome;
    document.querySelector('#nobrenome').value = estudante.Sobrenome;
    document.querySelector('#telefone').value = estudante.Telefone;
    document.querySelector('#ra').value = estudante.Ra;

    btnSalvar.textContent = 'Salvar';
    btnCancelar.textContent = 'Cancelar';
    tituloModal.textContent = 'Editar aluno';
    aluno = estudante;

    $('#cadastroModal').modal('hide');
}

function deletarEstudante(id) {
    var xhr = new XMLHttpRequest();           
    xhr.open('DELETE', `http://localhost:59189/api/Teste/${id}`, false);
    xhr.send();
}

function deletar(id) {
    deletarEstudante(id);
    carregaEstudantes();
    $('#cadastroModal').modal('hide');
}

function adicionaLinha(estudante) {
    var trow = `<tr>
                    <td>${estudante.Nome}</td>
                    <td>${estudante.Sobrenome}</td>
                    <td>${estudante.Telefone}</td>
                    <td>${estudante.Ra}</td>
                    <td>
                        <button class="btn btn-primary" data-toggle="modal" data-target="#cadastroModal" onclick='editarEstudante(${JSON.stringify(estudante)})'>Editar</button>
                        <button class="btn btn-danger" onclick='deletar(${estudante.Id})'>Deletar</button>
                    </td>
                </tr>
               `
    tbody.innerHTML += trow;
}