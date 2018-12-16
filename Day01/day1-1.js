vals = document.querySelectorAll("body pre")[0].innerText.split('\n').map(val => Number(val))

vals.reduce((res, val) => res += val, 0)
