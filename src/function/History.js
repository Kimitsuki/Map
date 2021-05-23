export const ToHistory = ({ item, dataSource }) => {
    for (i = 0; i < dataSource.length; i++) {
        if (dataSource[i].name == item) {
            return dataSource[i];
        }
    }
}