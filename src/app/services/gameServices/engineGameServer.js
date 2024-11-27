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
        this.tankSize = 50;
        this.deaths = 0;
        this.kills = 0;
        this.status = 0; // 0: reborn, 1: protected, 2: normal, 3: destroyed
        this.preStatus = 0;
    }

    addTrail() {
        /*
            Đây là hàm dùng để vẽ các vệt di chuyển của xe tăng
            Mỗi lần di chuyển, ta sẽ lưu lại tọa độ hiện tại của xe tăng
            Và sau khoảng thời gian nhất định, ta sẽ xóa điểm đầu tiên của mảng, ở đây chọn 100ms
        */

        // Thời gian để xóa vệt, chọn 100ms vì để đảm bảo vệt di chuyển không quá dài hoặc quá ngắn
        const TIME_TO_REMOVE = 100;

        // push(): thêm 1 phần tử vào cuối mảng
        this.trails.push({
            x: this.x,
            y: this.y,
        });

        // shift(): xóa phần tử đầu tiên của mảng
        setTimeout(() => {
            this.trails.shift();
        }, TIME_TO_REMOVE);
    }

    createBullet(typeBullet) {
        /*
            Đây là hàm dùng để tạo ra viên đạn
            Đối số typeBullet sẽ quyết định loại đạn
            - normalBullet: đạn bình thường
            - collisionBullet: đạn có khả năng phản ứng khi va chạm

            Mỗi lần tạo đạn, ta sẽ kiểm tra xem số lượng đạn đã tạo ra có vượt quá 25 viên không
            Nếu vượt quá thì sẽ không tạo thêm viên đạn nào nữa
        */

        const MAX_BULLETS = 25; // Số lượng đạn tối đa, chọn 25 vì để đảm bảo hiệu suất và tránh trường hợp quá nhiều đạn
        const MAX_COLLISION_OF_NORMAL_BULLET = 0; // Số lần va chạm cho phép của đạn bình thường (0: không va chạm)
        const MAX_COLLISION_OF_COLBULLET = 3; // Số lần va chạm cho phép của đạn phản ứng khi va chạm (3: va chạm 3 lần), chọn 3 để đảm bảo hiệu suất và tránh trường hợp quá nhiều va chạm
        const NORMAL_DAMAGE = 10; // Sát thương của đạn bình thường
        const COL_DAMAGE = 15; // Sát thương của đạn phản ứng khi va chạm, mong muốn mạnh hơn đạn bình thường

        // Số lần va chạm cho phép của đạn
        const collision = typeBullet === "normalBullet" ? MAX_COLLISION_OF_NORMAL_BULLET : MAX_COLLISION_OF_COLBULLET;

        // Màu sắc, tốc độ và sát thương của đạn
        const damage = typeBullet === "normalBullet" ? NORMAL_DAMAGE : COL_DAMAGE;

        // Kiểm tra số lượng đạn đã tạo ra, nếu nhỏ hơn 25 thì mới tạo thêm viên đạn
        if (this.bullets.length < MAX_BULLETS) {
            // Tạo mới một đối tượng Bullet dựa vào các thuốc tính đã chọn
            // Cộng thêm 25 để đồng nhất tọa độ, giúp viên đạn xuất phát từ giữa xe tăng
            this.bullets.push(new Bullet(this.x + 25, this.y + 25, this.rotationTurret, collision, damage));
        }
    }

    handleBulletCollision(index, side) {
        /*
            Đây là hàm dùng để xử lý va chạm của viên đạn
            - index: vị trí của viên đạn trong mảng
            - side: true (va chạm với cạnh trái/phải), false (va chạm với cạnh trên/dưới)

            Kiểm tra viên đạn ở vị trí index có va chạm với cạnh không?
            Hàm handleCollision() dùng để kiểm tra va chạm và xử lý, đồng thời giảm số lần va chạm của viên đạn xuống
            Nếu số lần va chạm bằng 0 thì xóa viên đạn đạn đó đi
        */

        // Kiểm tra va chạm của viên đạn
        if (this.bullets[index].handleCollision(side)) {
            // Dùng hàm filter() để loại bỏ viên đạn ở vị trí index
            this.bullets = this.bullets.filter((bullet, i) => i != index);
        }
    }

    rotateLeft() {
        // Giảm góc quay của xe tăng
        this.rotation -= this.speedRotation;
    }

    rotateRight() {
        // Tăng góc quay của xe tăng
        this.rotation += this.speedRotation;
    }

    moveForward() {
        /*
            Hàm di chuyển xe tăng về phía trước
            Dựa vào góc quay và tọa độ lượng giác để tính toán vị trí mới
        */
        this.x += this.speed * Math.sin((this.rotation * Math.PI) / 180);
        this.y -= this.speed * Math.cos((this.rotation * Math.PI) / 180);

        // Thêm vệt di chuyển
        // this.addTrail();
    }

    moveBackward() {
        /*
            Hàm di chuyển xe tăng về phía sau
            Dựa vào góc quay và tọa độ lượng giác để tính toán vị trí mới
        */
        this.x -= this.speed * Math.sin((this.rotation * Math.PI) / 180);
        this.y += this.speed * Math.cos((this.rotation * Math.PI) / 180);

        // Thêm vệt di chuyển
        // this.addTrail();
    }

    rotateTurret(angle) {
        // Xoay nòng súng của xe tăng
        this.rotationTurret = angle;
    }

    setOutOfCanvas() {
        /*
            Hàm kiểm tra xe tăng có ra ngoài biên của canvas không
            Nếu ra ngoài thì đặt lại tọa độ cho xe tăng ở biên
        */

        if (this.x < 0) this.x = 0;
        if (this.x > 1000 - this.tankSize) this.x = 1000 - this.tankSize;
        if (this.y < 0) this.y = 0;
        if (this.y > 500 - this.tankSize) this.y = 500 - this.tankSize;
    }

    getBounds() {
        /*
            Hàm lấy ra các giới hạn của xe tăng
            - left: biên trái
            - right: biên phải
            - top: biên trên
            - bottom: biên dưới
        */

        // 25: bán kính của xe tăng (bao gồm cả thân xe và bánh xe)
        return {
            left: this.x,
            right: this.x + 50,
            top: this.y,
            bottom: this.y + 50,
        };
    }

    getState(){
        return {
            health: this.currentHealth,
            x: Math.floor(this.x),
            y: Math.floor(this.y),
            rotationTurret: Math.floor(this.rotationTurret),
            status: this.status,
            bullets: this.bullets.map(bullet => bullet.getState()),
            preStatus: this.preStatus
        }
    }
}

