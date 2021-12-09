let allProductData //全部品項
let allCartProduct //購物車內的品項
let filterProductData = [] //篩選後品項


function init(){
    renderAllProduct(allProductData)
    renderAddCart()
}

//全部商品清單
axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`)
.then(function(re){
    allProductData = re.data.products
    init()    
})
.catch((error)=>console.log(error))

//渲染全部商品
const productWrap = document.querySelector(".productWrap")
function renderAllProduct(item){
    let productText = ""
    // console.log(item);
    item.forEach(function(re){
        productText +=`
        <li class="productCard"  data-category="${re.category}">
            <h4 class="productType">新品</h4>
            <img
            src="${re.images}"
            alt="${re.title}"
            />
            <a href="#" class="addCardBtn" data-id=${re.id}>加入購物車</a>
            <h3>${re.title}</h3>
            <del class="originPrice">NT$${re.origin_price}</del>
            <p class="nowPrice">NT$${re.price}</p>
        </li>`
    })
    productWrap.innerHTML = productText
}

    //篩選按鈕功能
    const productSelect = document.querySelector(".productSelect")
    productSelect.addEventListener("change",filterProduct)
    function filterProduct(e){
        // console.log(e.target.value);
        if(e.target.value === "全部"){
            renderAllProduct(allProductData)
            return
        }
        allProductData.forEach(function(re){
            if(re.category === e.target.value){
                // console.log(re);
                filterProductData.push(re)
            }

        })
        renderAllProduct(filterProductData)
        filterProductData = [] 
    }

//加入購物車功能
productWrap.addEventListener("click",addCartBtn)
function addCartBtn(e){
    e.preventDefault()
    // console.log(e.target.getAttribute("class"));
    if(e.target.getAttribute("class") !== "addCardBtn"){
        return
    }
    let addCardId = e.target.getAttribute("data-id")
    // console.log(addCardId);
    let numCheck = 1 //商品預設數量為1
    allCartProduct.forEach(function(re){
        if(re.product.id === addCardId){ //購物車內有某一商品，就累加數量
            numCheck = re.quantity+=1
        }
    })
    // console.log(numCheck);

    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,{
            "data": {
              "productId": addCardId,
              "quantity": numCheck
            }
          }
    )
    .then(function(re){
        console.log(re);
        renderAddCart()
        alert("加入購物車")
    })
    .catch((error)=>console.log(error))
}

//渲染購物車內商品
let cartList = document.querySelector(".shoppingCart-tableList")
function renderAddCart(){
       // console.log(item);
       axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
       .then(function(re){
           allCartProduct = re.data.carts
           document.querySelector(".totalPrice").textContent = re.data.finalTotal //總價格
           let cartText = ""
        //    console.log(allCartProduct);
           allCartProduct.forEach(function(re){
            //    console.log(re);
               cartText +=`<tr>
               <td>
                 <div class="cardItem-title">
                   <img src="${re.product.images}" alt="" />
                   <p>${re.product.title}</p>
                 </div>
               </td>
               <td>NT$${re.product.price}</td>
               <td>${re.quantity}</td>
               <td>NT$${re.product.price*re.quantity}</td>
               <td class="discardBtn">
                 <a href="#" class="material-icons" data-id="${re.id}">
                   clear
                 </a>
               </td>
             </tr>`
       
           })
           cartList.innerHTML = cartText

        })
       .catch((error)=>console.log(error))
       
}

//刪除購物車單一品項
cartList.addEventListener("click",deleteBtn)
function deleteBtn(e){
    e.preventDefault()
    // console.log(e.target.getAttribute("data-id"));
    cartId = e.target.getAttribute("data-id")
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`)
    .then(function(re){
        // console.log(re)
        renderAddCart()
        alert("刪除成功")
    })
    .catch((error)=>console.log(error))
}


//清空購物車
const discardAllBtn = document.querySelector(".discardAllBtn")
discardAllBtn.addEventListener("click",deleteAllBtn)
function deleteAllBtn(e){
    e.preventDefault()
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
    .then(function(re){
        // console.log(re)
        renderAddCart()
        alert("刪除成功")
    })
    .catch(function(error){
        alert("已清空")
    })
}
