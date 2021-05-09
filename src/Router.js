import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from "react-navigation";
import MainPage from './component/MainPage';
import List from './component/List';
import Info from './component/Info';

export const ListStack = createStackNavigator({
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

export const Router = createAppContainer(createBottomTabNavigator({
    Map: {
        screen: ListStack,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <Icon name='public' color={tintColor} size={25} />
            )
        }
    },
    List: {
        screen: List,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <Icon name='view-list' color={tintColor} size={25} />
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
