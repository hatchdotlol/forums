const glitter = (str) => {
    return str
        .replace(/@([a-z,A-Z,0-9,\-,_]+)\b/g, "<a href='https://dev.hatch.lol/user/?u=$1'>@$1</a>")
        .replace(/:glungus:/g, "<img class='emoji' src='https://dev.hatch.lol/images/emojis/glungus.png' alt='glungus'>")
        .replace(/:(tada|hooray):/g, "🎉")
        .replace(/:(\+1|thumbsup):/g, "👍")
        .replace(/:(\-1|thumbsdown):/g, "👎")
        .replace(/:skull:/g, "💀")
        .replace(/:(hatch(dotlol)?|kyle):/g, "🐣")
        .replace(/\[quote=([a-z,A-Z,0-9,\-,_]+)\]/g, "<blockquote><p><b><a href='https://dev.hatch.lol/user/?u=$1'>@$1</a> said:</b></p>")
        .replace(/\[quote\]/g, "<blockquote>")
        .replace(/\[\/quote\]/g, "</blockquote>")
        .replace(/\[colou?r=(#?[a-z,A-Z,0-9,]+)\]/g, "<hfm-color style='color: $1'>")
        .replace(/\[\/colou?r\]/g, "</hfm-color>")
}