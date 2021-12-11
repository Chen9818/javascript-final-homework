const orderInfo = document.querySelector(".orderInfo")
let userInfo //全部聯絡人資訊
function init(){
    getOrderInfo()
}
init()

//圖表 C3
function renderC3(){
//圖表資料蒐集
let total = {}

userInfo.forEach(function(item){
    console.log(item);
    item.products.forEach(function(re){
        // console.log(re.category);
        if(total[re.category] === undefined){
            total[re.category] = re.price*re.quantity
        }else{
            total[re.category]+= re.price*re.quantity
        }
    })
    // console.log(total);

    //重組C3資料
    let categoryAry = Object.keys(total)
    let newData = []
    // console.log(categoryAry);
    categoryAry.forEach(function(item){
        // console.log(item);
        let ary = []
        ary.push(item)
        ary.push(total[item])
        // console.log(ary);
        newData.push(ary)
        // console.log(newData);

    })
    // console.log(newData);
    let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
        type: "pie",
        columns: newData,
    },
    
});
    let chart2 = c3.generate({
    bindto: '#chart2', // HTML 元素綁定
    data: {
        type: "pie",
        columns: newData,
    },
    
});
})

}



//聯絡人表格
function getOrderInfo(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,{
    headers:{
        Authorization:token
    }
}).then(function(res){
    // console.log(re);
    userInfo = res.data.orders
    

    // console.log(userInfo);
    let txt = ""

    userInfo.forEach(function(re){
        // console.log(re);
        //重組時間字串
        const timeStamp = new Date(re.createdAt*1000)
        let orderTime = `${timeStamp.getFullYear()}/${timeStamp.getMonth()+1}/${timeStamp.getDate()}`
        // console.log(orderTime);
        
        //重組商品字串
        let str = "" //商品字串
        re.products.forEach(function(item){  //forEach內在包forEach，為了跑products
            str+=`<p>${item.title}X${item.quantity}</p>` //商品X數量
        })
        //重組訂單狀態字串
        let newTxt
        if(re.paid == true){
            newTxt = "已處理"
        }else{
            newTxt = "未處理"
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
        <td>${orderTime}</td>
        <td class="orderStatus">
          <a href="#" class="js-orderStatus" data-id="${re.id}" data-status="${re.paid}">${newTxt}</a>
        </td>
        <td>
          <input type="button" class="delSingleOrder-Btn js-orderDelete" data-id="${re.id}" value="刪除" />
        </td>
      </tr>`
    })
    orderInfo.innerHTML = txt
    renderC3()
}).catch((error)=>console.log(error))
}

orderInfo.addEventListener("click",function(e){
    e.preventDefault()
    const targetClass = e.target.getAttribute("class")
    let id = e.target.getAttribute("data-id")
    if(targetClass == "js-orderStatus"){
        // alert("變更狀態")
        let status = e.target.getAttribute("data-status")
        // console.log(id ,status);
        changeStatus(id,status)
        return
    }
    if(targetClass == "delSingleOrder-Btn js-orderDelete"){
        deleteBtn(id)
        return
    }
})

//更改付費狀態
function changeStatus(id,status){
    let newStatus
    if(status == true){
        newStatus = false
    }else{
        newStatus = true
    }
    axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,{
        "data": {
            "id": id,
            "paid": newStatus
          }
    },{
        headers:{
            Authorization:token
        }
    }).then(function(re){
        // console.log(re);
        alert("修改成功")
        getOrderInfo()
    }).catch(function(error){
        console.log(error);
    })
}

//刪除個別資料
function deleteBtn(id){
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${id}`,{
        headers:{
            Authorization:token
        }}).then(function(re){
            alert("刪除成功")
            getOrderInfo()
            console.log(re)
        }).catch((error)=>console.log(error))
}

//刪除全部資料
let deleteAllBtn = document.querySelector(".discardAllBtn")
deleteAllBtn.addEventListener(("click"),function(e){
    e.preventDefault()
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,{
        headers:{
            Authorization:token
        }}).then(function(re){
            getOrderInfo()
            alert("全部刪除成功")
            console.log(re)
        }).catch((error)=>console.log(error))
})