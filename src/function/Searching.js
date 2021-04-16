export const Searching = ({ item, check }) => {
    let result = true;
    let str = check.split(' ');
    for (i = 0; i < str.length; i++) {
        if (removeAccents(item.name + ' ' + item.address).toLowerCase().includes(str[i].toLowerCase()) || (item.name + ' ' + item.address).toLowerCase().includes(str[i].toLowerCase())) {
        } else {
            result = false;
        }
    }
    return result;
}

function removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/ă/g, 'a').replace(/Ă/g, 'Ă')
        .replace(/â/g, 'a').replace(/Â/g, 'Â')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .replace(/ê/g, 'e').replace(/Ê/g, 'Ê')
        .replace(/ô/g, 'o').replace(/Ô/g, 'O')
        .replace(/ơ/g, 'o').replace(/Ơ/g, 'O')
        .replace(/ư/g, 'u').replace(/Ư/g, 'U');
}