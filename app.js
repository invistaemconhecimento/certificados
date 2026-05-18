const API_URL = "SUA_URL_JSONBIN";

async function carregarDados() {

  try {

    const response = await fetch(API_URL);

    const data = await response.json();

    return data.record || data;

  } catch (error) {

    console.error(error);

    return [];

  }

}

function mascararCPF(cpf){

  return "***." + cpf.slice(4);

}

async function buscarCertificado() {

  const codigo = document
    .getElementById("codigoInput")
    .value
    .trim();

  const resultado = document.getElementById("resultado");

  resultado.innerHTML = "Carregando...";

  const certificados = await carregarDados();

  const cert = certificados.find(c => c.codigo === codigo);

  if(cert){

    resultado.innerHTML = `
      <div class="resultado">

        <div class="sucesso">
          ✅ Certificado Válido
        </div>

        <div class="info">
          <span class="label">Aluno:</span>
          ${cert.nome}
        </div>

        <div class="info">
          <span class="label">CPF:</span>
          ${mascararCPF(cert.cpf)}
        </div>

        <div class="info">
          <span class="label">Curso:</span>
          ${cert.curso}
        </div>

        <div class="info">
          <span class="label">Carga Horária:</span>
          ${cert.carga_horaria} horas
        </div>

        <div class="info">
          <span class="label">Aproveitamento:</span>
          ${cert.aproveitamento}%
        </div>

        <div class="info">
          <span class="label">Data da Certificação:</span>
          ${cert.data_certificacao}
        </div>

        <div class="info">
          <span class="label">Conteúdo Programático:</span>

          <ul>
            ${cert.conteudo.map(item => `<li>${item}</li>`).join("")}
          </ul>

        </div>

        <div class="codigo">
          Código de Verificação:
          ${cert.codigo}
        </div>

      </div>
    `;

  } else {

    resultado.innerHTML = `
      <div class="erro">
        ❌ Certificado não encontrado
      </div>
    `;

  }

}

window.onload = async () => {

  const params = new URLSearchParams(window.location.search);

  const codigo = params.get("codigo");

  if(codigo){

    document.getElementById("codigoInput").value = codigo;

    buscarCertificado();

  }

};
