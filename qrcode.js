/* ==================================================
   QR CODE GENERATOR
   Requer:
   https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js
================================================== */

/* =========================
   CONFIG
========================= */

const BASE_URL =
  'https://teuusuario.github.io/certificados/verificar.html?codigo=';

/* =========================
   GERAR QR CODE
========================= */

function gerarQRCode(codigo, elementoId = 'qrcode') {

  const elemento =
    document.getElementById(elementoId);

  if(!elemento){

    console.error(
      `Elemento #${elementoId} não encontrado`
    );

    return;

  }

  elemento.innerHTML = '';

  const url =
    `${BASE_URL}${encodeURIComponent(codigo)}`;

  new QRCode(elemento, {

    text: url,

    width: 220,

    height: 220,

    colorDark : "#0f172a",

    colorLight : "#ffffff",

    correctLevel : QRCode.CorrectLevel.H

  });

}

/* =========================
   DOWNLOAD QR CODE
========================= */

function baixarQRCode(elementoId = 'qrcode', nomeArquivo = 'qrcode-certificado') {

  const canvas =
    document.querySelector(`#${elementoId} canvas`);

  if(!canvas){

    alert('QR Code ainda não foi gerado.');

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
   GERAR PELO INPUT
========================= */

function gerarQRCodePeloInput(){

  const input =
    document.getElementById('codigo');

  if(!input){

    alert('Campo código não encontrado.');

    return;

  }

  const codigo =
    input.value.trim();

  if(!codigo){

    alert('Digite um código.');

    return;

  }

  gerarQRCode(codigo);

}

/* =========================
   GERAR AUTOMATICAMENTE
========================= */

function gerarQRCodeAutomatico(){

  const codigo =
    new URLSearchParams(window.location.search)
      .get('codigo');

  if(codigo){

    gerarQRCode(codigo);

  }

}

/* =========================
   INIT
========================= */

document.addEventListener('DOMContentLoaded', () => {

  gerarQRCodeAutomatico();

});
