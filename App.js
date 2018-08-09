import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, Picker, Slider, Alert, Arrays, Button, TouchableOpacity } from 'react-native';
import { Table, TableWrapper, Row, Col, Cell } from 'react-native-table-component';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Data1 from './components/Data/Data1.json';
import Data2 from './components/Data/Data2.json';
import Data3 from './components/Data/Data3.json';
import Login from './components/Screens/Login';

export default class App extends Component {
  constructor(props) {
    super(props);
    //start in login page when app is launched
    this.state = {
      show_login:true,
      show_select:false,
      show_plate:false,
      Data:'',

    }
  }

//show login page again when user logs out
onLogoutPress = () => {
  this.setState({show_select:false});
  this.setState({show_login:true});
  this.setState({show_plate:false});
}

//goes to plate selection page when user logs in
onLoginPress = () => {
  this.setState({show_select:true});
  this.setState({show_login:false});
  this.setState({show_plate:false});
}

//navigates to whichever plate is selected
onPlateSelect = () =>{
  this.setState({show_select:false});
  this.setState({show_login:false});
  this.setState({show_plate:true});
}

render() {
  const{Data, show_login, show_plate, show_select} = this.state;
  if(show_login)
    return(
        <Login onLoginPress = {this.onLoginPress}/>
      )
  else if(show_select)
    return(

      <View style = {{ flex: 1 }}>
        <View style = {{alignItems: 'flex-start', paddingTop: 20}}>
          <Button onPress={this.onLogoutPress}
          title="< Logout">
          </Button>
        </View>
        <View style = {{alignItems: 'center', justifyContent: 'center', paddingTop: 250}}>
          <Text style = {{fontSize: 50, fontWeight: 'bold', paddingBottom: 30}}>
            Demo Examples
          </Text>
          <TouchableOpacity
            onPress={() => {this.setState({Data:Data1}); this.onPlateSelect()}}
            style = {{marginRight:2,
                      marginLeft:2,
                      marginTop:10,
                      paddingTop:10,
                      paddingBottom:10,
                      backgroundColor:'#ADD8E6',
                      borderRadius:10,
                      borderWidth: 1,
                      borderColor: '#fff',
                      width: 300,
                      alignItems: 'center'
                    }}
            >
              <Text style = {{fontSize: 30}}>
                96 Well Plate
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {this.setState({Data:Data2}); this.onPlateSelect()}}
              style = {{marginRight:2,
                        marginLeft:2,
                        marginTop:10,
                        paddingTop:10,
                        paddingBottom:10,
                        backgroundColor:'#ADD8E6',
                        borderRadius:10,
                        borderWidth: 1,
                        borderColor: '#fff',
                        width: 300,
                        alignItems: 'center'
                      }}
              >
                <Text style = {{fontSize: 30}}>
                  96 Well Plate with Attributes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {this.setState({Data:Data3}); this.onPlateSelect()}}
                style = {{marginRight:2,
                          marginLeft:2,
                          marginTop:10,
                          paddingTop:10,
                          paddingBottom:10,
                          backgroundColor:'#ADD8E6',
                          borderRadius:10,
                          borderWidth: 1,
                          borderColor: '#fff',
                          width: 300,
                          alignItems: 'center'
                        }}
                >
                  <Text style = {{fontSize: 30}}>
                    384 Well Plate
                  </Text>
                </TouchableOpacity>
              </View>
    </View>

    )
  else if(show_plate)
    return(
        <Plate  Data={Data} onLoginPress = {this.onLoginPress}/>
    )
}
}



class Plate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      widthArr: [],
      attr_sel: 0,
      tableTitle: [],
      value: 0,
      real: false,
      varchar: false,
      multiSliderValue: [0, 10],
      highlight: false,
      sourcePlates: false,
      sourceWells: false,
      selectedWell: null,
      selectedPlate: null,
      selectedVarChar: null,
    }

    this.expectedValue = this.expectedValue.bind(this);
    this.setWidth = this.setWidth.bind(this);
    this.getAttributes = this.getAttributes.bind(this);
    this.multiSliderValuesChange = this.multiSliderValuesChange.bind(this);
    this.getSourcePlates = this.getSourcePlates.bind(this);
    this.getWellInfo = this.getWellInfo.bind(this);
    this.expectedPosition = this.expectedPosition.bind(this);
    this.getVarChars = this.getVarChars.bind(this);
  }

