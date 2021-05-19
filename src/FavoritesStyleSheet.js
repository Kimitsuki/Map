import { Dimensions, StyleSheet } from 'react-native';
const { height, width } = Dimensions.get('window');

export const favoritesStyle = StyleSheet.create({

    backgroundHeader: {
        height: 70,
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center', 
    },

    danhSachYeuThichText: {
        color: 'white',
        fontSize: 20,
        marginTop: 20,

    },

    searchBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginTop: 20,
        height: 40,
        borderRadius: 10,
    },

    searchImage: {
        width: 20,
        height: 20,
    },

    textInputSearch: {
        fontSize: 12
    },

    body: {
        marginHorizontal: 10,
        flex: 0.99
    },

    bodyFavorites: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 5,
        padding: 10
    },

})