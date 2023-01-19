const mobileMenu = document.getElementById("mobileMenu");
const navMenuItems = document.getElementById("navItems");
const navMenuClose = document.getElementById("mobileMenuClose");
const shopICon = document.querySelector(".mobileNav");
const shopBagde = document.querySelector(".cartBox");
const brand = document.querySelector(".navBrandBoxMobile");


// Mobile and Tablet NAvbar implementation//
if (mobileMenu) {
   mobileMenu.addEventListener("click", () => {
       navMenuItems.classList.add("active");
       mobileMenu.style.display = "none";
       shopICon.style.display = "none";
       shopBagde.style.display = "none";
       navMenuClose.style.display = "flex"; 
       brand.style.display = "flex";
   })    
}


if (navMenuClose) {
 navMenuClose.addEventListener("click", () => {
      navMenuItems.classList.remove("active");
      mobileMenu.style.display = "flex" 
      shopICon.style.display = "flex";
      brand.style.display = "none";      
    })
}


// Shop Items Js Implementation //
// let mainImage = document.getElementById("mainProduct");
// let smallerImage = document.getElementsByClassName("typesGroup");

// mainImage[0].onclick = function(){
//   mainImage.src = smallerImage[0].src;
// }
// smallerImage[1].onclick = function(){
//   mainImage.src = smallerImage[1].src;
// }
// smallerImage[2].onclick = function(){
//   mainImage.src = smallerImage[2].src;
// }
// smallerImage[3].onclick = function(){
//   mainImage.src = smallerImage[3].src;
// }