//gets all info about a well when it is clicked
  getWellInfo(index, cellIndex){
    const {Data} = this.props;
    const cols = Data.COLUMN_EXTENT;
    const realIndex = index*cols+cellIndex-1;
    const wellKeys = Object.keys(Data.wells);
    if(cellIndex != 0){
      const keys = Object.keys(Data.wells[wellKeys[realIndex]]);
      let attNames = [];
      let attValues = [];
      let display = [];

      if(Data.wells[wellKeys[realIndex]].POSITION == this.expectedPosition(realIndex)){

        attNames.push('CLONE ID: ', 'POSITION: ', 'EMPTY: ');

        attValues.push(Data.wells[wellKeys[realIndex]].CLONE_ID);
        attValues.push(Data.wells[wellKeys[realIndex]].POSITION);
        if(Data.wells[wellKeys[realIndex]].EMPTY != null){
          attValues.push('Yes');
        }
        else{
          attValues.push('No');
        }

        if(Object.keys(Data.wells[wellKeys[realIndex]]).indexOf('ATTRIBUTES') > -1 ){
          const attKeys = Object.keys(Data.wells[wellKeys[realIndex]].ATTRIBUTES);

          for(let i=0; i<attKeys.length; i++){
            attNames.push(`${attKeys[i]}${':   '}`);
          }
          for(let i=0; i<attKeys.length; i++){
            if (typeof Data.wells[wellKeys[realIndex]].ATTRIBUTES[attKeys[i]] != 'undefined'){
              attValues.push(Data.wells[wellKeys[realIndex]].ATTRIBUTES[attKeys[i]].VALUE);
            }
          }
        }
      }
      else{
        for(let i=0; i<wellKeys.length; i++){
          if(Data.wells[wellKeys[i]].POSITION == this.expectedPosition(realIndex)){

            attNames.push('CLONE ID: ', 'POSITION: ', 'EMPTY: ');
            attValues.push(Data.wells[wellKeys[i]].CLONE_ID);
            attValues.push(Data.wells[wellKeys[i]].POSITION);
            if(Data.wells[wellKeys[i]].EMPTY != null){
              attValues.push('Yes');
            }
            else{
              attValues.push('No');
            }
            if(Object.keys(Data.wells[wellKeys[i]]).indexOf('ATTRIBUTES') > -1){
              const attKeys = Object.keys(Data.wells[wellKeys[i]].ATTRIBUTES);
              for(let i=0; i<attKeys.length; i++){
                attNames.push(`${attKeys[i]}${': '}`);
              }
              for(let j=0; j<attKeys.length; j++){
                if (typeof Data.wells[wellKeys[i]].ATTRIBUTES[attKeys[j]] != 'undefined'){
                  attValues.push(Data.wells[wellKeys[i]].ATTRIBUTES[attKeys[j]].VALUE);
                }
              }
            }
          }
        }
      }
      for(let i=0; i<attValues.length; i++){
        display.push(`${attNames[i]}${attValues[i]}`,'\n');
      }

      Alert.alert("Well Info" + '\n', display.join('\n'));
    }

  }

//sets width based on size of plate
  setWidth(row, col){
    if (row*col == 96){
      for (let i=0; i<=col; i++){
        this.state.widthArr[i]='8%';
      }
    }
    else if (row*col == 384){
      for (let i=0; i<=col; i++){
        this.state.widthArr[i]='4.2%';
      }
    }
  }

//checks for correct position (used only for getWellInfo function)
  expectedPosition(index){
    const {Data} = this.props;
    const col = index%Data.COLUMN_EXTENT + 1;
    const row = String.fromCharCode(65 + index/Data.COLUMN_EXTENT);
    let expPos = `${row}${col}`;
    return expPos;
  }

//keeps track of which well is expected to be next in the main loop
  expectedValue(letter, number){
    let expV = `${letter}${number+1}`;
    return expV;
  }

