//價格千分位
function format (num) {  
    var reg=/\d{1,3}(?=(\d{3})+$)/g;   
    return (num + '').replace(reg, '$&,');  
}

//email驗證
function validateEmail(email) {
    const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
return res.test(String(email).toLowerCase());
}


//手機驗證
function validatePhone(phone) {
    if(/^[09]{2}\d{8}$/.test(phone)){
        return true
    }else{
        return false
    }
}

//表單驗證
const input = document.querySelectorAll("input[name],select[name=交易方式]")
const form = document.querySelector(".orderInfo-form")
console.log(input);
const constraints = {
    "姓名":{
        presence:{
            message:"必填"
        }
    },
    "電話":{
        presence:{
            message:"必填"
        }
    },
    "Email":{
        presence:{
            message:"必填"
        }
    },
    "寄送地址":{
        presence:{
            message:"必填"
        }
    }
}

input.forEach((item)=>{
    console.log(item);
    orderInfoBtn.addEventListener("click",function(){
        // console.log(item.nextElementSibling);
        item.nextElementSibling.textContent = ""
        let errors = validate(form,constraints)
        console.log(errors)

        if(errors){
            Object.keys(errors).forEach(function(keys){
                console.log(keys);
                document.querySelector(`[data-message="${keys}"]`).textContent = errors[keys]
            })
        }
    })
})

//email格式錯誤提示
let sideMailMsg =document.querySelector("#customerEmail")
sideMailMsg.addEventListener("blur",function(){
    if(validateEmail(sideMailMsg.value) == false){
        document.querySelector(`[data-message=Email]`).textContent = "email格式錯誤"
        return
    }
})

//手機格式錯誤提示
let sidePhoneMsg =document.querySelector("#customerPhone")
sidePhoneMsg.addEventListener("blur",function(){
    if(validatePhone(sidePhoneMsg.value) == false){
        document.querySelector(`[data-message=電話]`).textContent = "手機格式錯誤"
        return
    }
})
