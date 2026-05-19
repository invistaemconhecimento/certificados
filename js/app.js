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
   BUSCAR DADOS JSONBIN
================================================== */

async function buscarDados(){

  const response =
    await fetch(API_URL, {

      method: 'GET',

      headers: {

        'Content-Type':
          'application/json',

        'X-Access-Key':
          ACCESS_KEY

      }

    });

  if(!response.ok){

    throw new Error(
      `Erro HTTP ${response.status}`
    );

  }

  const data =
    await response.json();

  console.log(
    'Dados JSONBin:',
    data
  );

  return data.record || [];

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
   GERAR CÓDIGO AUTOMÁTICO
================================================== */

function preencherCodigoAutomatico(){

  const input =
    document.getElementById('codigo');

  if(!input) return;

  const codigo =
    `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  input.value = codigo;

}

/* ==================================================
   FORMATAR DATA
================================================== */

function formatarData(dataISO){

  if(!dataISO) return '';

  const [ano, mes, dia] = dataISO.split('-');

  return `${dia}/${mes}/${ano}`;

}

/* ==================================================
   ESCAPE HTML (SEGURANÇA)
================================================== */

function escapeHTML(texto){

  if(!texto) return '';

  const div = document.createElement('div');

  div.innerText = texto;

  return div.innerHTML;

}

/* ==================================================
   MASCARAR CPF
================================================== */

function mascararCPF(cpf){

  if(!cpf) return '';

  cpf = cpf.replace(/\D/g, '');

  if(cpf.length !== 11) return cpf;

  return cpf.replace(
    /^(\d{3})\d{3}\d{3}(\d{2})$/,
    '$1.***.***-$2'
  );

}

/* ==================================================
   OBTER DADOS DO FORM
================================================== */

function obterDadosFormulario(){

  const codigo =
    document.getElementById('codigo')?.value.trim();

  const nome =
    document.getElementById('nome')?.value.trim();

  const cpf =
    document.getElementById('cpf')?.value.trim();

  const curso =
    document.getElementById('curso')?.value.trim();

  const carga =
    document.getElementById('carga')?.value.trim();

  const aproveitamento =
    document.getElementById('aproveitamento')?.value.trim();

  const data =
    document.getElementById('data')?.value;

  const conteudo =
    document.getElementById('conteudo')?.value
      .split('\n')
      .filter(i => i.trim() !== '');

  if(!codigo || !nome || !cpf || !curso){

    alert('Preencha os campos obrigatórios.');

    return null;

  }

  return {

    codigo,
    nome,
    cpf,
    curso,
    carga_horaria: Number(carga),
    aproveitamento: Number(aproveitamento),
    data_certificacao: formatarData(data),
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
    JSON.stringify(certificado, null, 2);

  document.getElementById('jsonOutput')
    .textContent = jsonGerado;

  atualizarPreview(certificado);

}

/* ==================================================
   PREVIEW
================================================== */

function atualizarPreview(certificado){

  const preview =
    document.getElementById('previewContent');

  if(!preview) return;

  preview.innerHTML = `

    <div class="preview-item">
      <div class="preview-label">Código</div>
      <div class="preview-value">${escapeHTML(certificado.codigo)}</div>
    </div>

    <div class="preview-item">
      <div class="preview-label">Nome</div>
      <div class="preview-value">${escapeHTML(certificado.nome)}</div>
    </div>

    <div class="preview-item">
      <div class="preview-label">CPF</div>
      <div class="preview-value">${mascararCPF(certificado.cpf)}</div>
    </div>

    <div class="preview-item">
      <div class="preview-label">Curso</div>
      <div class="preview-value">${escapeHTML(certificado.curso)}</div>
    </div>

    <div class="preview-item">
      <div class="preview-label">Carga Horária</div>
      <div class="preview-value">${certificado.carga_horaria}h</div>
    </div>

    <div class="preview-item">
      <div class="preview-label">Aproveitamento</div>
      <div class="preview-value">${certificado.aproveitamento}%</div>
    </div>

    <div class="preview-item">
      <div class="preview-label">Data</div>
      <div class="preview-value">${escapeHTML(certificado.data_certificacao)}</div>
    </div>

  `;

}

/* ==================================================
   COPIAR JSON
================================================== */

function copiarJSON(){

  if(!jsonGerado){
    alert('Nenhum JSON gerado.');
    return;
  }

  navigator.clipboard.writeText(jsonGerado);

  alert('JSON copiado com sucesso.');

}

/* ==================================================
   SALVAR CERTIFICADO NO JSONBIN
================================================== */

async function salvarCertificado(){

  try{

    const certificado =
      obterDadosFormulario();

    if(!certificado) return;

    const listaAtual =
      await buscarDados();

    if(!Array.isArray(listaAtual)){
      throw new Error('Formato inválido no JSONBin.');
    }

    const existe =
      listaAtual.some(item =>
        item.codigo.toUpperCase() === certificado.codigo.toUpperCase()
      );

    if(existe){
      alert('Já existe certificado com esse código.');
      return;
    }

    listaAtual.push(certificado);

    const response =
      await fetch(
        `https://api.jsonbin.io/v3/b/${BIN_ID}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Access-Key': ACCESS_KEY
          },
          body: JSON.stringify(listaAtual)
        }
      );

    if(!response.ok){
      throw new Error(`Erro HTTP ${response.status}`);
    }

    alert('Certificado salvo com sucesso!');

    limparFormulario();

    carregarCertificados();

  } catch(error){

    console.error(error);

    alert('Erro ao salvar certificado.');

  }

}

