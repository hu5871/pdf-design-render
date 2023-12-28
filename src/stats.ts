// stats.js - http://github.com/mrdoob/stats.js
var Stats :any= function () {
  function f(a:any, e:any, b:any) {
    a = document.createElement(a)
    a.id = e
    a.style.cssText = b
    return a
  }
  function l(a, e, b) {
    var c = f('div', a, 'padding:0 0 3px 3px;text-align:left;background:' + b),
      d = f(
        'div',
        a + 'Text',
        'font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px;color:' +
          e
      )
    d.innerHTML = a.toUpperCase()
    c.appendChild(d)
    a = f('div', a + 'Graph', 'width:74px;height:30px;background:' + e)
    c.appendChild(a)
    for (e = 0; 74 > e; e++)
      a.appendChild(
        f(
          'span',
          '',
          'width:1px;height:30px;float:left;opacity:0.9;background:' + b
        )
      )
    return c
  }
  function m(a) {
    for (var b = c.children, d = 0; d < b.length; d++)
      b[d].style.display = d === a ? 'block' : 'none'
    n = a
  }
  function p(a, b) {
    a.appendChild(a.firstChild).style.height = Math.min(30, 30 - 30 * b) + 'px'
  }
  var q =
      self.performance && self.performance.now
        ? self.performance.now.bind(performance)
        : Date.now,
    k = q(),
    r = k,
    t = 0,
    n = 0,
    c = f('div', 'stats', 'width:80px;opacity:0.9;cursor:pointer')
  c.addEventListener(
    'mousedown',
    function (a) {
      a.preventDefault()
      m(++n % c.children.length)
    },
    !1
  )
  var d = 0,
    u = Infinity,
    v = 0,
    b = l('fps', '#0ff', '#002'),
    A = b.children[0],
    B = b.children[1]
  c.appendChild(b)
  var g = 0,
    w = Infinity,
    x = 0,
    b = l('ms', '#0f0', '#020'),
    C = b.children[0],
    D = b.children[1]
  c.appendChild(b)
  if (self.performance && self.performance.memory) {
    var h = 0,
      y = Infinity,
      z = 0,
      b = l('mb', '#f08', '#201'),
      E = b.children[0],
      F = b.children[1]
    c.appendChild(b)
  }
  m(n)
  return {
    REVISION: 14,
    domElement: c,
    setMode: m,
    begin: function () {
      k = q()
    },
    end: function () {
      var a = q()
      g = a - k
      w = Math.min(w, g)
      x = Math.max(x, g)
      C.textContent = (g | 0) + ' MS (' + (w | 0) + '-' + (x | 0) + ')'
      p(D, g / 200)
      t++
      if (
        a > r + 1e3 &&
        ((d = Math.round((1e3 * t) / (a - r))),
        (u = Math.min(u, d)),
        (v = Math.max(v, d)),
        (A.textContent = d + ' FPS (' + u + '-' + v + ')'),
        p(B, d / 100),
        (r = a),
        (t = 0),
        void 0 !== h)
      ) {
        var b = performance.memory.usedJSHeapSize,
          c = performance.memory.jsHeapSizeLimit
        h = Math.round(9.54e-7 * b)
        y = Math.min(y, h)
        z = Math.max(z, h)
        E.textContent = h + ' MB (' + y + '-' + z + ')'
        p(F, b / c)
      }
      return a
    },
    update: function () {
      k = this.end()
    },
  }
}
export default Stats
