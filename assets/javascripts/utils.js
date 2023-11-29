/**
 * base64로 문자열을 base64로 인코딩하여 반환합니다.
 * @param {string} str - base64로 인코딩할 문자열
 * @returns {string} - base64로 인코딩된 문자열
 */
function b64EncodeUnicode(str) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode(`0x${p1}`);
    })
  );
}
