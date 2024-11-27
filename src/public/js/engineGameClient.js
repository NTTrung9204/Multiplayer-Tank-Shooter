class Tank {
    /*
        Lớp Tank để mô tả các đối tượng xe tăng
    */
    constructor(idTank, x, y, idTeam, nameTank, speed, health, rotation, rotationTurret) {
        this.idTank = idTank;
        this.nameTank = nameTank || "anonymous";
        this.health = health || 100;
        this.currentHealth = this.health;
        this.speed = speed || 2;
        this.rotation = 0; // đơn vị = độ
        this.rotationTurret = rotation || 0;
        this.speedRotation = rotationTurret || 2;
        this.trails = [];
        this.maxTrails = 15;
        this.x = x;
        this.y = y;
        this.bullets = [];
        this.idTeam = idTeam;
        this.color = undefined;
        this.action = undefined;
        this.status = 0;
        this.preStatus = undefined;
    }

    setState(state) {
        this.currentHealth = state.health;
        this.x = state.x;
        this.y = state.y;
        this.rotationTurret = state.rotationTurret;
        this.status = state.status;
        this.preStatus = state.preStatus;
        this.bullets = state.bullets.map((bullet) => { 
            return new Bullet(bullet.x, bullet.y, 0, 1, this.color, 0, 0) }
        );
    }
}

class Bullet {
    /*
        Lớp Bullet để mô tả các đối tượng viên đạn
    */
    constructor(x, y, rotation, collision, color, speed, damage) {
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.collision = collision; // Số lần được phép va chạm
        this.color = color;
        this.speed = speed || 0.4;
        this.damage = damage || 10;
    }
}

class Utilities {
    /*
        Lớp Utilities chứa các hàm tiện ích và các hàm vẽ đối tượng trên canvas

        Các hàm chính:
            - clearRect(): Xóa vùng trên canvas
            - calculusAngle(): Tính góc quay giữa 2 đối tượng
            - drawRoundedRect(): Vẽ hình chữ nhật với góc bo tròn
            - hexToRgb(): Chuyển mã màu HEX sang RGB
            - rgbToHex(): Chuyển mã màu RGB sang HEX
            - interpolateColor(): Chuyển đổi mức độ thành màu sắc
            - getColorAtLevel(): Tính màu theo mức
            - drawBullets(): Vẽ viên đạn
            - drawTankTurret(): Vẽ nòng súng
            - drawTank(): Vẽ xe tăng
            - drawTrail(): Vẽ vệt di chuyển
            - getRandom(): Lấy số ngẫu nhiên
            - getIntRandom(): Lấy số nguyên ngẫu nhiên

     */
    clearRect(ctx, x, y, width, height) {
        /*
            Hàm xóa vùng trên canvas (Cụ thể hơn là xóa màn hình trò chơi)
            - ctx: context của canvas
            - x, y: tọa độ x, y của vùng cần xóa
            - width, height: chiều rộng và chiều cao của vùng cần xóa
        */
        ctx.clearRect(x, y, width, height);
    }

    calculusAngle(targetObj, otherObj) {
        /*
            Hàm tính góc cần quay để đối tượng A (targetObj) quay về đối tượng B (otherObj)
            - targetObj: đối tượng cần quay
            - otherObj: đối tượng cần đến

            Hàm này dùng công thức lượng giác (arctan) để tính góc quay giữa 2 đối tượng
        */
        var angle = (Math.atan((otherObj.y - targetObj.y) / (otherObj.x - targetObj.x)) * 180) / Math.PI - 90;

        // Vì hàm arctan chỉ tính góc từ -90 đến 90 nên cần kiểm tra thêm để tính góc từ -180 đến 180 (0 đến 360)
        if (otherObj.y - targetObj.y < 0 && otherObj.x - targetObj.x > 0) {
            angle += 180;
        }
        if (otherObj.y - targetObj.y > 0 && otherObj.x - targetObj.x > 0) {
            angle += 180;
        }

        // Trả về góc quay
        return angle;
    }

