export const GetLog = {
    async log() {
        var result = []
        var RNFS = require('react-native-fs');
        var path = RNFS.DocumentDirectoryPath + '/history.txt';
        RNFS.readFile(path).catch(() => {
            RNFS.writeFile(path, '')
        })
        await RNFS.readFile(path).then((res) => {
            str = res.split('\n');
            if (str[str.length - 1] == '') {
                for (i = 0; i < str.length - 1; i++) {
                    result[i] = str[i];
                }
            } else {
                result = str;
            }
        })
        return result;
    }
}