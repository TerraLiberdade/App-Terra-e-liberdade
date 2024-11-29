const products = [
    "Abacate", "Abacatinho", "Abacaxi", "Abacaxi_pequeno", "Acelga", "Acerola", "Agrião", "Alecrim", "Alface_crespa",
    "Alface_frise", "Alface_lisa", "Alface_mimosa", "Alface_repolhuda", "Alface_romana", "Alface_roxa", "Alho_poró_grosso",
    "Almeirão_liso", "Almeirão_pão_de_açúcar", "Ameixa_Rubimel", "Amora", "Arruda", "Aspargos", "Azedinha", "Babosa",
    "Banana", "Banana_nanica", "Banana_pão", "Banana_prata", "Boldo", "Boldo_chile", "Brocolis", "Brocolis_ramoso",
    "Camomila_flor", "Cana_de_açúcar", "Capim_santo", "Capuchinha", "Carambola", "Catalonia", "Caqui",
    "Caqui_rama_forte", "Cebolinha", "Chaya", "Citronela", "Coentro", "Coentro_do_pará", "Couve",
    "Couve_flor", "Escarola", "Erva_Santa_Maria", "Erva_cidreira", "Erva_doce_folha", "Espinafre", "Folha_de_canela",
    "Folha_de_uva", "Graviola", "Guaco", "Hibisco", "Hortelã", "Jabuticaba", "Jaca_mole_madura", "Jaca_verde",
    "Jambu", "Laranja", "Laranja_azeda_para_doce", "Laranja_bahia", "Lavanda_flor", "Lichia", "Lima_da_pérsia",
    "Limão_rosa", "Limão_siciliano", "Limão_tahiti", "Louro", "Mamão_verde", "Manga", "Manga_coquinho",
    "Manjericão", "Mandioca_Amarela", "Mandioca_Branca", "Maracujá", "Maxixe", "Mexerica", "Menta",
    "Morango", "Mostarda", "Ora_pro_nobis", "Orégano", "Peixinho", "Pepino_caipira", "Pepino_japones",
    "Pêssego", "Pitanga", "Pitaya", "Poejo", "Quincam", "Repolho", "Repolho_baby", "Romã",
    "Rúcula", "Salsão_bulbo", "Salsão_folha", "Salsinha", "Seriguela", "Taioba", "Tomate_cereja",
    "Tomate_verde", "Tomilho", "Uva_níagara", "Vagem"
  ];
  
  // Função para carregar imagens dos produtos
  function loadProductImages() {
    const productContainer = document.getElementById('products');
    products.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('product');
      
      // Usar o nome do produto diretamente
      const productImg = `images/${product}.png`;
  
      imageExists(productImg, function (exists) {
        const imgElement = document.createElement('img');
        imgElement.src = exists ? productImg : 'images/default.png'; // Caso a imagem não seja encontrada
        productDiv.appendChild(imgElement);
  
        // Criar label e checkbox
        const label = document.createElement('label');
        label.innerText = product;
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'product';
        checkbox.value = product;
  
        // Criar campo de quantidade
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.name = `${product}_quantity`;
        quantityInput.min = 1; // Garantir que a quantidade mínima seja 1
        quantityInput.value = 1; // Valor inicial da quantidade
  
        productDiv.appendChild(label);
        productDiv.appendChild(checkbox);
        productDiv.appendChild(quantityInput);
        productContainer.appendChild(productDiv);
      });
    });
  }
  
  // Função para verificar se a imagem existe
  function imageExists(url, callback) {
    const img = new Image();
    img.onload = function () { callback(true); };
    img.onerror = function () { callback(false); };
    img.src = url;
  }
  
  // Função para salvar a seleção e enviar para o Google Apps Script
  function saveSelection() {
    const name = document.getElementById('name').value.trim();
    const checkboxes = document.querySelectorAll('input[name="product"]:checked');
    const selectedProducts = [];
  
    checkboxes.forEach(checkbox => {
      const productName = checkbox.value;
      const quantityInput = document.querySelector(`input[name="${productName}_quantity"]`);
      const quantity = quantityInput ? quantityInput.value : 1; // Definir a quantidade como 1 se não houver entrada
  
      selectedProducts.push({ product: productName, quantity: quantity });
    });
  
    if (!name) {
      alert('Por favor, digite seu nome antes de salvar a seleção.');
      return;
    }
  
    if (selectedProducts.length === 0) {
      alert('Por favor, selecione pelo menos um produto.');
      return;
    }
  
    alert(`Nome: ${name}\nProdutos selecionados:\n` + selectedProducts.map(p => `${p.product}: ${p.quantity}`).join('\n'));
  
    // Enviar dados ao Google Apps Script
    sendDataToScript(name, selectedProducts, new Date().toLocaleDateString());
  }
  
  // Função para enviar os dados para o Apps Script via GET
  function sendDataToScript(name, selectedProducts, date) {
    const url = 'https://script.google.com/macros/s/AKfycby9BEb4LAigGy_iwyPkloSHb29CCBJ8lIIcw4XQGbiBPAqP6Yapt_ewUbHtKgIRXjyeew/exec';
    const data = {
      name: name,
      products: selectedProducts.map(p => `${p.product}:${p.quantity}`).join(','), // Formato para envio: produto:quantidade
      date: date
    };
  
    const queryString = new URLSearchParams(data).toString();
    const fullUrl = url + "?" + queryString;
  
    fetch(fullUrl)
      .then(response => response.text()) // Recebe resposta como texto
      .then(responseData => {
        console.log('Success:', responseData);
        alert('Seleção enviada com sucesso! Obrigado por participar.');
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Erro ao enviar os dados. Por favor, tente novamente.');
      });
  }
  
  // Carregar imagens dos produtos ao carregar a página
  window.onload = loadProductImages;
  