import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from "react-navigation";
import MainPage from './component/MainPage';
import List from './component/List';
import Info from './component/Info';
import Favorites from './component/Favorites'
import MapList from './component/MapList';

export const ListStack_1 = createStackNavigator({
    MainPage: {
        screen: MainPage,
    },
    Info: {
        screen: Info,
    }
},
    {
        headerMode: 'none',
    });
export const ListStack_2 = createStackNavigator({
    List: {
        screen: List,
    },
    MapList: {
        screen: MapList,
    },
    Info: {
        screen: Info,
    }
},
    {
        headerMode: 'none',
    });
export const ListStack_3 = createStackNavigator({
    Favourites: {
        screen: Favorites,
    },
    MapList: {
        screen: MapList,
    },
    Info: {
        screen: Info,
    }
},
    {
        headerMode: 'none',
    });

export const Router = createAppContainer(createBottomTabNavigator({
    Map: {
        screen: ListStack_1,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <Icon name='public' color={tintColor} size={25} />
            )
        },
    },
    List: {
        screen: ListStack_2,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <Icon name='view-list' color={tintColor} size={25} />
            )
        }
    },
    Favorites: {
        screen: ListStack_3,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <Icon name='star-rate' color={tintColor} size={25} />
            )
        }
    },
},
    {
        tabBarOptions: {
            activeTintColor: '#5ec3f2',
            inactiveTintColor: 'grey'
        }
    }));