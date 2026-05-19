const BIN_ID =
  '6a0a9e5cc0954111d83cf8b4';

const ACCESS_KEY =
  '$2a$10$Jvr5LLqOqRb2XULpU2Hq/e39lNLZI0a9KiCRosIG0P3laO7gmviVa';

const API_URL =
  `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`;

let certificados = [];
let jsonGerado = '';

document.addEventListener('DOMContentLoaded', () => {
  carregarCertificados();
  preencherCodigoAutomatico();
});

/* =========================
   BUSCAR DADOS
========================= */

async function buscarDados(){

  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': ACCESS_KEY
    }
  });

  if(!response.ok){
    throw new Error(`Erro HTTP ${response.status}`);
  }

  const data = await response.json();

  console.log('JSONBin:', data);

  return data.record?.certificados || [];
}

/* =========================
   CARREGAR
========================= */

async function carregarCertificados(){

  try{

    certificados = await buscarDados();
    renderizarListaCertificados();

  }catch(err){
    console.error(err);
  }
}

/* =========================
   GERAR CÓDIGO
========================= */

function preencherCodigoAutomatico(){

  const input = document.getElementById('codigo');
  if(!input) return;

  input.value =
    `CERT-${Date.now()}-${Math.floor(Math.random()*1000)}`;
}

/* =========================
   FORM DATA
========================= */

function obterDadosFormulario(){

  const codigo = document.getElementById('codigo')?.value.trim();
  const nome = document.getElementById('nome')?.value.trim();
  const cpf = document.getElementById('cpf')?.value.trim();
  const curso = document.getElementById('curso')?.value.trim();
  const carga = document.getElementById('carga')?.value.trim();
  const aproveitamento = document.getElementById('aproveitamento')?.value.trim();
  const data = document.getElementById('data')?.value;

  const conteudo = document.getElementById('conteudo')?.value
    .split('\n')
    .filter(i => i.trim() !== '');

  if(!codigo || !nome || !cpf || !curso){
    alert('Preencha os campos obrigatórios');
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

/* =========================
   FORMATAR DATA
========================= */

function formatarData(data){

  if(!data) return '';

  const [y,m,d] = data.split('-');
  return `${d}/${m}/${y}`;
}

/* =========================
   SALVAR CERTIFICADO
========================= */

async function salvarCertificado(){

  try{

    const novo = obterDadosFormulario();
    if(!novo) return;

    const lista = await buscarDados();

    const existe = lista.some(c =>
      c.codigo.toUpperCase() === novo.codigo.toUpperCase()
    );

    if(existe){
      alert('Código já existe');
      return;
    }

    lista.push(novo);

    const payload = {
      certificados: lista
    };

    const response = await fetch(
      `https://api.jsonbin.io/v3/b/${BIN_ID}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': ACCESS_KEY
        },
        body: JSON.stringify(payload)
      }
    );

    if(!response.ok){
      throw new Error(`Erro HTTP ${response.status}`);
    }

    alert('Certificado salvo com sucesso!');

    limparFormulario();
    carregarCertificados();

  }catch(err){
    console.error(err);
    alert('Erro ao salvar certificado');
  }
}

/* =========================
   LIMPAR FORM
========================= */

function limparFormulario(){

  document.querySelectorAll('input, textarea').forEach(i=>{
    if(i.type !== 'button') i.value = '';
  });

  preencherCodigoAutomatico();
}

/* =========================
   LISTA
========================= */

function renderizarListaCertificados(){

  const el = document.getElementById('listaCertificados');
  if(!el) return;

  if(certificados.length === 0){
    el.innerHTML = '<p>Nenhum certificado</p>';
    return;
  }

  el.innerHTML = `
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
        ${certificados.map(c=>`
          <tr>
            <td>${c.codigo}</td>
            <td>${c.nome}</td>
            <td>${c.curso}</td>
            <td>${c.data_certificacao}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

/* =========================
   VERIFICAR
========================= */

async function verificarCertificado(){

  const codigo = document.getElementById('codigo')?.value.trim();
  const result = document.getElementById('result');

  if(!codigo){
    alert('Digite o código');
    return;
  }

  const lista = await buscarDados();

  const cert = lista.find(c =>
    c.codigo.toUpperCase() === codigo.toUpperCase()
  );

  if(cert){

    result.innerHTML = `
      <div class="card">
        <h3>✅ Válido</h3>
        <p>${cert.nome}</p>
        <p>${cert.curso}</p>
      </div>
    `;

  }else{

    result.innerHTML = `
      <div class="card">
        <h3>❌ Não encontrado</h3>
      </div>
    `;
  }
}
