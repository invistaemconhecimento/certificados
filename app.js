const BIN_ID =
'6a0c19da6877513b27975609';

const API_KEY =
'SUA_MASTER_KEY_AQUI';

const API_URL =
`https://api.jsonbin.io/v3/b/${BIN_ID}`;

async function carregarDados() {

    const response = await fetch(API_URL, {
        headers: {
            'X-Master-Key': API_KEY
        }
    });

    const data = await response.json();

    if (!data.record) {
        return {
            certificados: []
        };
    }

    if (!data.record.certificados) {
        data.record.certificados = [];
    }

    return data.record;
}

async function consultar() {

    const codigo =
        document.getElementById("codigo")
        .value
        .trim();

    const dados =
        await carregarDados();

    const certificado =
        dados.certificados.find(
            c => c.codigo === codigo
        );

    const resultado =
        document.getElementById("resultado");

    if (certificado) {

        resultado.innerHTML = `

        <div class="resultado-valido">

        <h2>✅ Certificado Válido</h2>

        <p><strong>Código:</strong> ${certificado.codigo}</p>

        <p><strong>Aluno:</strong> ${certificado.nome}</p>

        <p><strong>CPF:</strong> ${certificado.cpf}</p>

        <p><strong>Curso:</strong> ${certificado.curso}</p>

        <p><strong>Carga Horária:</strong> ${certificado.cargaHoraria}</p>

        <p><strong>Aproveitamento:</strong> ${certificado.aproveitamento}</p>

        <p><strong>Data de Conclusão:</strong> ${certificado.dataConclusao}</p>

        <p><strong>Status:</strong> ${certificado.status}</p>

        </div>
        `;

    } else {

        resultado.innerHTML = `
        <h2>❌ Certificado não encontrado</h2>
        `;
    }
}

async function salvarCertificado() {

    try {

        const dados =
            await carregarDados();

        const codigoGerado =
            'CERT-' +
            Date.now();

        dados.certificados.push({

            codigo: codigoGerado,

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

        });

        const resposta = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY
            },
            body: JSON.stringify(dados)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao salvar");
        }

        document.getElementById("nome").value = "";
        document.getElementById("cpf").value = "";
        document.getElementById("curso").value = "";
        document.getElementById("cargaHoraria").value = "";
        document.getElementById("aproveitamento").value = "";
        document.getElementById("dataConclusao").value = "";

        alert(
            "Certificado salvo com sucesso!\n\nCódigo: " +
            codigoGerado
        );

    } catch (erro) {

        console.error(erro);

        alert(
            "Erro ao salvar certificado."
        );
    }
}
