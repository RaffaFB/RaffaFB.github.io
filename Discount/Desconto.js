// valor: x a prazo e y a vista
// p = n deprestações
// p = 1: (1+(p-1))
// R = x/p


// Pega os valores definidos no navegador
document.getElementById('submitButton').addEventListener('click', function() {
  var p = parseFloat(document.getElementById("parc").value);
  //alert('O número de prestaçoes é: ' + p);
  var t = parseFloat(document.getElementById("itax").value);
  //alert('O valor da taxa é: ' + t);
  var y = parseFloat(document.getElementById("ipv").value);
  //alert('O valor financiado é: ' + y);
  var x = parseFloat(document.getElementById("ipp").value);
  //alert('O valor final é: ' + x);
  var v = parseFloat(document.getElementById("ipb").value);
  //alert('O valor que volta é: ' + v);

  // aplicaçao das funcoes nos valores dados pelo navegador
  var updated, backValue, totalFees, estimatedTax, tolerande, maxIterations;

  if (t > 0) {
    updated = updatePrice(x, p, t);
    //alert('updated = ' + updated);
    backValue = (x - updated) / p;
    //alert('backValue ' + backValue);
    document.getElementById("ipb").value = backValue.toFixed(1);
  }else if (t == 0) {
    tolerance = 0.0001;
    const maxIterations = 1000;
    estimatedTax = realTax(y, p, x, tolerance, maxIterations)*100;
    //alert('taxa estimada: ' + estimatedTax + '%');
    document.getElementById("itax").value = estimatedTax.toFixed(1);
  }

  totalFees = financingValue(updated, y);
  //alert('totalFees ' + totalFees + '%');
  document.getElementById("perc").value = totalFees.toFixed(1);


  if (t != 0) {
    if (totalFees <= 1) {
      alert('VALOR BAIXO');
    } else if (totalFees > 1 && totalFees <= 3) {
      alert('VALOR ACEITÁVEL');
    } else if (totalFees > 3 && totalFees <= 5) {
      alert('ESTÁ CARO');
    } else {
      alert('VOCÊ ESTÁ SENDO ROUBADO!!!!!!');
    }
  }
});

// calcula o valor atualizado
function updatePrice(x, p, t) {
  t = t/100;
  var fe = (t > 0) ? 1 + t : 1;
  const cf = t / (1 - Math.pow(1 + t, -p));
  const R = x / p;
  var A = (R * fe) / cf;
  return A;
}

// calcula o valor pago a mais
function financingValue(A, y) {
  return Math.abs(((A - y) / A) * 100);
}

// encontra o valor da taxa caso voce só tenha os valores e numero de parcelas
function realTax(y, p, x, tolerance, maxIterations) {
  function taxF(tax) {
    return y * Math.pow(1 + tax, p) - x;
  }
  function taxFPrime(tax) {
    return y * p * Math.pow(1 + tax, p - 1);
  }
  let tax = 0.1;
  let iteration = 0;

  while (Math.abs(taxF(tax)) > tolerance && iteration < maxIterations) {
    tax = tax - taxF(tax) / taxFPrime(tax);
    iteration++;
  }
  if (iteration === maxIterations) {
    console.log("O método não convergiu dentro do número máximo de iterações.");
  }
  return tax;
}
