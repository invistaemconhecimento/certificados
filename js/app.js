
/* =========================
   CONFIG
========================= */

const BIN_ID =
  '6a0a9e5cc0954111d83cf8b4';

const ACCESS_KEY =
  '$2a$10$Jvr5LLqOqRb2XULpU2Hq/e39lNLZI0a9KiCRosIG0P3laO7gmviVa';

const API_URL =
  `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`;

/* =========================
   GLOBAL
========================= */

let certificados = [];

let jsonGerado = '';

/* =========================
   INIT
========================= */

document.addEventListener(
  'DOMContentLoaded',
  () => {

    carregarCertificados();

    preencherCodigoAutomatico();

  }
);

/* =========================
   FETCH PADRÃO
========================= */

async function buscarDados(){

  const response =
    await fetch(API_URL, {

      method: 'GET',

      headers: {

        'Content-Type':
          'application/json',

        'X-Access-Key':
          ACCESS_KEY,

        'X-Bin-Meta':
          'false'

      }

    });

  if(!response.ok){

    throw new Error(
      `Erro HTTP ${response.status}`
    );

  }

  return await response.json();

}

/* =========================
   CARREGAR CERTIFICADOS
========================= */

async function carregarCertificados(){

  try{

    certificados =
      await buscarDados();

    console.log(
      'Certificados carregados:',
      certificados
    );

  } catch(error){

    console.error(
      'Erro ao carregar certificados:',
      error
    );

  }

}

/* =========================
   GERAR CÓDIGO AUTOMÁTICO
========================= */

function preencherCodigoAutomatico(){

  const inputCodigo =
    document.getElementById('codigo');

  if(!inputCodigo) return;

  const numero =
    String(
      Math.floor(
        Math.random() * 9999
      )
    ).padStart(4, '0');

  inputCodigo.value =
    `CERT-${numero}`;

}

/* =========================
   FORMATAR DATA
========================= */

function formatarData(dataISO){

  if(!dataISO) return '';

  const [
    ano,
    mes,
    dia
  ] = dataISO.split('-');

  return `${dia}/${mes}/${ano}`;

}

/* =========================
   GERAR JSON
========================= */

function gerarJSON(){

  const codigo =
    document.getElementById('codigo')
    ?.value
    .trim();

  const nome =
    document.getElementById('nome')
    ?.value
    .trim();

  const cpf =
    document.getElementById('cpf')
    ?.value
    .trim();

  const curso =
    document.getElementById('curso')
    ?.value
    .trim();

  const carga =
    document.getElementById('carga')
    ?.value
    .trim();

  const aproveitamento =
    document.getElementById('aproveitamento')
    ?.value
    .trim();

  const data =
    document.getElementById('data')
    ?.value;

  const conteudo =
    document.getElementById('conteudo')
    ?.value
    .split('\n')
    .filter(
      item => item.trim() !== ''
    );

  if(
    !codigo ||
    !nome ||
    !cpf ||
    !curso
  ){

    alert(
      'Preencha os campos obrigatórios.'
    );

    return;

  }

  const certificado = {

    codigo,

    nome,

    cpf,

    curso,

    carga_horaria:
      Number(carga),

    aproveitamento:
      Number(aproveitamento),

    data_certificacao:
      formatarData(data),

    conteudo

  };

  jsonGerado =
    JSON.stringify(
      certificado,
      null,
      2
    );

  const jsonOutput =
    document.getElementById(
      'jsonOutput'
    );

  if(jsonOutput){

    jsonOutput.textContent =
      jsonGerado;

  }

  atualizarPreview(certificado);

}

/* =========================
   PREVIEW
========================= */

function atualizarPreview(certificado){

  const preview =
    document.getElementById(
      'previewContent'
    );

  if(!preview) return;

  preview.innerHTML = `

    <div class="preview-item">

      <div class="preview-label">
        Código
      </div>

      <div class="preview-value">
        ${certificado.codigo}
      </div>

    </div>

    <div class="preview-item">

      <div class="preview-label">
        Nome do Aluno
      </div>

      <div class="preview-value">
        ${certificado.nome}
      </div>

    </div>

    <div class="preview-item">

      <div class="preview-label">
        CPF
      </div>

      <div class="preview-value">
        ${certificado.cpf}
      </div>

    </div>

    <div class="preview-item">

      <div class="preview-label">
        Curso
      </div>

      <div class="preview-value">
        ${certificado.curso}
      </div>

    </div>

    <div class="preview-item">

      <div class="preview-label">
        Carga Horária
      </div>

      <div class="preview-value">
        ${certificado.carga_horaria} horas
      </div>

    </div>

    <div class="preview-item">

      <div class="preview-label">
        Aproveitamento
      </div>

      <div class="preview-value">
        ${certificado.aproveitamento}%
      </div>

    </div>

    <div class="preview-item">

      <div class="preview-label">
        Data da Certificação
      </div>

      <div class="preview-value">
        ${certificado.data_certificacao}
      </div>

    </div>

    <div class="preview-item">

      <div class="preview-label">
        Conteúdo Programático
      </div>

      <ul>

        ${certificado.conteudo
          .map(
            item =>
              `<li>${item}</li>`
          )
          .join('')
        }

      </ul>

    </div>

  `;

}

