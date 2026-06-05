const BIN_ID =
'6a0c19da6877513b27975609';

const API_KEY =
'$2a$10$FHeRXKCTxHAD8HgExcIosujSiuAfP8pxLCkGF1wVKmD4n0t32vqWu';

const API_URL =
`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`;

async function carregarDados() {

    try {

        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'X-Master-Key': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao acessar JSONBin');
        }

        const data = await response.json();

        console.log('JSONBin:', data);

        if (data.record) {
            return data.record;
        }

        return {
            certificados: []
        };

    } catch (erro) {

        console.error('Erro ao carregar dados:', erro);

        return {
            certificados: []
        };
    }
}

async function consultar() {

    try {

        const codigo = document
            .getElementById("codigo")
            .value
            .trim();

        if (!codigo) {

            document.getElementById("resultado").innerHTML =
                "<p>Digite um código.</p>";

            return;
        }

        const dados = await carregarDados();

        if (!dados.certificados) {

            document.getElementById("resultado").innerHTML =
                "<h2>Nenhum certificado cadastrado.</h2>";

            return;
        }

        const certificado = dados.certificados.find(c =>
            String(c.codigo).trim().toUpperCase() ===
            String(codigo).trim().toUpperCase()
        );

        const resultado =
            document.getElementById("resultado");

        if (certificado) {

            resultado.innerHTML = `

                <div class="resultado-valido">

                    <h2>✅ Certificado Válido</h2>

                    <p><strong>Código:</strong>
                    ${certificado.codigo || ''}</p>

                    <p><strong>Aluno:</strong>
                    ${certificado.nome || ''}</p>

                    <p><strong>CPF:</strong>
                    ${certificado.cpf || ''}</p>

                    <p><strong>Curso:</strong>
                    ${certificado.curso || ''}</p>

                    <p><strong>Carga Horária:</strong>
                    ${certificado.cargaHoraria || ''}</p>

                    <p><strong>Aproveitamento:</strong>
                    ${certificado.aproveitamento || ''}</p>

                    <p><strong>Data de Conclusão:</strong>
                    ${certificado.dataConclusao || ''}</p>

                    <p><strong>Status:</strong>
                    ${certificado.status || ''}</p>

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

        const nome =
            document.getElementById("nome").value.trim();

        const cpf =
            document.getElementById("cpf").value.trim();

        const curso =
            document.getElementById("curso").value.trim();

        const cargaHoraria =
            document.getElementById("cargaHoraria").value.trim();

        const aproveitamento =
            document.getElementById("aproveitamento").value.trim();

        const dataConclusao =
            document.getElementById("dataConclusao").value.trim();

        if (!nome || !cpf || !curso) {

            alert(
                "Preencha Nome, CPF e Curso."
            );

            return;
        }

        const dados =
            await carregarDados();

        if (!dados.certificados) {
            dados.certificados = [];
        }

        const codigoGerado =
            "CERT-" + Date.now();

        dados.certificados.push({

            codigo: codigoGerado,

            nome: nome,

            cpf: cpf,

            curso: curso,

            cargaHoraria: cargaHoraria,

            aproveitamento: aproveitamento,

            dataConclusao: dataConclusao,

            status: "Válido",

            pdfUrl: ""

        });

        const resposta = await fetch(
            `https://api.jsonbin.io/v3/b/${BIN_ID}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': API_KEY
                },
                body: JSON.stringify(dados)
            }
        );

        if (!resposta.ok) {
            throw new Error('Erro ao salvar');
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
