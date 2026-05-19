/* ==================================================
   CONFIG
================================================== */

const BIN_ID =
  '6a0a9e5cc0954111d83cf8b4';

const ACCESS_KEY =
  '$2a$10$Jvr5LLqOqRb2XULpU2Hq/e39lNLZI0a9KiCRosIG0P3laO7gmviVa';

const API_URL =
  `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`;

/* ==================================================
   GLOBAL
================================================== */

let certificados = [];

let jsonGerado = '';

/* ==================================================
   INIT
================================================== */

document.addEventListener(
  'DOMContentLoaded',
  () => {

    carregarCertificados();

    preencherCodigoAutomatico();

  }
);

/* ==================================================
   FETCH DADOS
================================================== */

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

/* ==================================================
   CARREGAR CERTIFICADOS
================================================== */

async function carregarCertificados(){

  try{

    certificados =
      await buscarDados();

    renderizarListaCertificados();

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

/* ==================================================
   GERAR CÓDIGO
================================================== */

function preencherCodigoAutomatico(){

  const inputCodigo =
    document.getElementById('codigo');

  if(!inputCodigo) return;

  const codigo =
    `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  inputCodigo.value =
    codigo;

}

/* ==================================================
   FORMATAR DATA
================================================== */

function formatarData(dataISO){

  if(!dataISO) return '';

  const [
    ano,
    mes,
    dia
  ] = dataISO.split('-');

  return `${dia}/${mes}/${ano}`;

}

/* ==================================================
   ESCAPE HTML
================================================== */

function escapeHTML(texto){

  if(!texto) return '';

  const div =
    document.createElement('div');

  div.innerText = texto;

  return div.innerHTML;

}

/* ==================================================
   MASCARAR CPF
================================================== */

function mascararCPF(cpf){

  if(!cpf) return '';

  cpf =
    cpf.replace(/\D/g, '');

  if(cpf.length !== 11){

    return cpf;

  }

  return cpf.replace(
    /^(\d{3})\d{3}\d{3}(\d{2})$/,
    '$1.***.***-$2'
  );

}

/* ==================================================
   OBTER DADOS FORM
================================================== */

function obterDadosFormulario(){

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

    return null;

  }

  return {

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

}

/* ==================================================
   GERAR JSON
================================================== */

function gerarJSON(){

  const certificado =
    obterDadosFormulario();

  if(!certificado) return;

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

/* ==================================================
   PREVIEW
================================================== */

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
        ${escapeHTML(certificado.codigo)}
      </div>

    </div>

    <div class="preview-item">

      <div class="preview-label">
        Nome do Aluno
      </div>

      <div class="preview-value">
        ${escapeHTML(certificado.nome)}
      </div>

    </div>

    <div class="preview-item">

      <div class="preview-label">
        CPF
      </div>

      <div class="preview-value">
        ${mascararCPF(certificado.cpf)}
      </div>

    </div>

    <div class="preview-item">

      <div class="preview-label">
        Curso
      </div>

      <div class="preview-value">
        ${escapeHTML(certificado.curso)}
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
        ${escapeHTML(certificado.data_certificacao)}
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
              `<li>${escapeHTML(item)}</li>`
          )
          .join('')
        }

      </ul>

    </div>

  `;

}

/* ==================================================
   COPIAR JSON
================================================== */

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

/* ==================================================
   SALVAR CERTIFICADO
================================================== */

async function salvarCertificado(){

  try{

    const certificado =
      obterDadosFormulario();

    if(!certificado) return;

    const listaAtual =
      await buscarDados();

    const existe =
      listaAtual.some(item =>

        item.codigo.toUpperCase() ===
        certificado.codigo.toUpperCase()

      );

    if(existe){

      alert(
        'Já existe certificado com esse código.'
      );

      return;

    }

    listaAtual.push(
      certificado
    );

    const response =
      await fetch(

        `https://api.jsonbin.io/v3/b/${BIN_ID}`,

        {

          method: 'PUT',

          headers: {

            'Content-Type':
              'application/json',

            'X-Access-Key':
              ACCESS_KEY

          },

          body:
            JSON.stringify(listaAtual)

        }

      );

    if(!response.ok){

      throw new Error(
        `Erro HTTP ${response.status}`
      );

    }

    alert(
      'Certificado salvo com sucesso.'
    );

    limparFormulario();

    carregarCertificados();

  } catch(error){

    console.error(error);

    alert(
      'Erro ao salvar certificado.'
    );

  }

}

/* ==================================================
   LIMPAR FORM
================================================== */

function limparFormulario(){

  document
    .querySelectorAll(
      'input, textarea'
    )
    .forEach(campo => {

      if(
        campo.type !== 'button'
      ){

        campo.value = '';

      }

    });

  const jsonOutput =
    document.getElementById(
      'jsonOutput'
    );

  if(jsonOutput){

    jsonOutput.textContent = '';

  }

  const preview =
    document.getElementById(
      'previewContent'
    );

  if(preview){

    preview.innerHTML = '';

  }

  const qrcode =
    document.getElementById(
      'qrcode'
    );

  if(qrcode){

    qrcode.innerHTML = '';

  }

  preencherCodigoAutomatico();

}

/* ==================================================
   VERIFICAR CERTIFICADO
================================================== */

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

/* ==================================================
   RENDER CERTIFICADO
================================================== */

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
            ${escapeHTML(certificado.codigo)}
          </div>

        </div>

        <div class="info">

          <div class="info-label">
            Aluno
          </div>

          <div class="info-value">
            ${escapeHTML(certificado.nome)}
          </div>

        </div>

        <div class="info">

          <div class="info-label">
            CPF
          </div>

          <div class="info-value">
            ${mascararCPF(certificado.cpf)}
          </div>

        </div>

        <div class="info">

          <div class="info-label">
            Curso
          </div>

          <div class="info-value">
            ${escapeHTML(certificado.curso)}
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
            ${escapeHTML(certificado.data_certificacao)}
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
                `<li>${escapeHTML(item)}</li>`
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

/* ==================================================
   NÃO ENCONTRADO
================================================== */

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

/* ==================================================
   ERRO
================================================== */

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

/* ==================================================
   LISTAR CERTIFICADOS
================================================== */

function renderizarListaCertificados(){

  const container =
    document.getElementById(
      'listaCertificados'
    );

  if(!container) return;

  if(
    !certificados.length
  ){

    container.innerHTML = `

      <div class="loading">
        Nenhum certificado cadastrado.
      </div>

    `;

    return;

  }

  container.innerHTML = `

    <table>

      <thead>

        <tr>

          <th>
            Código
          </th>

          <th>
            Nome
          </th>

          <th>
            Curso
          </th>

          <th>
            Data
          </th>

        </tr>

      </thead>

      <tbody>

        ${certificados
          .map(certificado => `

            <tr>

              <td>
                ${escapeHTML(certificado.codigo)}
              </td>

              <td>
                ${escapeHTML(certificado.nome)}
              </td>

              <td>
                ${escapeHTML(certificado.curso)}
              </td>

              <td>
                ${escapeHTML(certificado.data_certificacao)}
              </td>

            </tr>

          `)
          .join('')
        }

      </tbody>

    </table>

  `;

}