    drawRoundedRect(ctx, x, y, width, height, radius) {
        /*
            Hàm vẽ hình chữ nhật với góc bo tròn
            - ctx: context của canvas
            - x, y: tọa độ x, y của hình chữ nhật
            - width, height: chiều rộng và chiều cao của hình chữ nhật
            - radius: bán kính của góc bo tròn

            Cách hoạt động:
            - Vẽ 4 cạnh của hình chữ nhật
            - Vẽ 4 góc bo tròn
        */

        // Bắt đầu vẽ
        ctx.beginPath();
        ctx.moveTo(x + radius, y); // Điểm bắt đầu
        ctx.lineTo(x + width - radius, y); // Vẽ cạnh trên
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius); // Vẽ góc trên bên phải
        ctx.lineTo(x + width, y + height - radius); // Vẽ cạnh phải
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height); // Vẽ góc dưới bên phải
        ctx.lineTo(x + radius, y + height); // Vẽ cạnh dưới
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius); // Vẽ góc dưới bên trái
        ctx.lineTo(x, y + radius); // Vẽ cạnh trái
        ctx.quadraticCurveTo(x, y, x + radius, y); // Vẽ góc trên bên trái
        ctx.closePath(); // Kết thúc vẽ
        ctx.fill(); // Tô màu
    }

    hexToRgb(hex) {
        /* 
            Hàm chuyển đổi mã màu HEX sang RGB
            - hex: mã màu HEX cần chuyển đổi

            Cách hoạt động:
            - Chuyển mã màu HEX sang số nguyên ở hệ cơ số 16
            - Tách thành 3 mảng màu RGB
            - Trả về mảng màu RGB
        */

        let bigint = parseInt(hex.slice(1), 16);
        let r = (bigint >> 16) & 255; // dịch bit sang phải 16 bit và lấy 8 bit cuối
        let g = (bigint >> 8) & 255; // dịch bit sang phải 8 bit và lấy 8 bit cuối
        let b = bigint & 255; // lấy 8 bit cuối

        // Trả về mảng màu RGB
        return [r, g, b];
    }

    rgbToHex(rgb) {
        /* 
            Hàm chuyển đổi mã màu RGB sang HEX
            - rgb: mảng màu RGB cần chuyển đổi

            Cách hoạt động:
            - Chuyển từng phần tử mảng RGB sang hệ cơ số 16
            - Nếu độ dài của chuỗi HEX là 1 thì thêm số 0 vào trước để đủ 2 ký tự
            - Kết hợp chuỗi HEX và trả về
        */
        return (
            "#" +
            rgb
                .map((x) => {
                    const hex = x.toString(16); // Chuyển sang hệ cơ số 16
                    return hex.length === 1 ? "0" + hex : hex; // Nếu độ dài là 1 thì thêm số 0 vào trước
                })
                .join("")
        );
    }

    interpolateColor(color1, color2, factor) {
        /*
            Hàm chuyển đổi mức độ thành màu sắc, sự pha trộn giữa 2 màu
            - color1: màu gốc
            - color2: màu đích
            - factor: mức độ, từ 0 đến 1, gần 0 thì màu gần color1, gần 1 thì màu gần color2

            Cách hoạt động:
            - Sao chép mảng màu gốc
            - Tính toán màu mới dựa vào mức độ
            - Trả về mảng màu mới

            Dùng trong hàm getColorAtLevel() để chuyển đổi mức độ thành màu sắc
        */
        let result = color1.slice(); // copy mảng màu gốc, color1, color2 ở dạng mảng [r, g, b]
        for (let i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (color2[i] - color1[i])); // Tính toán màu mới
        }
        return result;
    }

    getColorAtLevel(baseHexColor, currentHealth, maxHealth) {
        /*
            Hàm chính để tính màu theo mức
            - baseHexColor: màu gốc (HEX)
            - currentHealth: mức máu hiện tại
            - maxHealth: mức máu tối đa

            Cách hoạt động:
            - Chuyển màu gốc từ HEX sang RGB
            - Tính mức độ từ 0 đến 1
            - Nếu mức độ từ 0 đến 1: nội suy giữa xám và màu gốc
            - Nếu mức độ từ 1 đến 2: nội suy giữa màu gốc và đen
            - Trả về màu HEX mới

            Áp dụng: Thể hiện mức máu của xe tăng thông qua màu sắc
            - Nếu xe tăng còn nhiều máu thì màu sẽ gần với màu xanh
            - Nếu xe tăng còn ít máu thì màu sẽ gần với màu đỏ
        */

        const grayColor = [150, 150, 150]; // Màu xám
        const blackColor = [0, 0, 0]; // Màu đen
        const baseColor = this.hexToRgb(baseHexColor); // Màu gốc (từ HEX sang RGB)
        const level = currentHealth / maxHealth; // Tính mức độ từ 0 đến 1

        let interpolatedColor;

        if (level <= 1) {
            // Nếu level từ 0 đến 1: nội suy giữa xám và màu gốc
            interpolatedColor = this.interpolateColor(grayColor, baseColor, level);
        } else {
            // Nếu level từ 1 đến 2: nội suy giữa màu gốc và đen
            interpolatedColor = this.interpolateColor(baseColor, blackColor, level - 1);
        }

        return this.rgbToHex(interpolatedColor);
    }

    drawBullets(ctx, tank) {
        /*
            Hàm vẽ lại tất cả các viên đạn hiện có của xe tăng
            - ctx: context của canvas
            - tank: đối tượng xe tăng đang cần vẽ đạn
        */

        for (let i = 0; i < tank.bullets.length; i++) {
            // Vẽ trên canvas
            ctx.beginPath();
            ctx.arc(tank.bullets[i].x, tank.bullets[i].y, 5, 0, 2 * Math.PI); // Vẽ hình tròn, bán kính 5, tâm ở tọa độ x, y, bắt đầu từ 0 đến 2*PI
            ctx.fillStyle = tank.color;
            ctx.fill();

            if (tank.bullets[i].event){
                console.log("event", tank.bullets[i].event)
                this.createBlast(tank.bullets[i].x, tank.bullets[i].y, ctx);
            }
        }
    }

    drawTankTurret(ctx, tank) {
        /*
            Hàm vẽ nòng súng của xe tăng
            - ctx: context của canvas
            - tank: đối tượng xe tăng đang cần vẽ nòng súng

            Hàm này để vẽ nòng súng của xe tăng, dựa vào tọa độ và góc quay của xe tăng
            Đồng thời vẽ hình ngũ giác trên thân xe tăng
        */

        const { x, y, rotationTurret } = tank;
        ctx.save();
        ctx.translate(x + 25, y + 25);
        ctx.rotate((rotationTurret * Math.PI) / 180);
        ctx.fillStyle = tank.color;
        // ctx.fillStyle = this.getColorAtLevel(tank.color, tank.currentHealth + 30, tank.health);
        ctx.fillRect(-7, -45, 14, 5);
        // ctx.fillStyle = this.getColorAtLevel(tank.color, tank.currentHealth + 15, tank.health);
        ctx.fillRect(-4, -40, 8, 28);
        let r = 12 / Math.sin((54 * Math.PI) / 180);
        ctx.beginPath();
        let theta = (2 * Math.PI) / 5;
        let theta0 = (54 * Math.PI) / 180;
        ctx.moveTo(r * Math.cos(theta0), -r * Math.sin(theta0));
        for (var i = 1; i <= 4; i++) {
            ctx.lineTo(r * Math.cos(theta0 + i * theta), -r * Math.sin(theta0 + i * theta));
        }
        ctx.closePath();
        // ctx.fillStyle = this.getColorAtLevel(tank.color, tank.currentHealth - 30, tank.health);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.restore();
    }

    drawTank(ctx, tank) {
        /*
            Hàm vẽ xe tăng

            - ctx: context của canvas
            - tank: đối tượng xe tăng cần vẽ

            Hàm này để vẽ xe tăng, dựa vào tọa độ, góc quay và màu sắc của xe tăng
            Để vẽ xe tăng thì ta vẽ thân xe tăng sau đó đến 2 bánh xe
        */

        const { x, y, rotation } = tank;
        ctx.save();
        // Cộng thêm 25 để xoay xe tăng ở giữa, đồng nhất tọa độ
        ctx.translate(x + 25, y + 25);
        ctx.rotate((rotation * Math.PI) / 180);
        // Trừ 25 để trở về vị trí ban đầu
        ctx.translate(-25, -25);
        ctx.fillStyle = tank.color;
        // ctx.fillStyle = this.getColorAtLevel(tank.color, tank.currentHealth - 15, tank.health);
        this.drawRoundedRect(ctx, 10, 10, 30, 30, 0);
        // ctx.fillStyle = this.getColorAtLevel(tank.color, tank.currentHealth + 15, tank.health);
        this.drawRoundedRect(ctx, 0, 0, 10, 50, 5);
        this.drawRoundedRect(ctx, 40, 0, 10, 50, 5);

        ctx.restore();

        this.drawHealthBar(ctx, tank);
        this.drawPlayerName(ctx, tank.nameTank, x, y);
    }

    drawProtectedTank(ctx, tank) {
        const { x, y } = tank;
        ctx.save();
        ctx.translate(x, y);
        if (tank.status === 1) {
            ctx.fillStyle = "rgba(255, 255, 0, " + (0.1 + 0.6 * Math.abs(Math.sin(Date.now() / 300))) + ")";
            this.drawRoundedRect(ctx, -15, -15, 80, 80, 40);
        }
        ctx.restore();
    }

    explode(x, y, ctx, color) {
        const particles = [];

        for (let i = 0; i <= 150; i++) {
            let dx = (Math.random() - 0.5) * (Math.random() * 3);
            let dy = (Math.random() - 0.5) * (Math.random() * 3);
            let radius = Math.random() * 4;
            let particle = new Particle(x, y, radius, dx, dy, ctx, color);

            particles.push(particle);
        }

        /* Clears the given pixels in the rectangle */
        function animateParticles() {
            // this.clearRect(ctx, 0, 0, canvas.width, canvas.height);
            particles.forEach((particle, i) => {
                if (particle.alpha <= 0) {
                    particles.splice(i, 1);
                } else {
                    particle.update();
                }
            });
            if (particles.length > 0) {
                requestAnimationFrame(animateParticles);
            }
        }

        animateParticles();
    }

    createBlast(x, y, ctx) {
        let scale = 0.01;
        let opacity = 1.0;
        let isAnimating = true;
    
        function animateBlast() {
            if (!isAnimating) return;
    
            ctx.blastAlpha = opacity;
    
            const width = explosionImg.width * scale;
            const height = explosionImg.height * scale;
    
            ctx.drawImage(explosionImg, x - width / 2, y - height / 2, width, height);
    
            scale += 0.001;
            opacity -= 0.05;
    
            // Khi độ trong suốt đạt 0, kết thúc hoạt hình
            if (opacity <= 0) {
                isAnimating = false;
                ctx.blastAlpha = 1.0; // Đặt lại độ trong suốt cho lần nổ sau
                return;
            }
    
            requestAnimationFrame(animateBlast);
        }
    
        animateBlast();
    }

    drawHealthBar(ctx, tank) {
        const { x, y, health, currentHealth } = tank; // Giả sử đối tượng tank có thuộc tính health
        const maxHealth = health; // Giá trị tối đa của máu
        const barWidth = 70; // Chiều rộng thanh máu
        const barHeight = 10; // Chiều cao thanh máu

        // Tọa độ cho thanh máu, đặt trên thân xe tăng
        const barX = x - 10; // Căn giữa thanh máu
        const barY = y - 15; // Đặt thanh máu trên thân xe tăng

        // Vẽ nền cho thanh máu (màu đen)
        ctx.fillStyle = "black";
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Tính toán chiều dài của phần máu đầy và phần máu bị mất
        const healthWidth = (currentHealth / maxHealth) * barWidth;

        // Vẽ phần máu đầy (màu xanh lá cây)
        ctx.fillStyle = "green";
        ctx.fillRect(barX, barY, healthWidth, barHeight);

        // Vẽ phần máu bị mất (màu đỏ)
        if (health < maxHealth) {
            ctx.fillStyle = "red";
            ctx.fillRect(barX + healthWidth, barY, barWidth - healthWidth, barHeight);
        }
    }

    drawPlayerName(ctx, playerName, x, y) {
        ctx.save();
        ctx.font = "12px Arial"; // Phông chữ
        ctx.textAlign = "center"; // Căn giữa
        ctx.textBaseline = "middle"; // Căn giữa theo chiều dọc

        // Vẽ viền đen
        ctx.fillStyle = "black";
        ctx.fillText(playerName, x + 25, y - 15);
        ctx.fillText(playerName, x + 25 + 1, y - 15); // Đẩy nhẹ qua phải
        ctx.fillText(playerName, x + 25 - 1, y - 15); // Đẩy nhẹ qua trái
        ctx.fillText(playerName, x + 25, y - 15 + 1); // Đẩy nhẹ xuống
        ctx.fillText(playerName, x + 25, y - 15 - 1); // Đẩy nhẹ lên

        // Vẽ chữ trắng
        ctx.fillStyle = "white";
        ctx.fillText(playerName, x + 25, y - 15);

        ctx.restore();
    }

    drawTrail(ctx, tank) {
        /*
            Hàm vẽ vệt di chuyển của xe tăng
            - ctx: context của canvas
            - tank: đối tượng xe tăng cần vẽ vệt di chuyển

        */
        for (let i = 0; i < tank.trails.length; i++) {
            ctx.beginPath();
            // Cộng thêm 25 để vẽ vệt di chuyển ở giữa xe tăng, đồng nhất tọa độ
            ctx.arc(tank.trails[i].x + 25, tank.trails[i].y + 25, 10, 0, 2 * Math.PI);
            ctx.fillStyle = tank.color;
            ctx.fill();
        }
    }

    getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    getIntRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    encodeData(data) {
        const jsonData = JSON.stringify(data);
        const compressedData = pako.deflate(jsonData);
        const base64Compressed = btoa(String.fromCharCode(...compressedData));
    
        return base64Compressed;
    }
    
    decodedData(data) {
        const decodedData = Uint8Array.from(atob(data), c => c.charCodeAt(0));
        const decompressedData = pako.inflate(decodedData, { to: 'string' });
        const originalData = JSON.parse(decompressedData);
    
        return originalData;
    }

    getSizeData(data) {
        const dataString = JSON.stringify(data);
        const dataSize = new TextEncoder().encode(dataString).length;

        return dataSize;
    }
}