class Bullet {
    /*
        Lớp Bullet để mô tả các đối tượng viên đạn
    */
    constructor(x, y, rotation, collision, damage) {
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.collision = collision; // Số lần được phép va chạm
        this.damage = damage || 10;
    }

    handleCollision(condition) {
        /*
            Hàm xử lý va chạm của viên đạn
            - condition: true (va chạm với cạnh trái/phải), false (va chạm với cạnh trên/dưới)

            Hàm trả về true nếu viên đạn không được phép va chạm nữa (số va chạm bằng 0), ngược lại trả về false

            Nếu viên đạn va chạm với cạnh thì giảm số va chạm của viên đạn đi 1
            Nếu số va chạm bằng 0 (Tức viên đạn này không được phép va chạm nữa) thì trả về true (để xóa viên đạn) cho hàm handleBulletCollision()

            Nếu viên đạn va chạm với cạnh thì thay đổi hướng của viên đạn bằng cách đảo ngược góc quay (đảo vector)
        */

        if (this.collision == 0) {
            // Nếu số va chạm bằng 0 thì trả về true
            return true;
        } else {
            // Nếu số va chạm khác 0 thì giảm số va chạm đi 1
            this.collision -= 1;

            // Thay đổi hướng của viên đạn
            if (condition) {
                this.rotation = -this.rotation;
            } else {
                this.rotation = 180 - this.rotation;
            }
        }
        return false;
    }

    updatePosition() {
        /*
            Hàm cập nhật vị trí mới của viên đạn và trả về tọa độ mới
            Dùng trong việc kiểm tra va chạm với xe tăng
        */
       const Speed = 5; // Tốc độ của viên đạn
        this.x += Speed * Math.sin((this.rotation * Math.PI) / 180);
        this.y -= Speed * Math.cos((this.rotation * Math.PI) / 180);

        // Trả về tọa độ mới của viên đạn
        return { newBulletX: this.x, newBulletY: this.y };
    }

    getState(){
        return {
            x: Math.floor(this.x),
            y: Math.floor(this.y),
        }
    }
}

