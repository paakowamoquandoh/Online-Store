let Indexshop = document.getElementById("secondRow");


// getting products implementation below
class MoreProducts {
  async getProducts(){
    try {
      let result = await fetch("footwear.json");
      let data = await result.json();
      let products = data.items;
      products = products.map(item => {
        const {title, price, description} = item.fields;
        const {id} = item.sys;
        const image = item.fields.image.fields.file.url;
        return {title, price, description, id, image};
      })
      return products;
    } catch (error) {
      console.log(error);      
    }
  }
}

// display products implementation
class MoreUI {
  loadAllMoreProducts(products){
    let moreItemResult = "";
    products.forEach(product => {
      moreItemResult += `
      <!-- single Product -->
      <div class="card">
      <div class="product">
      <img class="itemImage" src=${product.image} />
        <div class="description">
          <span class="itemTitle">${product.title}</span> 
          <h5>${product.description}</h5>         
        </div>
        <a class="shopNow" onclick="window.location.href='categories.html'">Shop Now</a>
        <div class="priceBtns">
        <h4 class="itemPrice">Ghc ${product.price}</h4>
        <!--  -->
        </div>    
      </div>     
      </div>  
      <!-- single product ends here -->
      `      
    });
    
    Indexshop.innerHTML = moreItemResult;
  }
}

// DOM load event 
document.addEventListener("DOMContentLoaded", ()=>{
  const ui = new MoreUI();
  const products = new MoreProducts();

  //get product items
  products.getProducts().then(products => {
    ui.loadAllMoreProducts(products);
    Storage.saveCartItems(products);
  })
})
