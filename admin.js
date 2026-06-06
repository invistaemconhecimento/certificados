const BIN_ID =
'6a0c19da6877513b27975609';

const API_KEY =
'$2a$10$FHeRXKCTxHAD8HgExcIosujSiuAfP8pxLCkGF1wVKmD4n0t32vqWu';

const API_URL =
`https://api.jsonbin.io/v3/b/${BIN_ID}`;

async function carregarDados() {

    const response = await fetch(API_URL,{
        headers:{
            'X-Master-Key':API_KEY
        }
    });

    const data = await response.json();

    return data.record;

}

async function salvarCertificado(){

    const dados =
    await carregarDados();

    dados.certificados.push({

        codigo:
        document.getElementById("codigoCadastro").value,

        nome:
        document.getElementById("nome").value,

        cpf:
        document.getElementById("cpf").value,

        curso:
        document.getElementById("curso").value,

        cargaHoraria:
        document.getElementById("cargaHoraria").value,

        aproveitamento:
        document.getElementById("aproveitamento").value,

        dataConclusao:
        document.getElementById("dataConclusao").value,

        pdfUrl:
        document.getElementById("pdfUrl").value,

        status:
        "Válido"

    });

    await fetch(API_URL,{
        method:'PUT',
        headers:{
            'Content-Type':'application/json',
            'X-Master-Key':API_KEY
        },
        body:JSON.stringify(dados)
    });

    alert('Certificado salvo com sucesso!');

    listarCertificados();

}

async function listarCertificados(){

    const dados =
    await carregarDados();

    const lista =
    document.getElementById("listaCertificados");

    lista.innerHTML = "";

    dados.certificados.forEach((certificado,index)=>{

        lista.innerHTML += `
        <div style="padding:10px;border:1px solid #ddd;margin-bottom:10px;border-radius:8px;">
            <strong>${certificado.codigo}</strong><br>
            ${certificado.nome}<br>
            ${certificado.curso}<br><br>

            <button onclick="excluirCertificado(${index})">
                Excluir
            </button>
        </div>
        `;

    });

}

async function excluirCertificado(index){

    if(!confirm("Deseja excluir este certificado?")){
        return;
    }

    const dados =
    await carregarDados();

    dados.certificados.splice(index,1);

    await fetch(API_URL,{
        method:'PUT',
        headers:{
            'Content-Type':'application/json',
            'X-Master-Key':API_KEY
        },
        body:JSON.stringify(dados)
    });

    listarCertificados();

}

window.onload = listarCertificados;
