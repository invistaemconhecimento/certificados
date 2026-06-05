const BIN_ID = '6a0c19da6877513b27975609';

const API_KEY = '$2a$10$FHeRXKCTxHAD8HgExcIosujSiuAfP8pxLCkGF1wVKmD4n0t32vqWu';

const API_URL =
`https://api.jsonbin.io/v3/b/${BIN_ID}`;

async function carregarDados() {


const response = await fetch(API_URL, {
    headers: {
        'X-Master-Key': API_KEY
    }
});

if (!response.ok) {
    throw new Error('Erro ao carregar dados');
}

const data = await response.json();

return data.record;


}

async function consultar() {

```
try {

    const codigo =
        document
            .getElementById("codigo")
            .value
            .trim();

    if (!codigo) {
        document.getElementById("resultado").innerHTML =
            "<h2>Digite um código.</h2>";
        return;
    }

    const dados =
        await carregarDados();

    const certificado =
        dados.certificados.find(
            c =>
                String(c.codigo).trim() ===
                String(codigo).trim()
        );

    const resultado =
        document.getElementById("resultado");

    if (certificado) {

        resultado.innerHTML = `

        <div class="resultado-valido">

            <h2>✅ Certificado Válido</h2>

            <p><b>Código:</b>
            ${certificado.codigo}</p>

            <p><b>Aluno:</b>
            ${certificado.nome}</p>

            <p><b>CPF:</b>
            ${certificado.cpf}</p>

            <p><b>Curso:</b>
            ${certificado.curso}</p>

            <p><b>Carga Horária:</b>
            ${certificado.cargaHoraria || ''}</p>

            <p><b>Aproveitamento:</b>
            ${certificado.aproveitamento || ''}</p>

            <p><b>Data de Conclusão:</b>
            ${certificado.dataConclusao || ''}</p>

            <p><b>Status:</b>
            ${certificado.status}</p>

        </div>

        `;

    } else {

        resultado.innerHTML = `
            <h2>❌ Certificado não encontrado</h2>
        `;
    }

} catch (erro) {

    console.error(erro);

    document.getElementById("resultado").innerHTML =
        "<h2>Erro ao consultar certificado.</h2>";
}


}

async function salvarCertificado() {


try {

    const dados =
        await carregarDados();

    const novoCertificado = {

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

        status: "Válido",

        pdfUrl: ""

    };

    dados.certificados.push(
        novoCertificado
    );

    const resposta = await fetch(API_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': API_KEY
        },
        body: JSON.stringify(dados)
    });

    if (!resposta.ok) {
        throw new Error('Erro ao salvar');
    }

    alert(
        'Certificado salvo com sucesso!'
    );

} catch (erro) {

    console.error(erro);

    alert(
        'Erro ao salvar certificado.'
    );
}


}
