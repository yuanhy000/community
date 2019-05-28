import {
    HTTP
} from 'http.js'

class Token extends HTTP {

    setToken(code) {
        let token = wx.getStorageSync('token');
        if (!token) {
            this.getToken(code);
        } else {
            this.checkToken(token, code);
        }
    }

    checkToken(token, code) {
        return this.request({
            url: 'token/check',
            method: 'POST',
            data: {
                token: token
            }
        }).then(res => {
            let result = res.result;
            if (!result) {
                this.getToken(code);
            }
        });
    }

    getToken(code, nickName) {

        return this.request({

            url: 'token/user',
            method: 'POST',
            data: {
                code: code,
                nickName: nickName
            }
        }).then(res => {
            wx.setStorageSync('token', res.token);
        });

    }
}

export {
    Token
}