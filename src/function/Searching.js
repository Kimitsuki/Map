export const Searching = ({ item, check }) => {
    let str = check.split(' ');
    let name = item.name + ' ' + item.address;
    for (i = 0; i < str.length; i++) {
        if (removeAccents(name).toLowerCase().includes(str[i].toLowerCase()) || (name).toLowerCase().includes(str[i].toLowerCase())) {
        } else {
            return false;
        }
    }
    return true;
}

function removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/ă/g, 'a').replace(/Ă/g, 'A')
        .replace(/â/g, 'a').replace(/Â/g, 'A')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .replace(/ê/g, 'e').replace(/Ê/g, 'E')
        .replace(/ô/g, 'o').replace(/Ô/g, 'O')
        .replace(/ơ/g, 'o').replace(/Ơ/g, 'O')
        .replace(/ư/g, 'u').replace(/Ư/g, 'U');
}