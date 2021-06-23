import React from 'react'
import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import AllPosts from '../components/AllPosts/AllPosts';
import IndividualPost from '../components/AllPosts/IndividualPost';
import Comments from '../components/Comments/Comments';
import colors from '../colors/colors';
import { Button } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Auth from "@react-native-firebase/auth"
import { useDispatch } from "react-redux"
import { loginUser } from '../store/actions/actions';


function StackPosts() {
    const dispatch = useDispatch()
    const Stack = createStackNavigator()
    return (
        <Stack.Navigator initialRouteName="AllPosts" screenOptions={({ route, navigation, focs }) => ({
            headerStyle: {
                backgroundColor: colors.green,
            },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
            headerRight: () => {
                return (
                    <Button transparent style={{ marginRight: 20 }}>
                        <Icon
                            name="sign-out-alt"
                            size={25}
                            color={'#fff'}
                            onPress={() => {
                                Auth()
                                    .signOut()
                                    .then(_ => console.log('SignOut'));
                                dispatch(loginUser({}));
                            }}
                        />
                    </Button>
                );
            }
        })}>
            <Stack.Screen options={({ route, navigation }) => ({
                headerLeft: () => {
                    return (
                        <Icon
                            style={{ marginLeft: 20 }}
                            name="bars"
                            size={25}
                            color={'#fff'}
                            onPress={() => {
                                navigation.openDrawer()
                            }}
                        />
                    );
                }
            })}
                name="AllPosts" component={AllPosts}
            />
            <Stack.Screen options={({ route, navigation }) => ({
                headerRight: () => {
                    return null
                }
            })} name="comments" component={Comments} />
        </Stack.Navigator>
    );
}

export default StackPosts;

const styles = StyleSheet.create({
    addButton: {
        marginHorizontal: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#fff",
        paddingHorizontal: 8,
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    }
})
