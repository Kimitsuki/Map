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
            result = str;
        })
        return result;
    }
}