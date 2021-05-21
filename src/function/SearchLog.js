export const SearchLog = ({ name }) => {
    var history = name;
    var check = false;
    var RNFS = require('react-native-fs');
    var path = RNFS.DocumentDirectoryPath + '/history.txt';
    RNFS.readFile(path).then((res) => {
        str = res.split('\n');
        for (i = 0; i < str.length; i++) {
            if (str[i] == name) {
                check = true;
            }
        }
        if (check) {
            for (i = 0; i < str.length; i++) {
                if (i == 5) {
                    break;
                }
                if (str[i] != name) {
                    history = history + '\n' + str[i];
                }
            }
        } else {
            for (i = 0; i < str.length; i++) {
                if (i == 4) {
                    break;
                }
                history = history + '\n' + str[i];
            }
        }
        RNFS.writeFile(path, history)
            .catch((err) => {
                console.log(err.message);
            });
    })
}