//gets all source plates within a set of data
  getSourcePlates(numRows, numCols){
    const {Data} = this.props;
    let tempSourcePlates = new Array();
    let sourcePlates = new Array();
    const wellKeys = Object.keys(Data.wells);
    for(let i=0; i<numRows*numCols; i++){
      if(Object.keys(Data.wells[wellKeys[i]]).indexOf('ATTRIBUTES') > -1 ){
        const attKeys = Object.keys(Data.wells[wellKeys[i]].ATTRIBUTES);
        for(let j=0; j<attKeys.length; j++){
          if(JSON.stringify(attKeys[j]).includes('Source Plate')){
            tempSourcePlates.push(Data.wells[wellKeys[i]].ATTRIBUTES[attKeys[j]].VALUE)
          }
        }
        if(sourcePlates.length != 0){
          const result = tempSourcePlates.filter(function(item){ return sourcePlates.indexOf(item) == -1 });
          sourcePlates = [...sourcePlates, ...result];
        }
        else{
          sourcePlates = [...tempSourcePlates];
        }
      }
    }
    return sourcePlates;
  }

//gets all source wells within data
  getSourceWells(numRows, numCols){
    const {Data} = this.props;
    let tempSourceWells = new Array();
    let sourceWells = new Array();
    const wellKeys = Object.keys(Data.wells);
    for(let i=0; i<numRows*numCols; i++){
      if(Object.keys(Data.wells[wellKeys[i]]).indexOf('ATTRIBUTES') > -1 ){
        const attKeys = Object.keys(Data.wells[wellKeys[i]].ATTRIBUTES);
        for(let j=0; j<attKeys.length; j++){
          if(JSON.stringify(attKeys[j]).includes('Source Well')){
            tempSourceWells.push(Data.wells[wellKeys[i]].ATTRIBUTES[attKeys[j]].VALUE)
          }
        }
        if(sourceWells.length != 0){
          const result = tempSourceWells.filter(function(item){ return sourceWells.indexOf(item) == -1 });
          sourceWells = [...sourceWells, ...result];
        }
        else{
          sourceWells = [...tempSourceWells];
        }
      }
    }
    return sourceWells;
  }

//creates buttons for attributes of type VARCHAR
  getVarChars(numRows, numCols){
    const {Data} = this.props;
    let tempVars = new Array();
    let varChars = new Array();
    const wellKeys = Object.keys(Data.wells);
    for(let i=0; i<numRows*numCols; i++){
      if(Object.keys(Data.wells[wellKeys[i]]).indexOf('ATTRIBUTES') > -1 ){
        const attKeys = Object.keys(Data.wells[wellKeys[i]].ATTRIBUTES);
        for(let j=0; j<attKeys.length; j++){
          if(Data.wells[wellKeys[i]].ATTRIBUTES[attKeys[j]].TYPE == 'VARCHAR' && !(JSON.stringify(attKeys[j]).includes('Source'))){
            tempVars.push(Data.wells[wellKeys[i]].ATTRIBUTES[attKeys[j]].VALUE)
          }
        }
        if(varChars.length != 0){
          const result = tempVars.filter(function(item){ return varChars.indexOf(item) == -1 });
          varChars = [...varChars, ...result];
        }
        else{
          varChars = [...tempVars];
        }
      }
    }
    return varChars;
  }

//gets all unique attribute names
  getAttributes(numRows, numCols){
    const {Data} = this.props;
    var attributes = new Array();
    const wellKeys = Object.keys(Data.wells);
    for (let i=0; i<numRows*numCols; i++){
      const attKeys = Object.keys(Data.wells[wellKeys[i]].ATTRIBUTES);

      if(attributes.length != 0){
        const result = attKeys.filter( function(item){ return attributes.indexOf(item) == -1 });
        attributes = [...attributes, ...result];
      }
      else{
        attributes = [...attKeys];
      }
    }
    return attributes;
  }

//gets maximum of all values inside the table for the selected attribute
  findmax = (tableData) => {
    let max = 0;
    tableData.map(function(row)
                    {row.map(
                        function(element){
                          if (parseFloat(element) > max)
                            max = parseFloat(element);
                        })});
    return(max);
  }

//gets minimum of all values inside the table for the selected attribute
  findmin = (tableData) => {
      let min = 1000;
      tableData.map(function(row)
                      {row.map(
                          function(element){
                            if (parseFloat(element) < min)
                              min = parseFloat(element);
                          })});
      return(min);
  }

