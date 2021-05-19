import React, { Component } from 'react';
import { View, AsyncStorage, FlatList, Text, TouchableOpacity, Image } from 'react-native';
import { favoritesStyle } from '../FavoritesStyleSheet';
import { styles } from '../StyleSheet';
import Geolocation from '@react-native-community/geolocation';
import { NavigationEvents } from 'react-navigation';

export default class Favorites extends Component {
    constructor(props) {
        super(props);
        this.state = {
            favorites: [],
            currentPositionLatitude: 0,
            currentPositionLongitude: 0,
            fetching: false,
            distance: 0,
            duration: 0,
        }
    }

    onFocus = async () => {
        this.currentPosition();
        const response = await AsyncStorage.getItem('favorites');
        const listOfLikes = await JSON.parse(response) || [];
        this.setState({
            favorites: listOfLikes,
        });
        console.log("Favorites " + JSON.stringify(this.state.favorites))
    }

    currentPosition() {
        Geolocation.getCurrentPosition(
            (info) => this.getPosition(info.coords.latitude, info.coords.longitude),
            (error) => Alert.alert('Bạn cần bật vị trí để sử dụng ứng dụng này'),
            { enableHighAccuracy: false, timeout: 50000 }
        );
    }
    getPosition(latitude, longitude) {
        this.setState({
            currentPositionLatitude: latitude,
            currentPositionLongitude: longitude,
        })
    }
    fetchDistance(lat1, lon1, lat2, lon2, item) {
        this.setState({ fetching: true })
        let url = 'https://maps.googleapis.com/maps/api/directions/json?origin=' + lat1 + ',' + lon1 + '&destination=' + lat2 + ',' + lon2 + '&key=AIzaSyDGRIkhrfyhXfwmzRRX6TTyZ6XmvAsW4Iw&fbclid';
        fetch(url)
            .then((response) => response.json())
            .then((responseJSON) => {
            	console.log(responseJSON);
                this.props.navigation.navigate('Info', { item: item, distance: responseJSON.routes[0].legs[0].distance.text, duration: responseJSON.routes[0].legs[0].duration.text })
            })

        console.log(this.state.distance)
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <NavigationEvents
                    onWillFocus={this.onFocus} />
                <View style={favoritesStyle.backgroundHeader}>
                    <Text style={{ fontSize: 30 }}>Địa điểm yêu thích</Text>
                </View>
                <View style={favoritesStyle.body}>
                    <FlatList
                        data={this.state.favorites}
                        renderItem={({ item }) => {
                            return (
                                <View style={favoritesStyle.bodyFavorites}>
                                    <TouchableOpacity onPress={() => Linking.openURL('google.navigation:q='+item.latitude+'+'+item.longitude)}>
                                        <View style={{ flexDirection: 'column' }}>
                                            <Text style={styles.infoName}>{item.name}</Text>
                                            <Text style={styles.infoAddress}>Địa chỉ: {item.address}</Text>
                                            <Text style={styles.infoAddress}>Giờ mở cửa: {item.open_close}</Text>
                                            <Text style={styles.infoAddress}>Dịch vụ: {item.services}</Text>
                                            <TouchableOpacity style={styles.infoButton} onPress={() => { this.fetchDistance(this.state.currentPositionLatitude, this.state.currentPositionLongitude, item.latitude, item.longitude, item) }}>
                                                <Image source={require('../pictures/info.png')} style={{ width: 30, height: 30 }} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => { this.removeToFavorites(item) }}>
                                                <Image source={require('../pictures/heart1.png')} />
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        }}
                    />
                </View>
            </View>
        )
    }
}