class Utilities {
    /*
        Lớp Utilities chứa các hàm tiện ích và các hàm vẽ đối tượng trên canvas

        Các hàm chính:
            - calculusAngle(): Tính góc quay giữa 2 đối tượng
            - hexToRgb(): Chuyển mã màu HEX sang RGB
            - rgbToHex(): Chuyển mã màu RGB sang HEX
            - interpolateColor(): Chuyển đổi mức độ thành màu sắc
            - getColorAtLevel(): Tính màu theo mức
            - getRandom(): Lấy số ngẫu nhiên
            - getIntRandom(): Lấy số nguyên ngẫu nhiên

     */

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

    getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    getIntRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    isColliding(rect1, rect2) {
        return !(rect1.right <= rect2.left || rect1.left >= rect2.right || rect1.bottom <= rect2.top || rect1.top >= rect2.bottom);
    }

    // Hàm kiểm tra va chạm giữa hai hình chữ nhật và xác định cạnh va chạm
    getCollisionSides(tankBounds, wallRect) {
        // Kiểm tra va chạm
        if (!this.isColliding(tankBounds, wallRect)) {
            return {
                collision: null,
                overlap: null,
            }; // Không có va chạm
        }

        // Tính toán sự chồng lấp
        const overlapX = Math.min(tankBounds.right, wallRect.right) - Math.max(tankBounds.left, wallRect.left);
        const overlapY = Math.min(tankBounds.bottom, wallRect.bottom) - Math.max(tankBounds.top, wallRect.top);

        // Tính trung tâm của xe tăng và tường để xác định hướng va chạm
        const tankCenterX = (tankBounds.left + tankBounds.right) / 2;
        const tankCenterY = (tankBounds.top + tankBounds.bottom) / 2;
        const wallCenterX = (wallRect.left + wallRect.right) / 2;
        const wallCenterY = (wallRect.top + wallRect.bottom) / 2;

        let collision = {};
        let overlap;

        if (overlapX < overlapY) {
            overlap = overlapY;
            // Va chạm theo hướng ngang
            if (tankCenterX > wallCenterX) {
                // Cạnh phải của xe tăng va chạm với cạnh trái của tường
                collision.tankSide = "left";
                collision.wallSide = "right";
            } else {
                // Cạnh trái của xe tăng va chạm với cạnh phải của tường
                collision.tankSide = "right";
                collision.wallSide = "left";
            }
        } else {
            overlap = overlapX;
            // Va chạm theo hướng dọc
            if (tankCenterY > wallCenterY) {
                // Cạnh dưới của xe tăng va chạm với cạnh trên của tường
                collision.tankSide = "top";
                collision.wallSide = "bottom";
            } else {
                // Cạnh trên của xe tăng va chạm với cạnh dưới của tường
                collision.tankSide = "bottom";
                collision.wallSide = "top";
            }
        }

        return { collision, overlap: overlapX * overlapY }; // Trả về đối tượng chứa thông tin về cạnh va chạm
    }
}

class Game {
    /*
        Đây là lớp Game chứa các hàm xử lý game

        Các hàm chính:
            - constructor(): Hàm khởi tạo
            - setMap(): Hàm thiết lập map
            - buildMap(): Hàm để tính toán vị trí của các tường trùng với tường khác
                + Giúp cho việc xử lý va chạm trên tường
            - addTank(): Hàm thêm xe tăng
            - controlTank(): Hàm điều khiển xe tăng
            - getTank(): Hàm lấy xe tăng
            - controlBot(): Hàm điều khiển bot
            - detectAndHandleBulletCollision(): Hàm xử lý va chạm trên xe tăng
            - updateState(): Hàm cập nhật trạng thái game
            - getState(): Hàm lấy trạng thái game
            - endGame(): Hàm kết thúc game

    */
    constructor(map) {
        this.tanks = [];
        this.endGame = false;
        this.utilities = new Utilities();
        this.listColor = ["#ff0000", "#00ff00", "#00ffff"];
        this.teamColor = {};
        this.setMap(map);
        this.stateGame = [];
        this.eventState = false;
        this.skipFrame = 0;
        this.dogScore = 0;
        this.catScore = 0;
    }

    setMap(map) {
        /* 
            Cấu trúc của map:
            - sideDogX: vị trí x của nhà chó
            - sideDogY: vị trí y của nhà chó
            - homeSize: kích thước nhà
            - sideCatX: vị trí x của nhà mèo
            - sideCatY: vị trí y của nhà mèo
            - wallSize: kích thước tường
            - obstacles[]: Danh sách vị trí tường
        */
        this.map = map;
        this.buildMap();
    }