class Game {
    /*
        Đây là lớp Game chứa các hàm xử lý game

        Các hàm chính:
            - constructor(): Hàm khởi tạo
            - setMap(): Hàm thiết lập map
            - addTank(): Hàm thêm xe tăng
            - updateState(): Hàm cập nhật trạng thái game, vẽ lại các đối tượng
            - setStateGame(): Hàm thiết lập trạng thái game, nhận trạng thái game từ server
            - drawMap(): Hàm vẽ map

    */
    constructor(canvas) {
        this.tanks = [];
        this.endGame = false;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.utilities = new Utilities();
        this.listColor = ["#ff0000", "#00ff00", "#00ffff"];
        this.teamColor = {};
        this.map = null;
        this.startTime=null;
        this.endTime=null;
    }

    setMap(map) {
        /* 
            Cấu trúc của map:
            - sideDogX: vị trí x của nhà chó
            - sideDogY: vị trí y của nhà chó
            - homeSize: kích thước nhà
            - sideCatX: vị trí x của nhà mèo
            - sideCatY: vị trí y của nhà mèo
            - homeDogColor: màu sắc nhà chó
            - homeCatColor: màu sắc nhà mèo
            - wallSize: kích thước tường
            - obstacles[]: Danh sách vị trí tường
        */
        this.map = map;
    }

