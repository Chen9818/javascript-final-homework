let allProductData
let filterProductData = []


function init(){
    renderAllProduct(allProductData)
    addCart()
}

//全部商品清單
axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`)
.then(function(re){
    allProductData = re.data.products
    init()    
})
.catch((error)=>console.log(error))

//渲染全部商品
function renderAllProduct(item){
    const productWrap = document.querySelector(".productWrap")
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
let data1 = {}
let data = {}

function addCart(){
    let addCardBtn = document.querySelectorAll(".addCardBtn")
    addCardBtn.forEach(function(re){
        // console.log(re);
        re.addEventListener("click",addCard)
        function addCard(e){
            e.preventDefault()
            // console.log(e.target.getAttribute("data-id"));
            //重構格式

            data1["productId"] = e.target.getAttribute("data-id")
            data1["quantity"] = 1
            data["data"] = data1

            axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,data)
            .then(function(re){
                // console.log(re);
                getCart()
                alert("加入購物車")
            })
            .catch((error)=>console.log(error))

            // console.log(data["data"].quantity);
            // cartListData.forEach(function(re){
            //     console.log(re);
            //     // if(data["data"].productId === re.product.id){
            //     //     data1["quantity"]+=1
            //     //     console.log(data);    
            //     // }else{
            //     //     console.log("aa");
            //     // }
              
            // })
        }
    })

}

//購物車內商品
let cartListData = []
function getCart(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
.then(function(re){
    // console.log(re);
    cartListData = re.data.carts
    renderCart(cartListData)
})
.catch((error)=>console.log(error))
}


//渲染購物車內商品
const cartList = document.querySelector(".shoppingCart-table")
function renderCart(item){
    // console.log(item);
    let cartText = ""
    item.forEach(function(re){
        console.log(re);
        cartText +=`<tr>
        <td>
          <div class="cardItem-title">
            <img src="${re.product.images}" alt="" />
            <p>${re.product.title}</p>
          </div>
        </td>
        <td>NT$${re.product.price}</td>
        <td>1</td>
        <td>NT$12,000</td>
        <td class="discardBtn">
          <a href="#" class="material-icons">
            clear
          </a>
        </td>
      </tr>`

    })
    cartList.innerHTML = cartText
}


// {
//     "data": {
//       "productId": "CijPuIkOja6HEdZYMiV2",
//       "quantity": 5
//     }
//   }