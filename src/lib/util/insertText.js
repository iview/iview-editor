/**
 * 在指定光标位置插入内容
 * @param obj
 * @param str
 */
export default function (obj, str) {
    if (document.selection) {
        const sel = document.selection.createRange();
        sel.text = str;
    } else if ( typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number' ) {
        let startPos = obj.selectionStart,
            endPos = obj.selectionEnd,
            cursorPos = startPos,
            tmpStr = obj.value;
        obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
        cursorPos += str.length;
        obj.selectionStart = obj.selectionEnd = cursorPos;
    } else {
        obj.value += str;
    }
}