//sets state when the slider bar range is changed
  multiSliderValuesChange(values){
    this.setState({
      multiSliderValue: values,
    });
  }

//supposed to ping the LIMS server (doesn't work)
  // componentDidMount(){
  //   fetch(`https://limssd.na.am.lilly.com/~bioinfo/secure/login.php`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      // body: JSON.stringify({
      //   submit: 'Login',
      //   try_password: 'Day@02161993',
      //   try_sid: 'prod',
      //   win_username: 'c269317'
      // }).replace(/{|}/gi,"")
    //})
  //   .then((response) => response.json())
  //   .then((responseJson) => {
  //     console.log(responseJson);
  //     return responseJson;
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });
    // fetch('https://limssd.na.am.lilly.com/discovery/json_plate.php?plate_name=aBCMA01.1SC14')
    // fetch('https://jsonplaceholder.typicode.com/todos/1')
    // .then((response) => response.json())
    // .then((responseJson) => {
    //   console.log(responseJson);
    //   return responseJson;
    // })
    // .catch((error) => {
    //   console.error(error);
    // });
  //}

  render() {
    const {Data} = this.props;
    let atts = [];
    const state = this.state;
    const tableData = [];
    const tableHead = [];
    const tableTitle = [];
    const rows = parseInt(this.props.Data.ROW_EXTENT);
    const cols = parseInt(this.props.Data.COLUMN_EXTENT);
    const attReal = [];
    const attVar = [];
    const sourcePlate = [];
    const sourceWell = [];
    let attHighlight = [];
    wellKeys = Object.keys(Data.wells);
    let count = 0;

    this.setWidth(rows, cols);

    tableHead[0]='  ';
    for(let i=1; i<=cols; i++){
      tableHead.push(i);
    }

    let letter_counter = 65;
    let data_counter = 0;
    var choices = [];


    for (let i = 0; i < wellKeys.length; i+=cols) {
      const rowData = [];

      asc = String.fromCharCode(letter_counter);
      rowData.push(asc);

      for (let j = 0; j < cols; j ++) {
        choices = [];
        // if(Data.wells[wellKeys[data_counter]].ATTRIBUTES != 'undefined'){}
        let pos = Data.wells[wellKeys[data_counter]].POSITION;
        let cl_id = Data.wells[wellKeys[data_counter]].CLONE_ID;
        //if position of next element is in order
        if(pos == this.expectedValue(asc, j)){
          //clone ID
          choices.push(cl_id);
          attReal.push(false);
          attVar.push(false);
          sourcePlate.push(false);
          sourceWell.push(false);

          if(Data.wells[wellKeys[data_counter]].EMPTY == null){
          //Empty?
            choices.push('N');
            attReal.push(false);
            attVar.push(false);
            sourcePlate.push(false);
            sourceWell.push(false);
          }else{
            choices.push('Y');
            attReal.push(false);
            attVar.push(false);
            sourcePlate.push(false);
            sourceWell.push(false);
          }

          if(Object.keys(Data.wells[wellKeys[data_counter]]).indexOf('ATTRIBUTES') > -1){
            atts = this.getAttributes(rows, cols);
            let attKeys = Object.keys(Data.wells[wellKeys[data_counter]].ATTRIBUTES);

            for(let n = 0; n<atts.length; n++){
              let attVal;
              if(Data.wells[wellKeys[data_counter]].ATTRIBUTES[atts[n]]){
                if(Data.wells[wellKeys[data_counter]].ATTRIBUTES[atts[n]].TYPE == 'REAL'){
                  attVal = Number.parseFloat(Data.wells[wellKeys[data_counter]].ATTRIBUTES[atts[n]].VALUE).toFixed(2);
                  attReal.push(true);
                  attVar.push(false);
                  sourcePlate.push(false);
                  sourceWell.push(false);
                }
                else if (Data.wells[wellKeys[data_counter]].ATTRIBUTES[atts[n]].TYPE == 'VARCHAR' && !(JSON.stringify(atts[n]).includes('Source'))){
                  attVal = Data.wells[wellKeys[data_counter]].ATTRIBUTES[atts[n]].VALUE;
                  attReal.push(false);
                  attVar.push(true);
                  sourcePlate.push(false);
                  sourceWell.push(false);
                }
                else if (JSON.stringify(atts[n]).includes('Source Plate')){
                  attVal = Data.wells[wellKeys[data_counter]].ATTRIBUTES[atts[n]].VALUE;
                  attReal.push(false);
                  attVar.push(false);
                  sourcePlate.push(true);
                  sourceWell.push(false);
                }
                else if (JSON.stringify(atts[n]).includes('Source Well')){
                  attVal = Data.wells[wellKeys[data_counter]].ATTRIBUTES[atts[n]].VALUE;
                  attReal.push(false);
                  attVar.push(false);
                  sourcePlate.push(false);
                  sourceWell.push(true);
                }
                // else{
                //   attVal = Data.wells[wellKeys[data_counter]].ATTRIBUTES[attKeys[n]].VALUE;
                //   attReal.push(false);
                //   attVar.push(false);
                //   sourcePlate.push(false);
                //   sourceWell.push(false);
                // }
              }
              else{
                attVal = 'None';
                attReal.push(false);
                attVar.push(false);
                sourcePlate.push(false);
                sourceWell.push(false);
              }
              choices.push(attVal);
            }
          }


          rowData.push(choices[this.state.attr_sel]);
          data_counter++;
        }

        else{
          //Grabs the empty wells at the end of the data
          for(let z = 0; z<wellKeys.length; z++){
            if(Data.wells[wellKeys[z]].POSITION == this.expectedValue(asc, j)){

              choices.push(Data.wells[wellKeys[z]].CLONE_ID);
              attReal.push(false);
              attVar.push(false);
              sourcePlate.push(false);
              sourceWell.push(false);

              choices.push('Y');
              attReal.push(false);
              attVar.push(false);
              sourcePlate.push(false);
              sourceWell.push(false);
              if(Object.keys(Data.wells[wellKeys[z]]).indexOf('ATTRIBUTES')>-1){
                atts = this.getAttributes(rows, cols)
                for(let x = 0; x<atts.length; x++){

                  let attKeys = Object.keys(Data.wells[wellKeys[z]].ATTRIBUTES);
                  let attVal;
                  if(Data.wells[wellKeys[z]].ATTRIBUTES[atts[x]]){
                    if(Data.wells[wellKeys[z]].ATTRIBUTES[atts[x]].TYPE == 'REAL'){
                      attVal = Number.parseFloat(Data.wells[wellKeys[z]].ATTRIBUTES[atts[x]].VALUE).toFixed(2);
                      attReal.push(true);
                      attVar.push(false);
                      sourcePlate.push(false);
                      sourceWell.push(false);
                    }
                    else if (Data.wells[wellKeys[z]].ATTRIBUTES[atts[x]].TYPE == 'VARCHAR' && !(JSON.stringify(atts[x]).includes('Source'))){
                      attVal = Data.wells[wellKeys[z]].ATTRIBUTES[atts[x]].VALUE;
                      attReal.push(false);
                      attVar.push(true);
                      sourcePlate.push(false);
                      sourceWell.push(false);
                    }
                    else if (JSON.stringify(atts[n]).includes('Source Plate')){
                      attVal = Data.wells[wellKeys[z]].ATTRIBUTES[atts[x]].VALUE;
                      attReal.push(false);
                      attVar.push(false);
                      sourcePlate.push(true);
                      sourceWell.push(false);
                    }
                    else if (JSON.stringify(atts[n]).includes('Source Well')){
                      attVal = Data.wells[wellKeys[z]].ATTRIBUTES[atts[x]].VALUE;
                      attReal.push(false);
                      attVar.push(false);
                      sourcePlate.push(false);
                      sourceWell.push(true);
                    }
                    // else{
                    //   attVal = Data.wells[wellKeys[z]].ATTRIBUTES[attKeys[x]].VALUE;
                    //   attReal.push(false);
                    //   attVar.push(false);
                    //   sourcePlate.push(false);
                    //   sourceWell.push(false);
                    // }
                  }
                  else{
                    attVal = 'None';
                    attReal.push(false);
                    attVar.push(false);
                    sourcePlate.push(false);
                    sourceWell.push(false);
                  }
                  choices.push(attVal);
                }
              }
            }
          }
          rowData.push(choices[this.state.attr_sel]);
        }

      }
      tableData.push(rowData);
      letter_counter++;
    }


    const pickeritems = atts.map((a,i)=>
      <Picker.Item key ={i} label={a} value = {(i+2).toString()}  />
    );



    let sourceWells = this.getSourceWells(rows, cols);
    const wellButtons = sourceWells.map((a, i) =>
      <TouchableOpacity
          key = {i}
          style={buttonStyles.loginScreenButton}
          onPress={() => this.setState({
            selectedWell: JSON.stringify(a)
          })}
          underlayColor='#fff'>
          <Text style={buttonStyles.submitText}> {a} </Text>
       </TouchableOpacity>
    );

    let sourcePlates = this.getSourcePlates(rows, cols);
    const plateButtons = sourcePlates.map((a, i) =>
      <TouchableOpacity
          key = {i}
          style={buttonStyles.loginScreenButton}
          onPress={() => {this.setState({
            selectedPlate: JSON.stringify(a)
          })
        }}
          underlayColor='#fff'>
          <Text style={buttonStyles.submitText}> {a} </Text>
       </TouchableOpacity>
    );

    let varChars = this.getVarChars(rows, cols);
    const varcharButtons = varChars.map((a, i) =>
    <TouchableOpacity
        key = {i}
        style={buttonStyles.loginScreenButton}
        onPress={() => {this.setState({
          selectedVarChar: JSON.stringify(a)
        })
      }}
        underlayColor='#fff'>
        <Text style={buttonStyles.submitText}> {a} </Text>
     </TouchableOpacity>
    )

    for(let i=0; i<tableData.length; i++){
      const rowData = tableData[i];
      for(let j=0; j<rowData.length; j++){
        const cellData = rowData[j];
        if((parseFloat(cellData) >= this.state.multiSliderValue[0] && parseFloat(cellData) <= this.state.multiSliderValue[1] && this.state.real) || (JSON.stringify(cellData) == this.state.selectedWell && this.state.sourceWells == true) || (JSON.stringify(cellData) == this.state.selectedPlate &&
        this.state.sourcePlates == true) || JSON.stringify(cellData) == this.state.selectedVarChar && this.state.varchar == true){
          count++;
        }
      }
    }

    let styles;

    if(Data.ROW_EXTENT*Data.COLUMN_EXTENT == 384){
      styles = StyleSheet.create({
        container: { flex: 1, paddingLeft: 16, paddingRight: 50, paddingTop: 30, backgroundColor: '#fff'},
        //container: {height: '100%', width: '100%'},
        header: { backgroundColor: 'white', height: 45 },
        headerText: { textAlign: 'center', fontWeight: 'bold', fontSize: 20 },
        title: { backgroundColor: 'white', flex: 1 },
        cellText: { textAlign: 'center', fontSize: 10 },
        dataWrapper: { marginTop: -1 },
        row: { flexDirection: 'row', backgroundColor: '#FFF1C1'},
        btnText: { textAlign: 'center', color: '#fff' },
        cell_high: { flex:1, backgroundColor: 'yellow', height: 45},
        cell_low: {flex:1, backgroundColor: 'white', height: 45}
      });
    }
    else{
      styles = StyleSheet.create({
        container: { flex: 1, paddingLeft: 16, paddingRight: 50, paddingTop: 30, backgroundColor: '#fff'},
        //container: {height: '100%', width: '100%'},
        header: { backgroundColor: 'white', height: 75 },
        headerText: { textAlign: 'center', fontWeight: 'bold', fontSize: 20 },
        title: { backgroundColor: 'white', flex: 1 },
        cellText: { textAlign: 'center', fontSize: 20 },
        dataWrapper: { marginTop: -1 },
        row: { flexDirection: 'row', backgroundColor: '#FFF1C1'},
        btnText: { textAlign: 'center', color: '#fff' },
        cell_high: { flex:1, backgroundColor: 'yellow', height: 75},
        cell_low: {flex:1, backgroundColor: 'white', height: 75}
      });
    }


    return (
      <ScrollView style={styles.container}>
        <View style = {{alignItems: 'flex-start'}}>
          <Button onPress={this.props.onLoginPress}
          title="< Back">
          </Button>
        </View>
        <View >
          <View style = {{resizeMode: 'contain'}}>
            <Table borderStyle={{borderColor: '#C1C0B9'}}>
              <Row data={tableHead}  style={styles.header} textStyle={styles.headerText} />
            </Table>
            <View style = {styles.dataWrapper}>
              <Table borderStyle={{borderColor: '#C1C0B9'}} >
                {
                  tableData.map((rowData, index) => (
                    <TableWrapper key={index} style={styles.row}>
                      {
                        rowData.map((cellData, cellIndex) => (
                          <Cell key = {cellIndex} data = {cellData} style = {
                            typeof cellData == 'string' && cellData.length == 1 && cellData != 'Y' && cellData != 'N' ? styles.title :
                          (parseFloat(cellData) >= this.state.multiSliderValue[0] && parseFloat(cellData) <= this.state.multiSliderValue[1]
                            && this.state.real) || JSON.stringify(cellData) == this.state.selectedWell && this.state.sourceWells == true || JSON.stringify(cellData) == this.state.selectedPlate &&
                            this.state.sourcePlates == true || JSON.stringify(cellData) == this.state.selectedVarChar && this.state.varchar == true ? styles.cell_high : styles.cell_low
                          }
                          //if cell title
                          textStyle = {typeof cellData == 'string' && cellData.length == 1 && cellIndex == 0 ? styles.headerText : styles.cellText}
                          onPress={ () => this.getWellInfo(index, cellIndex)}/>
                          //onPress = {() => alert(cellIndex)}/>
                        ))
                      }
                    </TableWrapper>
                  ))
                }
              </Table>
              <View style={{flexDirection: 'row'}}>
                {/* PICKER */}
                <Picker
                  selectedValue={this.state.attr_sel}
                  style={{ height: 10, flex:2 }}
                  onValueChange={(itemValue, itemIndex) => {this.setState({
                    attr_sel: itemValue,
                    real: attReal[itemIndex],
                    varchar: attVar[itemIndex],
                    sourcePlates: sourcePlate[itemIndex],
                    sourceWells: sourceWell[itemIndex],
                    highlight: attHighlight[itemIndex]
                    });
                  }}>
                  <Picker.Item label="Clone ID" value= "0" />
                  <Picker.Item label="Empty?" value= "1" />
                  {pickeritems}
                </Picker>
                {/* SLIDER */}
                <View style = {{ flex:2 }}>
                  {this.state.real && this.findmin(tableData) != this.findmax(tableData)
                  ?
                  <View style = {{ alignItems: 'center' }}>
                    <MultiSlider
                      values={[this.state.multiSliderValue[0], this.state.multiSliderValue[1]]}
                      onValuesChange={this.multiSliderValuesChange}
                      min={this.findmin(tableData)}
                      max={this.findmax(tableData)}
                      step={0.001}
                      allowOverlap
                      snapped
                    />
                    <Text>
                      Min: {Number.parseFloat(this.state.multiSliderValue[0]).toFixed(2)}                                           Max: {Number.parseFloat(this.state.multiSliderValue[1]).toFixed(2)}
                    </Text>
                  </View>
                  :
                    <Text>

                    </Text>
                  }
                  {this.state.sourcePlates
                  ?
                    <View style = {{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {plateButtons}
                    </View>
                   :
                     <Text>

                     </Text>
                   }
                   {this.state.sourceWells
                   ?
                     <View style = {{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                       {wellButtons}
                     </View>
                    :
                      <Text>

                      </Text>
                    }
                    {this.state.varchar
                    ?
                      <View style = {{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {varcharButtons}
                      </View>
                    :
                      <Text>

                      </Text>
                    }
                </View>
                <View style = {{ paddingTop: 20, flex:1, }}>
                  <Text style = {{fontWeight: 'bold', fontSize: 18}}>
                    Highlighted Wells: {count}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }
}



const buttonStyles = StyleSheet.create({
  loginScreenButton:{
    marginRight:2,
    marginLeft:2,
    marginTop:10,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:'#add8e6',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  loginText:{
      color: '#FFFFFF',
      textAlign:'center',
      paddingLeft : 10,
      paddingRight : 10
  }
});