/* =========================
   COPIAR JSON
========================= */

function copiarJSON(){

  if(!jsonGerado){

    alert(
      'Nenhum JSON gerado.'
    );

    return;

  }

  navigator.clipboard.writeText(
    jsonGerado
  );

  alert(
    'JSON copiado com sucesso.'
  );

}

/* =========================
   CONSULTAR CERTIFICADO
========================= */

async function verificarCertificado(){

  const codigo =
    document.getElementById('codigo')
    ?.value
    .trim();

  const result =
    document.getElementById('result');

  const loading =
    document.getElementById('loading');

  if(!codigo){

    alert('Digite um código.');

    return;

  }

  if(loading){

    loading.style.display =
      'block';

  }

  if(result){

    result.style.display =
      'none';

  }

  try{

    const lista =
      await buscarDados();

    const certificado =
      lista.find(item =>

        item.codigo.toUpperCase() ===
        codigo.toUpperCase()

      );

    if(loading){

      loading.style.display =
        'none';

    }

    if(certificado){

      renderizarCertificado(
        certificado
      );

    } else {

      renderizarNaoEncontrado();

    }

  } catch(error){

    console.error(error);

    if(loading){

      loading.style.display =
        'none';

    }

    renderizarErro();

  }

}

/* =========================
   RENDER VALID
========================= */

function renderizarCertificado(
  certificado
){

  const result =
    document.getElementById(
      'result'
    );

  if(!result) return;

  result.innerHTML = `

    <div class="card">

      <div class="valid">
        ✅ Certificado válido
      </div>

      <div class="info-grid">

        <div class="info">

          <div class="info-label">
            Código
          </div>

          <div class="info-value">
            ${certificado.codigo}
          </div>

        </div>

        <div class="info">

          <div class="info-label">
            Aluno
          </div>

          <div class="info-value">
            ${certificado.nome}
          </div>

        </div>

        <div class="info">

          <div class="info-label">
            CPF
          </div>

          <div class="info-value">
            ${certificado.cpf}
          </div>

        </div>

        <div class="info">

          <div class="info-label">
            Curso
          </div>

          <div class="info-value">
            ${certificado.curso}
          </div>

        </div>

        <div class="info">

          <div class="info-label">
            Carga Horária
          </div>

          <div class="info-value">
            ${certificado.carga_horaria}h
          </div>

        </div>

        <div class="info">

          <div class="info-label">
            Aproveitamento
          </div>

          <div class="info-value">
            ${certificado.aproveitamento}%
          </div>

        </div>

        <div class="info">

          <div class="info-label">
            Data da Certificação
          </div>

          <div class="info-value">
            ${certificado.data_certificacao}
          </div>

        </div>

      </div>

      <div class="preview-item">

        <div class="preview-label">
          Conteúdo Programático
        </div>

        <ul>

          ${certificado.conteudo
            .map(
              item =>
                `<li>${item}</li>`
            )
            .join('')
          }

        </ul>

      </div>

    </div>

  `;

  result.style.display =
    'block';

}

/* =========================
   NOT FOUND
========================= */

function renderizarNaoEncontrado(){

  const result =
    document.getElementById(
      'result'
    );

  if(!result) return;

  result.innerHTML = `

    <div class="card">

      <div class="invalid">
        ❌ Certificado não encontrado
      </div>

      <p>
        O código informado não existe.
      </p>

    </div>

  `;

  result.style.display =
    'block';

}

/* =========================
   ERROR
========================= */

function renderizarErro(){

  const result =
    document.getElementById(
      'result'
    );

  if(!result) return;

  result.innerHTML = `

    <div class="card">

      <div class="invalid">
        ⚠️ Erro ao consultar
      </div>

      <p>
        Não foi possível acessar o servidor.
      </p>

    </div>

  `;

  result.style.display =
    'block';

}

