import React, { useEffect, useState } from 'react';
import { Container, Text } from 'native-base';
import {
    ScrollView, SafeAreaView, StatusBar, FlatList, Dimensions, ActivityIndicator,
} from 'react-native';

import { View, StyleSheet } from 'react-native';
import database from '@react-native-firebase/database';
import { useSelector } from 'react-redux';
import IndividualPost from '../../components/IndividualPost/IndividualPost'

import SkeletonLoading from '../../components/SkeletonLoading/SkeletonLoading';
import colors from '../../colors/colors';


const Posts = ({ navigation }) => {
    // console.log("lists routes", route.params)

    const loginUser = useSelector(state => state.todo.loginUser);
    const currentUserUID = useSelector(state => state.todo.loginUser.uid);
    const isDark = useSelector(state => state.todo.dark)

    const [posts, setPosts] = useState([]);
    const [isLoading, setisLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    const dataFunc = () => {
        database()
            .ref(`users`)
            .on('value', snap => {
                if (snap.exists()) {
                    let temp = []
                    Object.keys(snap.val()).map(userID => {
                        if (userID !== currentUserUID) {
                            if (snap.val()[userID]?.posts) {
                                let userPost = snap.val()[userID]?.posts
                                Object.keys(userPost).map(postKey => temp.push(userPost[postKey]))
                            }
                        }
                    })
                    temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setPosts(temp)
                    setisLoading(false)
                    setIsFetching(false)
                }
                else {
                    setPosts([])
                    setisLoading(false)
                }
            });
    };
    useEffect(() => {
        dataFunc();
        // return () => 
    }, []);

    const skeleton = () => {
        return (
            <Container style={{ alignItems: "center", justifyContent: "center", backgroundColor: isDark ? colors.dark : "#fff" }}>
                <ActivityIndicator size="large" color={isDark ? "lightgreen" : "#000"} />
            </Container>
            // <SkeletonLoading />
        )
    }

    const onRefresh = () => {
        setIsFetching(true)
        dataFunc()
    }

    return (
        <Container style={[styles.container, { backgroundColor: isDark ? colors.dark : "#fff" }]} >
            <StatusBar barStyle="light-content" backgroundColor={colors.green} />
            {isLoading ?
                skeleton() :
                posts.length > 0 ?
                    <FlatList
                        // style={{ borderWidth: 0, borderColor: "green", marginBottom: 0 }}
                        refreshing={isFetching}
                        onRefresh={() => onRefresh()}
                        data={posts}
                        keyExtractor={(item) => item.key}
                        renderItem={({ item }) => <IndividualPost navigation={navigation} key={item} item={item} />}
                    />
                    :
                    <Container style={{
                        borderColor: "red", borderWidth: 0, alignItems: "center", justifyContent: "center",
                        backgroundColor: isDark ? colors.dark : "#fff"
                    }}>
                        <Text style={{ fontWeight: "bold", color: isDark ? "#fff" : "#000" }}>No Posts Available</Text>
                    </Container>
            }
        </Container>
    );
};

export default Posts;

const styles = StyleSheet.create({
    container: {
        // borderWidth: 2,
        // borderColor: "red",
        height: 100
        // justifyContent: 'center',
        // marginHorizontal: 10,

    },
    cardContainer: {
        flex: 1,
        // marginHorizontal: 10,
    },
    CardItem: {
        height: '20%',
    },
    listContainer: {
        height: '80%',
    },
    lists: {
        // backgroundColor: "#F7941E",
        paddingVertical: 10,
    },
    listItem: {
        backgroundColor: '#96ea93',
        borderRadius: 5,
        elevation: 5,
        marginVertical: 4,
        paddingLeft: 10,
    },
    icon: {
        marginHorizontal: 6,
    },
});
