import React from 'react'
import { Text, View } from "react-native";

class Courier extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            price: props.price
        };
    }
    render() {
        return (
            <>
                <View>
                    <View>
                        <Text>Name: {this.state.name}</Text>
                    </View>
                    <View>
                        <Text>Price: $ {this.state.price}</Text>
                    </View>
                </View>
            </>
        );
    }
}

const styles = StyleSheet.create({
    containerPrices: {
      backgroundColor: '#BCFAAE',
    },
  });

export default Courier;