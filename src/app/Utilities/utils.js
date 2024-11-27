const pako = require('pako');

class utils {
   
    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    generateID() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    }

    validateID(id) {
        if (id.length < 13) return false;

        const timestampPart = id.slice(0, 13);
        // Ký pháp regex /^\d{13}$/ kiểm tra chuỗi có 13 ký tự và tất cả đều là số
        if (!/^\d{13}$/.test(timestampPart)) return false;

        const randomPart = id.slice(13); // Phần sau là chuỗi ngẫu nhiên
        if (!/^[a-z0-9]{9}$/.test(randomPart)) return false;

        return true;
    }

    decisionBaseprobability(probability, listOption) { }

    decisionTeam(list_playyer) {
        /*
            list_playyer = [
                {
                    id: id của player
                    username: tên của player
                    role: vai trò của player // Có phải chủ phòng hay không
                    team: team của player // team Chó hoặc mèo
                }
            ]
        */

        var numberPlayerInTeamDog = 0;
        var numberPlayerInTeamCat = 0;

        list_playyer.forEach((player) => {
            if (player.team === "dog") {
                numberPlayerInTeamDog++;
            } else {
                numberPlayerInTeamCat++;
            }
        });

        if (numberPlayerInTeamDog > numberPlayerInTeamCat) {
            return "cat";
        } else if (numberPlayerInTeamDog < numberPlayerInTeamCat) {
            return "dog";
        } else {
            const random = this.getRandomNumber(0, 1) === 0 ? "dog" : "cat";
            return random;
        }
    }

    getRecordMongoDB(data) {
        return data.toObject();
    }

    getListRecordMongoDB(data) {
        return data.map((record) => record.toObject());
    }

    sortObjectsByKey(arr, key) {
        return arr.sort((a, b) => {
            if (!a[key]) {
                a[key] = 0;
            }
            if (!b[key]) {
                b[key] = 0;
            }
            if (a[key] < b[key]) {
                return -1;
            }
            if (a[key] > b[key]) {
                return 1;
            }
            return 0;
        });
    }

    encodeData(data) {
        // Chuyển đối tượng data thành chuỗi JSON
        const jsonData = JSON.stringify(data);
        
        // Nén chuỗi JSON bằng Pako (deflate)
        const compressedData = pako.deflate(jsonData);
        
        // Chuyển mảng byte nén thành chuỗi Base64
        const base64Compressed = Buffer.from(compressedData).toString('base64');
        
        return base64Compressed;
    }

    decodedData(data) {
        // Chuyển chuỗi Base64 thành mảng byte
        const decodedData = Buffer.from(data, 'base64');
        
        // Giải nén mảng byte đã mã hóa (inflate)
        const decompressedData = pako.inflate(decodedData, { to: 'string' });
        
        // Chuyển chuỗi JSON thành đối tượng JavaScript
        const originalData = JSON.parse(decompressedData);
        
        return originalData;
    }

    getTimeNow() {
        const now = new Date();
        const day = now.getDate();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const second = now.getSeconds();

        return `${hour}:${minute}:${second} ${day}/${month}/${year}`;
    }

}

module.exports = new utils();