    addTank(idTank, x, y, idTeam, nameTank) {
        /*
            Hàm thêm xe tăng
            - idTank: id của xe tăng
            - x, y: tọa độ x, y của xe tăng
            - idTeam: id nhóm của xe tăng

            Sau đó đặt màu cho xe tăng của đội đó bằng cách:
            - Kiểm tra đội đó đã có màu hay chưa?
            - Nếu chưa có thì random một màu và gán màu
            - Nếu có rồi thì sẽ đặt màu cho xe tăng đó theo team 
        */

        this.tanks.push(new Tank(idTank, x, y, idTeam, nameTank));

        if (this.teamColor[idTeam] === undefined) {
            // teamColor là một Object
            const indexColor = this.utilities.getIntRandom(0, this.listColor.length - 1);
            this.teamColor[idTeam] = this.listColor[indexColor];
            this.listColor.splice(indexColor, 1);
        }

        this.tanks[this.tanks.length - 1].color = this.teamColor[idTeam];
    }

    updateState() {
        /*
            Hàm cập nhật trạng thái game
            - Cập nhật vị trí của các viên đạn
            - Cập nhật vị trí của các xe tăng
            - Cập nhật vị trí của các vệt di chuyển
            - Xử lý va chạm trên xe tăng
            - Điều khiển bot
        */
        this.utilities.clearRect(this.ctx, 0, 0, this.canvas.width, this.canvas.height);

        this.drawMap();

        // Vẽ viên đạn
        this.tanks.forEach((tank) => {
            if (tank.preStatus === 2 && tank.status === 3) {
                this.utilities.explode(tank.x + 25, tank.y + 25, this.ctx, tank.color);
            }
            if (tank.status === 3) {
                return;
            }
            this.utilities.drawBullets(this.ctx, tank);
            this.utilities.drawTrail(this.ctx, tank);
            this.utilities.drawTank(this.ctx, tank);
            this.utilities.drawTankTurret(this.ctx, tank);
            this.utilities.drawProtectedTank(this.ctx, tank);
        });
    }