    buildMap() {
        /*
            Hàm này duyệt qua danh sách các tường và xác định xem tường nào trùng với tường nào
            - Để xác định xem tường nào trùng với tường nào, ta sẽ xác định các tường nào kề nhau
            - ví dụ tường A có 3 cạnh bị kề với tường khác là {left, top, right}
            - thì khi xác định va chạm, ta sẽ bỏ qua 3 cạnh này

            Độ phức tạp: O(n^2)
            Như map hành lang có đến 210 tường, nếu dùng cách này thì phải duyệt qua khoảng 210^2 = 44100 lần
            Muốn cải thiện hiệu suất thì phải build cấu trúc dữ liệu quadtree
            Khi đó độ phức tạp sẽ giảm xuống O(nlogn)

            Tuy nhiên việc build map chỉ xảy ra một lần, nên không cần quá quan tâm đến việc cải thiện hiệu suất
        */

        this.map.adjacentWall = {};

        for (var i = 0; i < this.map.obstacles.length; i++) {
            this.map.adjacentWall[i] = [];
        }

        for (var i = 0; i < this.map.obstacles.length - 1; i++) {
            const wallRectI = {
                left: this.map.obstacles[i].x,
                right: this.map.obstacles[i].x + 25,
                top: this.map.obstacles[i].y,
                bottom: this.map.obstacles[i].y + 25,
            };
            for (var j = i + 1; j < this.map.obstacles.length; j++) {
                const wallRectJ = {
                    left: this.map.obstacles[j].x,
                    right: this.map.obstacles[j].x + 25,
                    top: this.map.obstacles[j].y,
                    bottom: this.map.obstacles[j].y + 25,
                };

                if (wallRectI.left === wallRectJ.right && wallRectI.top === wallRectJ.top) {
                    this.map.adjacentWall[i].push("left");
                }

                if (wallRectI.right === wallRectJ.left && wallRectI.top === wallRectJ.top) {
                    this.map.adjacentWall[i].push("right");
                }

                if (wallRectI.top === wallRectJ.bottom && wallRectI.left === wallRectJ.left) {
                    this.map.adjacentWall[i].push("top");
                }

                if (wallRectI.bottom === wallRectJ.top && wallRectI.left === wallRectJ.left) {
                    this.map.adjacentWall[i].push("bottom");
                }
            }
        }
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

    controlTank(idTank, action, data) {
        /*
            Hàm dùng để điều khiển xe tăng có id là idTank với hành động action
        */
        for (var i = 0; i < this.tanks.length; i++) {
            if (this.tanks[i].idTank === idTank) {
                if (action == "moveHead") {
                    this.tanks[i].rotation = 0;
                    action = "moveForward";
                }
                if (action == "moveBack") {
                    this.tanks[i].rotation = 180;
                    action = "moveForward";
                }
                if (action == "moveLeft") {
                    this.tanks[i].rotation = 270;
                    action = "moveForward";
                }
                if (action == "moveRight") {
                    this.tanks[i].rotation = 90;
                    action = "moveForward";
                }
                if (action == "rotateLeft") {
                    this.tanks[i].rotateLeft();
                }
                if (action == "rotateRight") {
                    this.tanks[i].rotateRight();
                }
                if (action == "moveForward") {
                    const preY = this.tanks[i].y;
                    this.tanks[i].moveForward();
                    this.tanks[i].setOutOfCanvas(this.canvas);
                    const lastY = this.tanks[i].y;

                    const bounds = this.tanks[i].getBounds();
                    var mainCollision = null;
                    var maxOverlap = 0;
                    var boundsWallMain;
                    for (var j = 0; j < this.map.obstacles.length; j++) {
                        const boundsWall = {
                            left: this.map.obstacles[j].x,
                            right: this.map.obstacles[j].x + 25,
                            top: this.map.obstacles[j].y,
                            bottom: this.map.obstacles[j].y + 25,
                        };
                        const { collision, overlap } = this.utilities.getCollisionSides(bounds, boundsWall);
                        // console.log(collision, overlap);
                        if (collision) {
                            if (overlap > maxOverlap) {
                                mainCollision = collision;
                                maxOverlap = overlap;
                                boundsWallMain = boundsWall;
                            }
                        }
                    }
                    if (mainCollision) {
                        if (mainCollision.wallSide == "left") {
                            this.tanks[i].x = boundsWallMain.left - 50;
                        }
                        if (mainCollision.wallSide == "right") {
                            this.tanks[i].x = boundsWallMain.right;
                        }
                        if (mainCollision.wallSide == "top" && lastY > preY) {
                            this.tanks[i].y = boundsWallMain.top - 50;
                        }
                        if (mainCollision.wallSide == "bottom") {
                            this.tanks[i].y = boundsWallMain.bottom;
                        }
                    }
                }
                if (action == "moveBackward") {
                    const preY = this.tanks[i].y;
                    this.tanks[i].moveBackward();
                    this.tanks[i].setOutOfCanvas(this.canvas);
                    const lastY = this.tanks[i].y;

                    const bounds = this.tanks[i].getBounds();
                    var mainCollision = null;
                    var maxOverlap = 0;
                    var boundsWallMain;
                    for (var j = 0; j < this.map.obstacles.length; j++) {
                        const boundsWall = {
                            left: this.map.obstacles[j].x,
                            right: this.map.obstacles[j].x + 25,
                            top: this.map.obstacles[j].y,
                            bottom: this.map.obstacles[j].y + 25,
                        };
                        const { collision, overlap } = this.utilities.getCollisionSides(bounds, boundsWall);
                        if (collision) {
                            if (overlap > maxOverlap) {
                                mainCollision = collision;
                                maxOverlap = overlap;
                                boundsWallMain = boundsWall;
                            }
                        }
                    }
                    if (mainCollision) {
                        if (mainCollision.wallSide == "left") {
                            this.tanks[i].x = boundsWallMain.left - 50;
                        }
                        if (mainCollision.wallSide == "right") {
                            this.tanks[i].x = boundsWallMain.right;
                        }
                        if (mainCollision.wallSide == "top") {
                            this.tanks[i].y = boundsWallMain.top - 50;
                        }
                        if (mainCollision.wallSide == "bottom" && lastY < preY) {
                            this.tanks[i].y = boundsWallMain.bottom;
                        }
                    }
                }

                if (action == "fire") {
                    this.tanks[i].createBullet("purpleBullet");
                }
                if (action == "changeRotationTurret") {
                    var angle = this.utilities.calculusAngle({ x: this.tanks[i].x + 25, y: this.tanks[i].y + 25 }, data);
                    this.tanks[i].rotateTurret(angle);
                }
                return;
            }
        }
    }

    getTank(idTank) {
        /* 
            Hàm lấy xe tăng theo idTank
        */
        for (var i = 0; i < this.tanks.length; i++) {
            if (this.tanks[i].idTank === idTank) {
                return this.tanks[i];
            }
        }
    }

    controlBot() {
        /*
            Hàm điều khiển bot, cách hoạt động:
            - Duyệt qua tất cả các xe tăng
            - Nếu xe tăng đó có idTeam là BOT thì sẽ thực hiện hành động ngẫu nhiên
            - Hành động ngẫu nhiên sẽ được chọn từ 0 đến 4 tương ứng với các hành động:
                + 0: di chuyển về phía trước
                + 1: di chuyển về phía sau
                + 2: quay trái
                + 3: quay phải
                + 4: bắn đạn
            - Nếu hành động là bắn đạn thì sẽ chọn loại đạn ngẫu nhiên
            - Đầu tiên sẽ chọn một xe tăng ngẫu nhiên trong đội đối phương
            - Tính góc quay giữa 2 xe tăng
            - Tính tỉ lệ ngẫu nhiên để chọn loại đạn
            - Tỉ lệ các loại đạn:
                + 5%: bắn đàn chùm (5 viên)
                + 10%: bắn đạn nẩy
                + 5%: bắn đạn thường (ngẫu nhiên tăng hoặc giảm 10 độ với xác suất 10%)
        */
        for (var i = 0; i < this.tanks.length; i++) {
            if (this.tanks[i].idTeam === "BOT") {
                if (this.tanks[i].action === undefined || this.utilities.getIntRandom(0, 200) < 10) {
                    this.tanks[i].action = this.utilities.getIntRandom(0, 4);
                }
                switch (this.tanks[i].action) {
                    case 0:
                        this.controlTank(this.tanks[i].idTank, "moveForward");
                        break;
                    case 1:
                        this.controlTank(this.tanks[i].idTank, "moveBackward");
                        break;
                    case 2:
                        this.controlTank(this.tanks[i].idTank, "rotateLeft");
                        break;
                    case 3:
                        this.controlTank(this.tanks[i].idTank, "rotateRight");
                        break;
                    case 4:
                        const listTankInDifferentTeam = this.tanks.filter((tank) => tank.idTeam !== this.tanks[i].idTeam);
                        const targetTank = listTankInDifferentTeam[this.utilities.getIntRandom(0, listTankInDifferentTeam.length - 1)];
                        var angle = this.utilities.calculusAngle(this.tanks[i], targetTank);
                        const activeBulletRate = this.utilities.getIntRandom(0, 100);
                        if (activeBulletRate < 5) {
                            for (let j = -3; j < 3; j++) {
                                this.tanks[i].rotationTurret = angle + 5 * j;

                                this.tanks[i].createBullet("normalBullet");
                            }
                        } else if (activeBulletRate < 15) {
                            this.tanks[i].rotationTurret = angle;
                            this.tanks[i].createBullet("collisionBullet");
                        } else if (activeBulletRate < 20) {
                            if (this.utilities.getIntRandom(0, 10) === 0) {
                                angle += 10;
                            }
                            if (this.utilities.getIntRandom(0, 10) === 1) {
                                angle -= 10;
                            }
                            this.tanks[i].rotationTurret = angle;
                            this.tanks[i].createBullet("normalBullet");
                        }
                        this.tanks[i].action = undefined;

                        break;
                }
            }
        }
    }

    detectAndHandleBulletCollision() {
        /*
            Hàm xử lý va chạm trên xe tăng
            - Duyệt qua tất cả các xe tăng
            - Duyệt qua tất cả các viên đạn của xe tăng
            - Duyệt qua vị trí của các tường
            - Kiểm tra xem viên đạn có va chạm với tường không
            - Kiểm tra xem viên đạn có va chạm với xe tăng không
            - Nếu có va chạm thì giảm máu của xe tăng và xử lý va chạm
            - Nếu máu của xe tăng bằng 0 thì xóa xe tăng
        */
        var listBoundariesOfTank = [];
        // Duyệt qua các xe tăng và tạo ra mảng chứa các giới hạn của xe tăng và id của nó
        // Mục đích là để tối ưu, tránh phải duyệt qua các xe tăng một lần nữa
        // for (var i = 0; i < this.tanks.length; i++) {
        //     var tank = this.tanks[i];
        //     if (tank.status === 0) {
        //         tank.status = 1;
        //         setTimeout(() => {
        //             tank.status = 2;
        //         }, 10000);
        //     }
        //     const size = 50;
        //     const xMin = tank.x;
        //     const xMax = tank.x + size;
        //     const yMin = tank.y;
        //     const yMax = tank.y + size;
        //     // Góc trên trái và góc dưới phải của xe tăng
        //     listBoundariesOfTank.push({ xMin, xMax, yMin, yMax, indexTank: i });
        // }

        this.tanks.forEach((tank, index) => {
            if (tank.status === 0) {
                tank.status = 1;
                setTimeout(() => {
                    tank.status = 2;
                }, 5000);
            }
            
            tank.preStatus = tank.status;
            const size = 50;
            const xMin = tank.x;
            const xMax = tank.x + size;
            const yMin = tank.y;
            const yMax = tank.y + size;
            listBoundariesOfTank.push({ xMin, xMax, yMin, yMax, indexTank: index });
        });
        // Duyệt qua các xe tăng
        for (var i = 0; i < this.tanks.length; i++) {
            // Duyệt qua các viên đạn của xe tăng
            for (var j = 0; j < this.tanks[i].bullets.length; j++) {
                // this.tanks[i].bullets[j].event = "blast";
                // write code to delete this.tanks[i].bullets[j].event;
                if (this.tanks[i].bullets[j].hasOwnProperty("event")) {
                    delete this.tanks[i].bullets[j].event;
                }
                // Lấy tọa độ mới của viên đạn
                const { newBulletX, newBulletY } = this.tanks[i].bullets[j].updatePosition();
                // Kiểm tra đạn đụng biên
                if (newBulletX < 0 || newBulletX > 1000) {
                    this.tanks[i].handleBulletCollision(j, true);
                    continue;
                }

                if (newBulletY < 0 || newBulletY > 500) {
                    this.tanks[i].handleBulletCollision(j, false);
                    continue;
                }

                // Duyệt qua vị trí của các tường (ô vuông)
                for (var k = 0; k < this.map.obstacles.length; k++) {
                    const wallRect = {
                        left: this.map.obstacles[k].x,
                        right: this.map.obstacles[k].x + 25,
                        top: this.map.obstacles[k].y,
                        bottom: this.map.obstacles[k].y + 25,
                    };

                    // sử dụng try catch để bắt lỗi khi viên đạn bị xóa, dẫn đến lỗi khi truy cập thuộc tính x, y của viên đạn tiếp theo
                    try {
                        // Kiểm tra xem viên đạn có va chạm với tường không bằng cách kiểm tra tọa độ của viên đạn có nằm trong vùng của tường không
                        if (
                            newBulletX >= wallRect.left &&
                            newBulletX <= wallRect.right &&
                            newBulletY >= wallRect.top &&
                            newBulletY <= wallRect.bottom
                        ) {
                            // Nếu có thì kiểm tra va chạm với cạnh nào của tường

                            // Khoảng cách đến cạnh trái
                            const distanceToLeft = this.map.adjacentWall[k].includes("left") ? Infinity : newBulletX - wallRect.left;
                            // Khoảng cách đến cạnh phải
                            const distanceToRight = this.map.adjacentWall[k].includes("right") ? Infinity : wallRect.right - newBulletX;
                            // Khoảng cách đến cạnh trên
                            const distanceToTop = this.map.adjacentWall[k].includes("top") ? Infinity : newBulletY - wallRect.top;
                            // Khoảng cách đến cạnh dưới
                            const distanceToBottom = this.map.adjacentWall[k].includes("bottom") ? Infinity : wallRect.bottom - newBulletY;

                            // Cạnh bị trúng sẽ là cạnh có khoảng cách nhỏ nhất
                            // Tìm khoảng cách nhỏ nhất
                            let minDistance = Math.min(distanceToLeft, distanceToRight, distanceToTop, distanceToBottom);

                            // Xử lý va chạm
                            if (minDistance === distanceToLeft || minDistance === distanceToRight) {
                                this.tanks[i].handleBulletCollision(j, true);
                                // this.tanks[i].bullets[j].updatePosition();
                            }
                            if (minDistance === distanceToTop || minDistance === distanceToBottom) {
                                this.tanks[i].handleBulletCollision(j, false);
                                // this.tanks[i].bullets[j].updatePosition();
                            }
                            // Nếu viên đạn trúng tường thì sẽ không trúng xe tăng nữa (trong cùng một thời điểm)
                            // Nên duyệt qua viên đạn tiếp theo
                            break;
                        }

                    } catch {
                        continue;
                    }
                }

                // Duyệt qua vị trí của các xe tăng và kiểm tra va chạm
                for (var k = 0; k < listBoundariesOfTank.length; k++) {
                    // Lấy tọa độ các cạnh (góc trên trái và góc dưới phải) của xe tăng
                    const { xMin, xMax, yMin, yMax, indexTank } = listBoundariesOfTank[k];
                    // Kiểm tra xem viên đạn có va chạm với xe tăng không bằng cách kiểm tra tọa độ của viên đạn có nằm trong vùng của xe tăng không
                    if (newBulletX >= xMin && newBulletX <= xMax && newBulletY >= yMin && newBulletY <= yMax) {
                        // Nếu viên đạn va chạm với xe tăng của đồng đội thì bỏ qua
                        if (this.tanks[i].idTeam === this.tanks[indexTank].idTeam) {
                            continue;
                        }

                        // Nếu không trúng xe tăng của đồng đội thì tức đang trúng xe tăng của địch
                        // Khi đó sẽ giảm máu của xe tăng và xử lý va chạm
                        this.tanks[indexTank].currentHealth -= this.tanks[i].bullets[j].damage;
                        if (this.tanks[indexTank].status === 1) {
                            this.tanks[indexTank].currentHealth = this.tanks[indexTank].health;
                        }
                        if (this.tanks[indexTank].status === 3) {
                            continue;
                        }

                        this.tanks[i].bullets[j].event = "blast";
                        this.eventState = true;

                        // Kiểm tra xem viên đạn đang trúng vào cạnh nào của xe tăng mục tiêu
                        // Để kiểm tra viên đạn trúng cạnh nào thì ta sẽ tính khoảng cách từ viên đạn đến các cạnh của xe tăng
                        // Cạnh bị trúng sẽ là cạnh có khoảng cách nhỏ nhất
                        const distanceToLeft = newBulletX - xMin; // Khoảng cách đến cạnh trái
                        const distanceToRight = xMax - newBulletX; // Khoảng cách đến cạnh phải
                        const distanceToTop = newBulletY - yMin; // Khoảng cách đến cạnh trên
                        const distanceToBottom = yMax - newBulletY; // Khoảng cách đến cạnh dưới

                        // Tìm khoảng cách nhỏ nhất
                        let minDistance = Math.min(distanceToLeft, distanceToRight, distanceToTop, distanceToBottom);

                        // Xử lý va chạm
                        if (minDistance === distanceToLeft || minDistance === distanceToRight) {
                            this.tanks[i].handleBulletCollision(j, true);
                        }
                        if (minDistance === distanceToTop || minDistance === distanceToBottom) {
                            this.tanks[i].handleBulletCollision(j, false);
                        }

                        // Nếu máu của xe tăng mục tiêu bằng 0 thì xóa xe tăng
                        if (this.tanks[indexTank].currentHealth <= 0) {
                            // this.tanks.splice(indexTank, 1);
                            this.tanks[indexTank].deaths++;
                            this.tanks[i].kills++;
                            // this.tanks[indexTank].currentHealth = 100;
                            this.tanks[indexTank].preStatus = this.tanks[indexTank].status;
                            this.tanks[indexTank].status = 3;
                            setTimeout(() => {
                                this.tanks[indexTank].status = 0;
                                this.tanks[indexTank].currentHealth = this.tanks[indexTank].health;
                                if (this.tanks[indexTank].idTeam === "cat") {
                                    this.tanks[indexTank].x = this.map.catPosition.x;
                                    this.tanks[indexTank].y = this.map.catPosition.y;
                                }
                                if (this.tanks[indexTank].idTeam === "dog") {
                                    this.tanks[indexTank].x = this.map.dogPosition.x;
                                    this.tanks[indexTank].y = this.map.dogPosition.y;
                                }
                                
                            }, 5000);
                            if (this.tanks[indexTank].idTeam === "cat") {
                                this.dogScore++;
                            }
                            if (this.tanks[indexTank].idTeam === "dog") {
                                this.catScore++;
                            }
                            this.eventState = true;
                            setTimeout(() => {
                                this.eventState = {
                                    dogScore: this.dogScore,
                                    catScore: this.catScore,
                                };
                            }, 50);
                        }
                    }
                }
            }
        }
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

        // Điều khiển bot
        this.controlBot();

        // Xử lý va chạm trên xe tăng
        this.detectAndHandleBulletCollision();
    }

    getState() {
        /*
            Hàm lấy trạng thái game
            - Trả về trạng thái của các xe tăng
            - Trả về trạng thái của các viên đạn
        */
        const currentState = this.tanks.map((tank) => {
            return tank.getState();
        });
        const encodeState = myUtils.encodeData(currentState);
        if (this.eventState) {
            if (this.eventState.dogScore) {
                const specialState = this.eventState;
                this.eventState = false;
                return specialState;
            }
            this.eventState = false;
            this.stateGame.push(encodeState);
            return encodeState;
        }
        if (this.skipFrame === 0) {
            this.stateGame.push(encodeState);
            this.skipFrame++;
            return encodeState;
        }
        else{
            this.skipFrame++;
            if (this.skipFrame === 3) {
                this.skipFrame = 0;
            }
        }
        return encodeState;
    }

    changeRotationTurret(idTank, cursorPos) {
        /*
            Hàm thay đổi góc quay của nòng súng của xe tăng
            - idTank: id của xe tăng
            - cursorPos: tọa độ của con trỏ chuột

            Hàm này dùng để thay đổi góc quay của nòng súng dựa vào tọa độ của con trỏ chuột
        */
        for (var i = 0; i < this.tanks.length; i++) {
            if (this.tanks[i].idTank === idTank) {
                // Cộng thêm 25 để đồng nhất tọa đ
                var angle = this.utilities.calculusAngle(
                    {
                        x: this.tanks[i].x + 25,
                        y: this.tanks[i].y + 25,
                    },
                    cursorPos
                );
                this.tanks[i].rotationTurret = angle;
            }
        }
    }


    endGame() {
        // Kết thúc game
        // Hàm này chưa được cài đặt!!!

        

    }

    saveGame() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const allStateGame = myUtils.encodeData(this.stateGame);
                // return allStateGame;
                console.log("Đã xong 15s");
                resolve(allStateGame);
            }, 15000);
        });
    }
}

module.exports = Game;