/* ==================================================
   LIMPAR FORM
================================================== */

function limparFormulario(){

  document.querySelectorAll('input, textarea')
    .forEach(c => {

      if(c.type !== 'button'){
        c.value = '';
      }

    });

  jsonGerado = '';

  document.getElementById('jsonOutput').textContent = '';

  document.getElementById('previewContent').innerHTML = '';

  document.getElementById('qrcode').innerHTML = '';

  preencherCodigoAutomatico();

}

/* ==================================================
   LISTAR CERTIFICADOS
================================================== */

function renderizarListaCertificados(){

  const container =
    document.getElementById('listaCertificados');

  if(!container) return;

  if(certificados.length === 0){

    container.innerHTML =
      `<div class="loading">Nenhum certificado cadastrado.</div>`;

    return;

  }

  container.innerHTML = `

    <table>

      <thead>
        <tr>
          <th>Código</th>
          <th>Nome</th>
          <th>Curso</th>
          <th>Data</th>
        </tr>
      </thead>

      <tbody>

        ${certificados.map(c => `

          <tr>
            <td>${escapeHTML(c.codigo)}</td>
            <td>${escapeHTML(c.nome)}</td>
            <td>${escapeHTML(c.curso)}</td>
            <td>${escapeHTML(c.data_certificacao)}</td>
          </tr>

        `).join('')}

      </tbody>

    </table>

  `;

}

/* ==================================================
   VERIFICAR CERTIFICADO
================================================== */

async function verificarCertificado(){

  const codigo =
    document.getElementById('codigo')?.value.trim();

  const result =
    document.getElementById('result');

  const loading =
    document.getElementById('loading');

  if(!codigo){
    alert('Digite um código.');
    return;
  }

  loading.style.display = 'block';
  result.style.display = 'none';

  try{

    const lista = await buscarDados();

    const certificado =
      lista.find(c =>
        c.codigo.toUpperCase() === codigo.toUpperCase()
      );

    loading.style.display = 'none';

    if(certificado){

      result.style.display = 'block';

      result.innerHTML = `
        <div class="card">
          <div class="valid">✅ Certificado válido</div>
          <p>${escapeHTML(certificado.nome)}</p>
        </div>
      `;

    } else {

      result.style.display = 'block';

      result.innerHTML = `
        <div class="card">
          <div class="invalid">❌ Não encontrado</div>
        </div>
      `;

    }

  } catch(err){

    console.error(err);

    loading.style.display = 'none';

    result.style.display = 'block';

    result.innerHTML = `
      <div class="card">
        <div class="invalid">Erro ao consultar</div>
      </div>
    `;

  }

}
