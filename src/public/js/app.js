const toastContainer = document.getElementById("toastContainer");

function createMessageToast(status, title, message, url = null) {
    return new Promise((resolve) => {
        const toast = document.createElement("div");
        toast.classList.add("toast");

        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-message">
                    <span class="text text-1">${title}</span>
                </div>
            </div>
            <i class="fa-solid fa-xmark close"></i>
            <div class="progress progress--${status}"></div>
        `;

        if (url) {
            const acceptButton = document.createElement("button");
            acceptButton.classList.add("btn", "btn--accept");
            acceptButton.textContent = "Chấp nhận";
            if (url === "addfriend") {
                acceptButton.addEventListener("click", () => {
                    console.log("Friend request accepted");
                    resolve(true);  
                    toast.remove();
                });
            } else {
                acceptButton.addEventListener("click", () => {
                    window.location.href = url;
                });
            }
            toast.querySelector(".toast-message").appendChild(acceptButton);
        } else {
            const messageContent = document.createElement("span");
            messageContent.classList.add("text", "text-2");
            messageContent.textContent = message;
            toast.querySelector(".toast-message").appendChild(messageContent);
        }

        const icon = document.createElement("i");
        if (status === "success") {
            icon.classList.add("fas", "fa-check", status);
        } else if (status === "failed") {
            icon.classList.add("fas", "fa-times", status);
        } else if (status === "warning") {
            icon.classList.add("fas", "fa-exclamation", status);
        } else if (status === "infor") {
            icon.classList.add("fas", "fa-info", status);
        }

        const toastContent = toast.querySelector(".toast-content");
        toastContent.insertBefore(icon, toastContent.firstChild);

        toastContainer.appendChild(toast);

        const closeIcon = toast.querySelector(".close");
        const progress = toast.querySelector(".progress");

        setTimeout(() => {
            toast.classList.add("active");
        }, 10);

        let timer1, timer2;

        progress.classList.add("active");

        timer1 = setTimeout(() => {
            toast.classList.remove("active");
            setTimeout(() => {
                toast.remove();
                resolve(false);  
            }, 500);
        }, 5000);

        timer2 = setTimeout(() => {
            progress.classList.remove("active");
        }, 5300);

        closeIcon.addEventListener("click", () => {
            toast.classList.remove("active");
            clearTimeout(timer1);
            clearTimeout(timer2);
            setTimeout(() => {
                toast.remove();
                resolve(false);  
            }, 500);
        });
    });
}


async function getFetchApi(url) {
    try {
        const response = await fetch(url); // Chờ cho đến khi fetch hoàn thành

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); // Chờ cho đến khi chuyển đổi sang JSON
        // console.log("Test 0911:",data)
        return data; // Trả về dữ liệu
    } catch (e) {
        console.log(e);
        return null;
    }
}

async function getMessage() {
    const message = await getFetchApi('/api/message');
    if (message) {
        createMessageToast(message.status, message.title, message.content);
    }
}

getMessage();