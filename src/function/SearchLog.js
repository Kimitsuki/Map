export const SearchLog = ({ name }) => {
    var history = name;
    var RNFS = require('react-native-fs');
    var path = RNFS.DocumentDirectoryPath + '/history.txt';
    RNFS.readFile(path).then((res) => {
        str = res.split('\n');
        for (i = 0; i < str.length; i++) {
            if (i == 4) {
                break;
            }
            history = history + '\n' + str[i]
        }
        console.log(history)
        RNFS.writeFile(path, history)
            .catch((err) => {
                console.log(err.message);
            });
    })
}