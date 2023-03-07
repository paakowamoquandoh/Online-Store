// shop variables
const productArea = document.getElementById("cards");
const electroProductsBox = document.getElementById("swiper-wrapper");
const persProductsBox = document.getElementById("persCards");
const footProductsBox = document.getElementById("footCards");
const cartButton = document.querySelector(".cartTransBtn");
const closeCartBtn = document.querySelector(".closeCart");
const ClearCartBtn = document.querySelector(".cartFooterButton");
const cartArea =  document.querySelector(".cart");
const cartOverlay = document.querySelector(".cartOverlay");
const cartItemsQuantity = document.getElementById("itemsUpdate");
const mobileItemsQuantity = document.getElementById("mobileItemsUpdate");
const cartTotal = document.querySelector(".ItemsTotal");
const overlayCartContent = document.querySelector(".overlayCartContent");

//cart
let cartBasket = [];

//add Buttons
let addButtons = [];

function displayCartOverlay(){
  cartOverlay.classList.toggle("transparentBack");
  cartArea.classList.toggle("showCart");
}

// getting products implementation below
class Products {
  async getProducts(){
    try {
      let result = await fetch("shop.json");
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
class UI {
  loadAllproducts(products){
    let itemResult = "";
    products.forEach(product => {
      itemResult += `
      <!-- single Product -->
      <div class="swiper-slide">
      <div class="card">
      <div class="product">
      <img class="itemImage" src=${product.image} />
        <div class="description">
          <span class="itemTitle">${product.title}</span> 
          <h5>${product.description}</h5>         
        </div>
        
        <div class="priceBtns">
        <h4 class="itemPrice">Ghc ${product.price}</h4>
        <a class="shopNow proCart" onclick="window.location.href='categories.html'">Shop Now</a>
        <!--  -->
        </div>    
      </div>     
      </div> 
      </div>  
      <!-- single product ends here -->
      `      
    });
    
    // productArea.firstElementChild.innerHTML = itemResult;
    electroProductsBox.innerHTML = itemResult;
    // persProductsBox.firstElementChild.innerHTML = itemResult;
    // footProductsBox.firstElementChild.innerHTML = itemResult;
  }
  getAddToCartBtns(){
    const addToCartButtons = [...document.querySelectorAll(".proCart")];
    addButtons = addToCartButtons;
    addToCartButtons.forEach(button => {
      let id = button.dataset.id;
      let alreadySelectedItem = cartBasket.find(item => item.id === id);
      if (alreadySelectedItem) {
        button.innerText = "In Cart";
        button.disabled = true;
        // button.parentElement.parentElement.firstElementChild.innerText = "In Cart";       
      } 
        button.addEventListener("click", (event) => {
          event.target.innerText = "In Cart"
          event.target.disabled = true;
          // event.target.parentElement.parentElement.firstElementChild.innerText = "In Cart"
          //get item from products
          let selectedItem = {...Storage.getProduct(id), amount: 1};
         
          //add item to cart
          cartBasket = [...cartBasket, selectedItem];
          
          //save in local storage
          Storage.saveCart(cartBasket);

          //set cart values
          this.setCartItemValues(cartBasket);

          //display cart item 
           this.addCartItemToCart(selectedItem);
           
          //show the cart overlay
          // this.displayCartOverlay();
        })
       
    });
  }
  setCartItemValues(cartBasket){
    let itemTotal = 0;
    let itemsTotal = 0;
    cartBasket.map(item => {
      itemTotal += item.price * item.amount;
      itemsTotal += item.amount;
    })
    cartTotal.innerText = parseFloat(itemTotal.toFixed(2));
    cartItemsQuantity.innerText = itemsTotal; 
    mobileItemsQuantity.innerText = itemsTotal;  
  }
  addCartItemToCart(item){
     const itemDiv = document.createElement("div");
     itemDiv.classList.add("cartItem");
     itemDiv.innerHTML = `
     <img src=${item.image} alt="">          
     <div>
      <h4>${item.title}</h4>
      <h5>Ghc ${item.price}</h5>
        <ion-icon class="removeItem" data-id = ${item.id} name="trash-outline"></ion-icon>
     </div>
     <div>
      <ion-icon class="upBtn" name="caret-up-outline" data-id = ${item.id}></ion-icon>
      <p class="itemAmount">${item.amount}</p>
      <ion-icon class="downBtn" name="caret-down-outline" data-id = ${item.id}></ion-icon>
     </div>
     `;
     overlayCartContent.appendChild(itemDiv);
  }

  displayCartOverlay(){
     cartOverlay.classList.add("transparentBack");
     cartArea.classList.add("showCart");
  }
  setApplication(){
      cartBasket = Storage.getItemsFromCart(); 
      this.setCartItemValues(cartBasket);
      this.populateCart(cartBasket);
      closeCartBtn.addEventListener("click", this.hideCart)
  }
  populateCart(cartBasket){
    cartBasket.forEach(item => this.addCartItemToCart(item));

  }
  hideCart(){
    cartOverlay.classList.remove("transparentBack");
     cartArea.classList.remove("showCart");
  }
  cartLogic(){
    ClearCartBtn.addEventListener("click", () => {
      this.clearCartBasket();
    })
    // cart functionality
    overlayCartContent.addEventListener("click", event => {
      if (event.target.classList.contains("removeItem")) {        
        let removeFromBasket = event.target;
        let id = removeFromBasket.dataset.id;
        overlayCartContent.removeChild(removeFromBasket.parentElement.parentElement);
        this.removeItem(id);        
      } else if (event.target.classList.contains("upBtn")){
         let addUpToBasket = event.target;
         let id = addUpToBasket.dataset.id;
         let itemTotal = cartBasket.find(item => item.id === id);
         itemTotal.amount = itemTotal.amount + 1;
         Storage.saveCart(cartBasket);
         this.setCartItemValues(cartBasket);
         addUpToBasket.nextElementSibling.innerText = itemTotal.amount;
      } else if (event.target.classList.contains("downBtn")) {
         let takeOutOfBasket = event.target;
         let id = takeOutOfBasket.dataset.id; 
         let itemTotal = cartBasket.find(item => item.id === id); 
         itemTotal.amount = itemTotal.amount - 1; 
         if (itemTotal.amount > 0) {
           Storage.saveCart(cartBasket);
           this.setCartItemValues(cartBasket);
           takeOutOfBasket.previousElementSibling.innerText = itemTotal.amount;
         }else{
          overlayCartContent.removeChild(takeOutOfBasket.parentElement.parentElement)
          this.removeItem(id); 
         }    
      }
    });
  }
 
  clearCartBasket(){
    let selectedItems = cartBasket.map(item => item.id);
    selectedItems.forEach(id => this.removeItem(id));

    while (overlayCartContent.children.length > 0) {
      overlayCartContent.removeChild(overlayCartContent.children[0])      
    }
    this.hideCart();
  } 
  removeItem(id){
    cartBasket = cartBasket.filter(item => item.id !== id);
    this.setCartItemValues(cartBasket);
    Storage.saveCart(cartBasket)
    let button = this.getOneButton(id);
    button.disabled = false;
    button.innerHTML = `Add to Cart`;
  }
  getOneButton(id){
    return addButtons.find(button => button.dataset.id === id);
  }
}


//saving cart items to local storage
class Storage{
   static saveCartItems (products){
    localStorage.setItem("products", JSON.stringify(products));
   }

   static getProduct(id){
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find(product => product.id === id);
   }

   static saveCart(cartBasket){
    localStorage.setItem("cartBasket", JSON.stringify(cartBasket))
   }

   static getItemsFromCart (){
    return localStorage.getItem("cartBasket") ? JSON.parse(localStorage.getItem("cartBasket")) : [];
   }
}


// DOM load event 
document.addEventListener("DOMContentLoaded", ()=>{
  const ui = new UI();
  const products = new Products();
  // application setup
  ui.setApplication();
  //get product items
  products.getProducts().then(products => {
    ui.loadAllproducts(products);
    Storage.saveCartItems(products);
  }).then( () => {
    ui.getAddToCartBtns();
    ui.cartLogic();

  });
})





// swiper
const mainSwiper = new Swiper('.homeSwiper', {
  // Optional parameters
  slidesPreview: 1,
  spaceBetween: 20,
  autoplay: {
     delay: 27500,
     disableOnInteraction: false,
  }, 

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  breakpoints: {
    280:{
      slidesPerView: 1,
      spaceBetween: 10,
    },
    320:{
      slidesPerView: 2,
      spaceBetween: 10,
    },
    510:{
      slidesPerView: 2,
      spaceBetween: 10,
    },
    758:{
      slidesPerView: 3,
      spaceBetween: 15,
    },
    900:{
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1020:{
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1100:{
      slidesPerView: 4,
      spaceBetween: 20,
    },
    1210:{
      slidesPerView: 4,
      spaceBetween: 20,
    },
    1300:{
      slidesPerView: 5,
      spaceBetween: 20,
    },
    1400:{
      slidesPerView: 6,
      spaceBetween: 20,
    }
  },
});



































































