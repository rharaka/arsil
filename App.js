import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import axios from 'axios'
import Courier from './components/Courier'

export default function App() {

  const [senderCode, setSenderCode] = useState('')
  const [receiverCode, setReceiverCode] = useState(0)
  const [weight, setWeight] = useState(0)
  const [length, setLength] = useState(0)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [price, setPrice] = useState(-1)
  const [couriers, setCouriers] = useState([])
  const [calculate, setCalculate] = useState(true)

  const handleSelectCode = async (selectedCode, codeType) => {
    if(codeType == 'sender') 
      setSenderCode(selectedCode)
    else 
      setReceiverCode(selectedCode)
  }

  const handleShipIt = async () => {

    setCalculate(false)
    var volume = (length * width * height) / 5000
    if(volume <= weight) 
      volume = weight

    // Click on SHIP
    if(price > 0){
      await axios.get('http://localhost:4545/prices_courier/'+volume)
      .then(function (response) {
        // handle success
        if(response.data) {
          // setPrice(response.data[0].PRICE)
          setCouriers([response.data])
          console.log("response.data.Results", response.data);
        }
        else {
          // setPrice(-1)
          console.log("Courier Not Exist")
          Alert.alert("Error", "Courier Not Exist")
        }
      })
      .catch(function (error) {
        // handle error
        console.log("error", error);
        // setPrice(0)
        console.log("Courier Not Exist")
        Alert.alert("Error", "Courier Not Exist")
      })
    }

    // Click on Calculate
    else if(weight > 0){
      console.log("weight - volume", weight+' - '+volume)
      await axios.get('http://localhost:4545/prices/'+volume)
      .then(function (response) {
        // handle success
        if(response.data[0].PRICE > 0 && response.data[0].PRICE) {
          setPrice(response.data[0].PRICE)
          console.log("response.data[0].PRICE", response.data[0].PRICE);
        }
        else {
          setPrice(-1)
          console.log("Courier Not Exist")
          Alert.alert("Error", "Courier Not Exist")
        }
      })
      .catch(function (error) {
        // handle error
        console.log("error", error);
        setPrice(0)
        console.log("Courier Not Exist")
        Alert.alert("Error", "Courier Not Exist")
      })
    }

    // 
    else {
      console.log("Weight can't be null", weight)
      Alert.alert("Error", "Weight can't be null")
    }

  }

  return (
    <View style={styles.container}>

      <Text style={styles.headingText}>SHIP with ARSIL</Text>
      <View style={styles.form}>
        <View style={styles.fieldset}>
          <TextInput 
            style={styles.textinputCode} 
            placeholder="From Zipcode"
            onChangeText={(newCode) => {
                            setCouriers([])
                            handleSelectCode(newCode, 'sender')
                            setPrice(-1)
                            setCalculate(true)
                          }}
            defaultValue={senderCode}
          />
          <TextInput 
            style={styles.textinputCode} 
            placeholder="To Zipcode"
            onChangeText={(newCode) => {
                            setCouriers([])
                            handleSelectCode(newCode, 'receiver')
                            setPrice(-1)
                            setCalculate(true)
                          }}
            defaultValue={receiverCode}
          />
        </View>
        <View style={styles.fieldset}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput 
            style={styles.textinput} 
            placeholder="Max 50 kg"
            onChangeText={(newWeight) => {
                            setCouriers([])
                            setWeight(newWeight)
                            setPrice(-1)
                            setCalculate(true)
                          }}
            defaultValue={weight}
          />
        </View>
        <View style={styles.fieldset}>
          <Text style={styles.label}>Length (cm)</Text>
          <TextInput 
            style={styles.textinput} 
            placeholder="Max 220 cm"
            onChangeText={(newLength) => {
                            setCouriers([])
                            setLength(newLength)
                            setPrice(-1)
                            setCalculate(true)
                          }}
            defaultValue={length}
          />
        </View>
        <View style={styles.fieldset}>
          <Text style={styles.label}>Width (cm)</Text>
          <TextInput 
            style={styles.textinput} 
            placeholder="Max 150 cm"
            onChangeText={(newWidth) => {
                            setCouriers([])
                            setWidth(newWidth)
                            setPrice(-1)
                            setCalculate(true)
                          }}
            defaultValue={width}
          />
        </View>
        <View style={styles.fieldset}>
          <Text style={styles.label}>Height (cm)</Text>
          <TextInput 
            style={styles.textinput} 
            placeholder="Max 70 cm"
            onChangeText={(newHeight) => {
                            setCouriers([])
                            setHeight(newHeight)
                            setPrice(-1)
                            setCalculate(true)
                          }}
            defaultValue={height}
          />
        </View>
        <View style={styles.buttonView}>
          <TouchableOpacity style={styles.button} onPress={handleShipIt}>
            <Text style={styles.buttonText}>
              {
              calculate ? 
                'Calculate'
              : 
                price > 0 ? 
                  'Ship From $'+price : 
                  price < 0 ? 
                    'Courier not exists' : 
                    'Calculate'
              }
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.couriersContainer}>

        { 
          couriers.length > 0 ? 
            couriers[0].map((courier, index) => <Courier key={index} name={courier.NAME} price={courier.PRICE} />) 
            :
            <Text>empty</Text>
        }

      </View>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BCFAAE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  couriersContainer: {
    display: 'flex',
    backgroundColor: 'red',
  },
  headingText: {
    fontSize: 37,
  },
  form: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
    marginStart: 'auto',
    marginEnd: 'auto',
    gap: 8,
  },
  fieldset: {
    display: 'flex',
    flexDirection: 'row-reverse',
    width: '95%',
    height: 50,
  },
  label: {
    fontSize: 20,
    lineHeight: 30,
    width: '36%',
    height: 40,
    marginTop: 10,
  },
  textinputCode: {
    fontSize: 20,
    backgroundColor: '#ffffff',
    width: '45%',
    height: 40,
    marginTop: 10,
    marginBottom: 10,
    marginStart: 15,
    padding: 1,
    textAlign: 'center',
    borderRadius: 7,
    borderColor: '#333333',
    borderWidth: 1,
  },
  textinput: {
    fontSize: 20,
    backgroundColor: '#ffffff',
    width: '54%',
    height: 40,
    marginTop: 10,
    marginBottom: 10,
    marginStart: 15,
    marginEnd: 15,
    padding: 5,
    textAlign: 'center',
    borderRadius: 7,
    borderColor: '#333333',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#000000',
    color: '#ffffff',
    maxWidth: '90%',
    width: '90%',
    marginTop: 10,
    marginStart: 15,
    marginEnd: 15,
    padding: 5,
    borderRadius: 7,
  },
  buttonView: {
    color: '#ffffff',
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    lineHeight: 38,
  }
});
