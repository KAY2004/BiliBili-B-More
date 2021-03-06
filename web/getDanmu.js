"use strict";
function danmuStart(e) {
  wsss(e);
}
function wsss(e) {
  var t = {
    uid: 0,
    roomid: parseInt(e),
    protover: 1,
    platform: "web",
    clientver: "1.4.0"
  };
  console.log(JSON.stringify(t)), n && n.close();
  var n = new WebSocket("wss://broadcastlv.chat.bilibili.com/sub");
  (n.onopen = function () {
    console.log("WebSocket 已连接上"),
      n.send(getCertification(JSON.stringify(t)).buffer),
      (timer = setInterval(function () {
        var e = new ArrayBuffer(16),
          t = new DataView(e);
        t.setUint32(0, 0),
          t.setUint16(4, 16),
          t.setUint16(6, 1),
          t.setUint32(8, 2),
          t.setUint32(12, 1),
          n.send(t.buffer);
      }, 3e4));
  }),
    (n.onclose = function () {
      console.log("连接断开"), null !== timer && clearInterval(timer), wsss(e);
    }),
    (n.onmessage = function (e) {
      decode(e.data, function (e) {
        if (5 == e.op)
          for (var t = 0; t < e.body.length; t++) {
            var n = e.body[t];
            "DANMU_MSG" == n.cmd && danmudis(0, n.info[1]);
          }
      });
    });
}
function decode(e, t) {
  var n = new FileReader();
  (n.onload = function (e) {
    var n = new Uint8Array(e.target.result),
      r = {};
    if (
      ((r.packetLen = readInt(n, 0, 4)),
      (r.headerLen = readInt(n, 4, 2)),
      (r.ver = readInt(n, 6, 2)),
      (r.op = readInt(n, 8, 4)),
      (r.seq = readInt(n, 12, 4)),
      5 == r.op)
    ) {
      r.body = [];
      for (var o = 0; o < n.length; ) {
        var s = readInt(n, o + 0, 4),
          i = n.slice(o + 16, o + s),
          a = "{}";
        if (
          (a =
            2 == r.ver
              ? textDecoder.decode(pako.inflate(i))
              : textDecoder.decode(i))
        ) {
          a.split(/[\x00-\x1f]+/).forEach(function (e) {
            try {
              r.body.push(JSON.parse(e));
            } catch (e) {}
          });
        }
        o += s;
      }
    }
    t(r);
  }),
    n.readAsArrayBuffer(e);
}
function getCertification(e) {
  var t = str2bytes(e),
    n = new ArrayBuffer(t.length + 16),
    r = new DataView(n);
  r.setUint32(0, t.length + 16),
    r.setUint16(4, 16),
    r.setUint16(6, 1),
    r.setUint32(8, 7),
    r.setUint32(12, 1);
  for (var o = 0; o < t.length; o++) r.setUint8(16 + o, t[o]);
  return r;
}
function str2bytes(e) {
  for (var t = [], n = void 0, r = e.length, o = 0; o < r; o++)
    (n = e.charCodeAt(o)),
      n >= 65536 && n <= 1114111
        ? (t.push(((n >> 18) & 7) | 240),
          t.push(((n >> 12) & 63) | 128),
          t.push(((n >> 6) & 63) | 128),
          t.push((63 & n) | 128))
        : n >= 2048 && n <= 65535
        ? (t.push(((n >> 12) & 15) | 224),
          t.push(((n >> 6) & 63) | 128),
          t.push((63 & n) | 128))
        : n >= 128 && n <= 2047
        ? (t.push(((n >> 6) & 31) | 192), t.push((63 & n) | 128))
        : t.push(255 & n);
  return t;
}
var timer,
  textDecoder = new TextDecoder("utf-8"),
  readInt = function (e, t, n) {
    for (var r = 0, o = n - 1; o >= 0; o--)
      r += Math.pow(256, n - o - 1) * e[t + o];
    return r;
  };
