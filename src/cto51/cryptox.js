var CryptoJS = require("crypto-js");

var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 255;
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 3) << 4);
            out += "==";
            break
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 3) << 4 | (c2 & 240) >> 4);
            out += base64EncodeChars.charAt((c2 & 15) << 2);
            out += "=";
            break
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt((c1 & 3) << 4 | (c2 & 240) >> 4);
        out += base64EncodeChars.charAt((c2 & 15) << 2 | (c3 & 192) >> 6);
        out += base64EncodeChars.charAt(c3 & 63)
    }
    return out
}

function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 255]
        } while (i < len && c1 == -1);
        if (c1 == -1) break;
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 255]
        } while (i < len && c2 == -1);
        if (c2 == -1) break;
        out += String.fromCharCode(c1 << 2 | (c2 & 48) >> 4);
        do {
            c3 = str.charCodeAt(i++) & 255;
            if (c3 == 61) return out;
            c3 = base64DecodeChars[c3]
        } while (i < len && c3 == -1);
        if (c3 == -1) break;
        out += String.fromCharCode((c2 & 15) << 4 | (c3 & 60) >> 2);
        do {
            c4 = str.charCodeAt(i++) & 255;
            if (c4 == 61) return out;
            c4 = base64DecodeChars[c4]
        } while (i < len && c4 == -1);
        if (c4 == -1) break;
        out += String.fromCharCode((c3 & 3) << 6 | c4)
    }
    return out
}

/**
 * 视频解密方法
 * @param data 要解密的原始数据
 * @param key Key的密文: 通过 get-key 获取到的字符串
 * @param lession_id: 课程的id
 * @param callback 解密后的回调方法，参数是解密后的明文
 */
