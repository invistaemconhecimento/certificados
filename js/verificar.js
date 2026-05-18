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
   INIT
========================= */

document.addEventListener(
  'DOMContentLoaded',
  () => {

    carregarCertificado();

  }
);

/* =========================
   CARREGAR CERTIFICADO
========================= */

async function carregarCertificado() {

  const resultado =
    document.getElementById('resultado');

  const params =
    new URLSearchParams(
      window.location.search
    );

  const codigo =
    params.get('codigo');

  if (!codigo) {

    renderizarCodigoAusente();

    return;

  }

  try {

    const response =
      await fetch(API_URL, {

        headers: {
          'X-Access-Key': ACCESS_KEY
        }

      });

    if (!response.ok) {

      throw new Error(
        `Erro HTTP: ${response.status}`
      );

    }

    const data =
      await response.json();

    const certificados =
      data.record || [];

    const certificado =
      certificados.find(item =>
        item.codigo.toUpperCase() ===
        codigo.toUpperCase()
      );

    if (certificado) {

      renderizarCertificado(
        certificado
      );

    } else {

      renderizarNaoEncontrado();

    }

  } catch (error) {

    console.error(
      'Erro ao consultar certificado:',
      error
    );

    renderizarErro(error);

  }

}

/* =========================
   RENDERIZAR CERTIFICADO
========================= */

function renderizarCertificado(
  certificado
) {

  const resultado =
    document.getElementById(
      'resultado'
    );

  if (!resultado) return;

  const conteudoHTML =
    certificado.conteudo
      ?.map(
        item => `<li>${item}</li>`
      )
      .join('') || '';

  resultado.innerHTML = `

    <div class="card">

      <div class="valid">
        ✅ Certificado Autêntico
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
            Nome do Aluno
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
            ${certificado.carga_horaria} horas
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
          ${conteudoHTML}
        </ul>

      </div>

    </div>

  `;

}

/* =========================
   NÃO ENCONTRADO
========================= */

function renderizarNaoEncontrado() {

  const resultado =
    document.getElementById(
      'resultado'
    );

  if (!resultado) return;

  resultado.innerHTML = `

    <div class="card">

      <div class="invalid">
        ❌ Certificado não encontrado
      </div>

      <p>
        O código informado não existe
        em nossa base de dados.
      </p>

    </div>

  `;

}

/* =========================
   CÓDIGO AUSENTE
========================= */

function renderizarCodigoAusente() {

  const resultado =
    document.getElementById(
      'resultado'
    );

  if (!resultado) return;

  resultado.innerHTML = `

    <div class="card">

      <div class="invalid">
        ⚠️ Código não informado
      </div>

      <p>
        Nenhum código foi enviado
        para validação.
      </p>

    </div>

  `;

}

/* =========================
   ERRO
========================= */

function renderizarErro(error) {

  const resultado =
    document.getElementById(
      'resultado'
    );

  if (!resultado) return;

  resultado.innerHTML = `

    <div class="card">

      <div class="invalid">
        ⚠️ Erro ao consultar
      </div>

      <p>
        Não foi possível acessar
        a base de certificados.
      </p>

      <br>

      <small>
        ${error.message}
      </small>

    </div>

  `;

}
