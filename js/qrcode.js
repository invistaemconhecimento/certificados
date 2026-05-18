```javascript id="6s2m1d"
/* ==================================================
   QR CODE SYSTEM
================================================== */

/* =========================
   CONFIG
========================= */

const BASE_URL =
  'https://invistaemconhecimento.github.io/certificados/verificar.html?codigo=';

/* =========================
   GERAR QR CODE
========================= */

function gerarQRCode(codigo, elementoId = 'qrcode') {

  const elemento =
    document.getElementById(elementoId);

  if (!elemento) {

    console.error(
      `Elemento #${elementoId} não encontrado`
    );

    return;

  }

  if (!codigo) {

    alert('Código do certificado não informado.');

    return;

  }

  elemento.innerHTML = '';

  const url =
    `${BASE_URL}${encodeURIComponent(codigo)}`;

  new QRCode(elemento, {

    text: url,

    width: 220,

    height: 220,

    colorDark: '#0f172a',

    colorLight: '#ffffff',

    correctLevel: QRCode.CorrectLevel.H

  });

}

/* =========================
   GERAR PELO INPUT
========================= */

function gerarQRCodePeloInput() {

  const input =
    document.getElementById('codigo');

  if (!input) {

    alert('Campo de código não encontrado.');

    return;

  }

  const codigo =
    input.value.trim();

  if (!codigo) {

    alert('Digite um código.');

    return;

  }

  gerarQRCode(codigo);

}

/* =========================
   DOWNLOAD QR CODE
========================= */

function baixarQRCode(
  elementoId = 'qrcode',
  nomeArquivo = 'qrcode-certificado'
) {

  const canvas =
    document.querySelector(
      `#${elementoId} canvas`
    );

  if (!canvas) {

    alert(
      'Nenhum QR Code foi gerado ainda.'
    );

    return;

  }

  const link =
    document.createElement('a');

  link.download =
    `${nomeArquivo}.png`;

  link.href =
    canvas.toDataURL('image/png');

  link.click();

}

/* =========================
   GERAR AUTOMATICAMENTE
========================= */

function gerarQRCodeAutomatico() {

  const params =
    new URLSearchParams(window.location.search);

  const codigo =
    params.get('codigo');

  if (codigo) {

    gerarQRCode(codigo);

  }

}

/* =========================
   COPIAR LINK DE VALIDAÇÃO
========================= */

function copiarLinkValidacao() {

  const input =
    document.getElementById('codigo');

  if (!input) {

    alert('Campo código não encontrado.');

    return;

  }

  const codigo =
    input.value.trim();

  if (!codigo) {

    alert('Digite um código.');

    return;

  }

  const link =
    `${BASE_URL}${encodeURIComponent(codigo)}`;

  navigator.clipboard.writeText(link);

  alert(
    'Link de validação copiado.'
  );

}

/* =========================
   ABRIR VALIDAÇÃO
========================= */

function abrirValidacao() {

  const input =
    document.getElementById('codigo');

  if (!input) {

    alert('Campo código não encontrado.');

    return;

  }

  const codigo =
    input.value.trim();

  if (!codigo) {

    alert('Digite um código.');

    return;

  }

  const url =
    `${BASE_URL}${encodeURIComponent(codigo)}`;

  window.open(url, '_blank');

}

/* =========================
   INIT
========================= */

document.addEventListener(
  'DOMContentLoaded',
  () => {

    gerarQRCodeAutomatico();

  }
);
```