function decrypt(data, key, lession_id, callback) {
    var iv = "0x0123456789abcdef0123456789abcdef";
    var ea = ["s", "i", "y", "u", "a", "n", "t", "l", "w", "x"],
        efs = [
            function (r) {
                return r
            },
            function (r, e, t) {
                t = t ? t : "eDu_51Cto_siyuanTlw";
                var n = base64decode(r).split(""),
                    s = CryptoJS.MD5(e + t).toString();
                for (var a = s.length - 1; a >= 0; a--) {
                    var u = s[a].charCodeAt();
                    var i = u % (n.length - 1);
                    n.splice(i, 1)
                }
                return n.join("")
            },
            function (r, e, t) {
                var n = e % 7,
                    s = r.length,
                    a = "";
                for (var u = 0; u < s / 2; u++) {
                    var i = u * 2;
                    if (n == 0 || u % n == 0) {
                        a += r[i] + r[i + 1]
                    } else {
                        a += r[i + 1] ? r[i + 1] + r[i] : r[i]
                    }
                }
                var f = base64decode(a);
                var o = f.length,
                    l = (o - 1) / 2,
                    v = "";
                for (var u = 0; u < l; u++) {
                    var i = u * 2;
                    if (u > n) i++;
                    if (u % 3 == 0) {
                        v += f[i]
                    } else {
                        v += f[i + 1]
                    }
                }
                return v
            },
            function (r) {
                return r
            },
            function (r) {
                return r
            },
            function (r, e, t) {
                var n = r.slice(0, 7) + r.slice(10, 12) + r.slice(15, -3),
                    s,
                    a,
                    u,
                    i,
                    f,
                    o,
                    l,
                    v = "",
                    c = 0,
                    b = 0,
                    g = "";
                n = n.split("").reverse().join("");
                s = eeb64(n);
                a = parseInt(s.substr(0, 1));
                u = s.slice(6, -3);
                i = u.match(/^\d*/);
                f = u.match(/\d*$/);
                o = i[0];
                l = f[0];
                u = u.replace(/^\d*/, "").replace(/\d*$/, "");
                for (var h = 0; h < l.length; h++) {
                    v += bu(parseInt(l[h]).toString(2), 3)
                }
                v = v.substr(a);
                for (var h = 0; h < v.length; h++) {
                    if (v[h] == 1) {
                        g += o[b];
                        b++
                    } else {
                        g += u[c];
                        c++
                    }
                }
                return g
            },
            function (r, e, t) {
                var n = {
                    B: "0",
                    q: "1",
                    r: "2",
                    C: "3",
                    w: "4",
                    x: "5",
                    V: "6",
                    e: "7",
                    f: "8",
                    D: "9",
                    9: "a",
                    4: "b",
                    5: "c",
                    7: "d",
                    m: "e",
                    n: "f",
                    o: "g",
                    H: "h",
                    I: "i",
                    N: "j",
                    O: "k",
                    P: "l",
                    Q: "m",
                    R: "n",
                    S: "o",
                    U: "p",
                    X: "q",
                    L: "r",
                    M: "s",
                    a: "t",
                    b: "u",
                    F: "v",
                    c: "w",
                    d: "x",
                    g: "y",
                    h: "z",
                    i: "A",
                    j: "B",
                    y: "C",
                    z: "D",
                    k: "E",
                    l: "F",
                    6: "G",
                    G: "H",
                    A: "I",
                    p: "J",
                    s: "K",
                    t: "L",
                    u: "M",
                    J: "N",
                    K: "O",
                    v: "P",
                    W: "Q",
                    0: "R",
                    Y: "S",
                    Z: "T",
                    2: "U",
                    3: "V",
                    E: "W",
                    T: "X",
                    8: "Y",
                    1: "Z"
                };
                var s = 5,
                    a = "",
                    u = 0,
                    i = "",
                    f = 0,
                    o;
                for (var l = 0; l < r.length; l++) {
                    var v = r[l];
                    a += n[v] ? n[v] : v
                }
                for (var l = 0; l < 8; l++) {
                    o = l == 7 ? 32 - f : Math.abs(8 - s++);
                    i += a.substr(u++, 1);
                    u += o;
                    f += o
                }
                i += a.substr(40);
                return eeb64(i.split("").reverse().join(""))
            },
            function (r, e, t) {
                t = t ? t : "eDu_51Cto_siyuanTlw";
                var n = eeb64(r),
                    s = CryptoJS.MD5(t + e).toString().slice(0, 16),
                    a = n.indexOf(s),
                    u = parseInt(n.slice(0, a), 16);
                if (!a) return false;
                var i = n.substr(16 + a);
                if (i.length == u) {
                    return i
                }
                return false
            }];

    function bu(r, e) {
        r += "";
        for (var t = e - r.length; t > 0; t--) {
            r = "0" + r
        }
        return r
    }

    function eeb64(r) {
        var e = "BqrCwxVefD9457mnoHINOPQRSUXLMabFcdghijyzkl6GApstuJKvW0YZ23ET81=_",
            t = "",
            n, s = "";
        for (var a = 0; a < r.length; a++) {
            t += bu(e.indexOf(r[a]).toString(2), 6)
        }
        t = t.substring(t.length % 8);
        for (var a = 0; a < Math.ceil(t.length / 8); a++) {
            s += String.fromCharCode(parseInt(t.substr(a * 8, 8), 2))
        }
        return base64decode(s)
    }

    function dec(r, e) {
        function t(r) {
            for (var e = 0; e < ea.length; e++) {
                if (ea[e] == r) {
                    return e;
                    break
                }
            }
        }

        var n = r[1],
            s = [efs[t(r[13])], efs[t(r[8])], efs[t(r[4])]],
            a = r.substr(0, 1) + r.substr(2, 2) + r.substr(5, 3) + r.substr(9, 4) + r.substr(14);
        for (var f in s) {
            a = s[f](a, e)
        }
        return a
    }

    function _base64ToArrayBuffer(base64) {
        // var binary_string = atob(base64);
        var binary_string = base64decode(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i)
        }
        return bytes.buffer
    }

    function arrayBufferToBase64(buffer) {
        var binary = "";
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i])
        }
        var result = base64encode(binary);
        return result;
        //return btoa(binary)
    }

    var opt = {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    };
    key = dec(key, lession_id);
    key = CryptoJS.enc.Utf8.parse(key);
    let content = CryptoJS.AES.decrypt(arrayBufferToBase64(data), key, opt);
    content = new Buffer.from(content.toString(CryptoJS.enc.Hex), "hex").toString("binary");

    callback(content)
};

module.exports = {decrypt: decrypt};