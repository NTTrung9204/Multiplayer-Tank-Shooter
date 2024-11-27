const btnSave = document.getElementById("save__mode")
const rotateMode = document.getElementById("rotate-mode")
const freeMode = document.getElementById("free-mode")

btnSave.addEventListener("click", ()=>{
    var mode;
    console.log(rotateMode.checked, rotateMode.value)
    if(rotateMode.checked){
        mode = rotateMode.value;
    }
    console.log(freeMode.checked, freeMode.value)
    if(freeMode.checked){
        mode = freeMode.value;
    }
    if(!mode){
        // Đặt mặc định nếu cả 2 chưa được checked
        mode = "rotateMode";
    }

    fetch("/api/user/saveMovementMode", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            mode: mode,
        }),
    })
    .then(response => response.json())
    .then((data)=>{
        console.log(data);
        createMessageToast(data.status, data.title, data.content);
    })
    .catch((err)=>{
        console.log(err);
    })
})