const orderInfo = document.querySelector(".orderInfo")
let userInfo //全部聯絡人資訊
function init(){
    getOrderInfo()
}
init()
//聯絡人表格
function getOrderInfo(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,{
    headers:{
        Authorization:token
    }
}).then(function(re){
    // console.log(re);
    userInfo = re.data.orders
    

    // console.log(userInfo);
    let txt = ""
    userInfo.forEach(function(re){
        
        //重組商品字串
        let str = "" //商品字串
        re.products.forEach(function(item){  //forEach內在包forEach，為了跑products
            str+=`<p>${item.title}X${item.quantity}</p>` //商品X數量
        })
        //重組訂單狀態字串
        if(re.paid == "true"){
            re.paid = "已處理"
        }else{
            re.paid = "未處理"
        }

        txt+=`<tr>
        <td>${re.id}</td>
        <td>
          <p>${re.user.name}</p>
          <p>${re.user.tel}</p>
        </td>
        <td>${re.user.address}</td>
        <td>${re.user.email}</td>
        <td>
          ${str}
        </td>
        <td>${re.createdAt}</td>
        <td class="orderStatus">
          <a href="#" class="js-orderStatus" data-id="${re.id}">${re.paid}</a>
        </td>
        <td>
          <input type="button" class="delSingleOrder-Btn js-orderDelete" data-id="${re.id}" value="刪除" />
        </td>
      </tr>`
    })
    orderInfo.innerHTML = txt
}).catch((error)=>console.log(error))
}

orderInfo.addEventListener("click",function(e){
    e.preventDefault()
    const targetClass = e.target.getAttribute("class")
    if(targetClass == "js-orderStatus"){
        alert("變更狀態")
        return
    }
    if(targetClass == "delSingleOrder-Btn js-orderDelete"){
        alert("刪除鈕")
        return
    }
})
