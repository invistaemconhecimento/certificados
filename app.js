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

async function consultar() {

    const codigo =
    document.getElementById("codigo").value;

    const dados =
    await carregarDados();

    const certificado =
    dados.certificados.find(
        c => c.codigo === codigo
    );

    const resultado =
    document.getElementById("resultado");

    if(certificado){

        const cpfMascarado =
        certificado.cpf.replace(
            /(\d{3})\.(\d{3})\.(\d{3})-(\d{2})/,
            '$1.***.***-$4'
        );

        resultado.innerHTML = `
        <h2>✅ Certificado Válido</h2>

        <p><b>Código:</b>
        ${certificado.codigo}</p>

        <p><b>Aluno:</b>
        ${certificado.nome}</p>

        <p><b>CPF:</b>
        ${cpfMascarado}</p>

        <p><b>Curso:</b>
        ${certificado.curso}</p>

        <p><b>Carga Horária:</b>
        ${certificado.cargaHoraria}</p>

        <p><b>Aproveitamento:</b>
        ${certificado.aproveitamento}</p>

        <p><b>Data de Conclusão:</b>
        ${certificado.dataConclusao}</p>

        <p><b>Status:</b>
        ${certificado.status}</p>

        <hr>

        <h3>QR Code de Verificação</h3>

        <div id="qrcode"></div>
        `;

        const qrDiv =
        document.getElementById("qrcode");

        qrDiv.innerHTML = "";

        const urlValidacao =
        "https://invistaemconhecimento.github.io/certificados/?codigo=" +
        certificado.codigo;

        new QRCode(qrDiv,{
            text: urlValidacao,
            width:180,
            height:180
        });

    }else{

        resultado.innerHTML =
        "<h2>❌ Certificado não encontrado</h2>";

    }

}

async function salvarCertificado(){

    const dados =
    await carregarDados();

    dados.certificados.push({

        codigo:
        Date.now().toString(),

        nome:
        document.getElementById("nome").value,

        cpf:
        document.getElementById("cpf").value,

        curso:
        document.getElementById("curso").value,

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

    alert('Certificado salvo');

}

window.onload = function() {

    const parametros =
    new URLSearchParams(
        window.location.search
    );

    const codigo =
    parametros.get("codigo");

    if(codigo){

        document.getElementById("codigo").value =
        codigo;

        consultar();

    }

};
