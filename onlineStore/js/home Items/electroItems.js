
async function displayData() {
  try {
    const response = await fetch('../../electro.json');
    const data = await response.json();
    let products = data.items;
    products = products.map(item => {
      const {title, price, description} = item.fields;
      const {id} = item.sys;
      const image = item.fields.image.fields.file.url;
      return {title, price, description, id, image};
    })
    

    const itemsContainer = document.querySelector('#electroSwiper-wrapper');
    itemsContainer.innerHTML = '';

    data.items.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.classList.add('swiper-slide"');
      itemElement.innerHTML = `
      <!-- single Product -->
     
      <div class="card">
      <div class="product">
      <img class="itemImage" src=${item.image} />
        <div class="description">
          <span class="itemTitle">${item.title}</span> 
          <h5>${item.description}</h5>         
        </div>
        <div class="priceBtns">
        
        <!--  -->
        </div>    
      </div>     
      </div> 
      </div>  
      <!-- single product ends here -->
      `;
      itemsContainer.appendChild(itemElement);
    });
  } catch (error) {
    console.error(error);
  }
}


displayData();

// async function displayData() {
//   try {
//     const response = await fetch('data.json');
//     const data = await response.json();

//     const itemsContainer = document.querySelector('#electroSwiper-wrapper');
//     itemsContainer.innerHTML = '';

//     data.items.forEach(({ fields: { title, description, image: { fields: { file: { url } } } } }) => {
//       const itemElement = document.createElement('div');
//       itemElement.classList.add('item');
//       itemElement.innerHTML = `
//         <h2>${title}</h2>
//         <p>${description}</p>
//         <img src="${url}" alt="${title}">
//       `;
//       itemsContainer.appendChild(itemElement);
//     });
//   } catch (error) {
//     console.error(error);
//   }
// }





