// calculate the projection of a point on a line
const orthogonalProjection = (a, b, p, segement = false) => {
  let res;
  if (!segement) {
    // find nearest point along a LINE
    d1 = p5.Vector.sub(b, a).normalize();
    d2 = p5.Vector.sub(p, a);
    d1.mult(d2.dot(d1));
    res = p5.Vector.add(a, d1);
  } else {
    // find nearest point along a SEGMENT
    d1 = p5.Vector.sub(b, a);
    d2 = p5.Vector.sub(p, a);
    l1 = d1.mag();
    dotp = constrain(d2.dot(d1.normalize()), 0, l1);
    res = p5.Vector.add(a, d1.mult(dotp));
  }
  return res;
};

// hash a string into a hex color
const stringToColour = (str) => {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xff;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
};

// convert hsl values to a hex color
const hslToHex = (h, s, l) => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0'); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};