    setStateGame(encodeState) {
        const decodeState = this.utilities.decodedData(encodeState);
        decodeState.forEach((state) => {
            var isExist = false;
            const x = state.x;
            const y = state.y;
            // find tank by closest distance
            let minDistance = 100000;
            let closestIndex = null;
            for (let i = 0; i < this.tanks.length; i++) {
                const distance = Math.sqrt((this.tanks[i].x - x) ** 2 + (this.tanks[i].y - y) ** 2);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = i;
                }
            }
            if (closestIndex !== null) {
                const rotaion = this.utilities.calculusAngle(this.tanks[closestIndex], state);
                this.tanks[closestIndex].setState(state);
                this.tanks[closestIndex].rotation = rotaion;
                isExist = true;
            }


            if (!isExist) {
                this.addTank(state.idTank, state.x, state.y, state.idTeam, state.nameTank);
            }
        });
        // decodedData.forEach((state) => {
        //     var isExist = false;
        //     for(let i = 0; i < this.tanks.length; i++) {
        //         if (this.tanks[i].idTank === state.idTank) {
        //             isExist = true;
        //             this.tanks[i].setState(state);
        //             break;
        //         }
        //     }
        //     if (!isExist) {
        //         this.addTank(state.idTank, state.x, state.y, state.idTeam, state.nameTank);
        //     }
        // });
    }

    drawMap() {
        /*
            Hàm vẽ map
            - Vẽ nhà chó và nhà mèo
            - Vẽ tường
            - Vẽ biên
        */
        if (this.map === null) {
            return;
        }

        const homeDogColor = "#5678F0";
        const homeCatColor = "#EB5757";
        const homeSize = 100;
        const wallSize = 25;

        this.ctx.fillStyle = homeDogColor;
        this.ctx.fillRect(this.map.dogPosition.x, this.map.dogPosition.y, homeSize, homeSize);

        this.ctx.fillStyle = homeCatColor;
        this.ctx.fillRect(this.map.catPosition.x, this.map.catPosition.y, homeSize, homeSize);

        this.ctx.fillStyle = "black";
        this.map.obstacles.forEach((wall) => {
            this.ctx.fillRect(wall.x, wall.y, wallSize, wallSize);
        });

        this.ctx.fillStyle = "black";
        const boundingSize = 2;
        this.ctx.fillRect(0, 0, this.canvas.width, boundingSize);
        this.ctx.fillRect(0, 0, boundingSize, this.canvas.height);
        this.ctx.fillRect(this.canvas.width - boundingSize, 0, boundingSize, this.canvas.height);
        this.ctx.fillRect(0, this.canvas.height - boundingSize, this.canvas.width, boundingSize);
    }

    replayGame(allEncodeState, fps = 150) {
        const allState = this.utilities.decodedData(allEncodeState);
        setInterval(() => {
            if (allState.length === 0) {
                return;
            }
            this.setStateGame(allState.shift());
            // const random = this.utilities.getIntRandom(0, 1);
            // if (random === 1) {
            //     allState.shift();
            // }
            // allState.shift();
            // allState.shift();
            this.updateState();
        }, 1000 / fps);
    }
}

class Particle {
    constructor(x, y, radius, dx, dy, ctx, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.alpha = 1;
        this.ctx = ctx;
        this.color = color;
    }
    draw() {
        this.ctx.save();
        this.ctx.globalAlpha = this.alpha;
        this.ctx.fillStyle = this.color;

        this.ctx.beginPath();

        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

        this.ctx.fill();

        this.ctx.restore();
    }
    update() {
        this.draw();
        this.alpha -= 0.01;
        this.x += this.dx;
        this.y += this.dy;
    }
}

const explosionImg = new Image();
explosionImg.src = "/img/gif/blast.gif";