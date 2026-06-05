async function consultar() {

const codigo =
document.getElementById("codigo").value;

const dados =
await carregarDados();

const certificado =
dados.certificados.find(
c => c.codigo === codigo
);

const resultado =
document.getElementById("resultado");

if(certificado){

resultado.innerHTML = `
<h2>Certificado Válido</h2>

<p><b>Aluno:</b>
${certificado.nome}</p>

<p><b>Curso:</b>
${certificado.curso}</p>

<p><b>Status:</b>
${certificado.status}</p>
`;

}else{

resultado.innerHTML =
"<h2>Certificado não encontrado</h2>";

}

}
