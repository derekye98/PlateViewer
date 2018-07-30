import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, Picker, Slider, Alert, Arrays, Button, TouchableOpacity } from 'react-native';
import { Table, TableWrapper, Row, Col, Cell } from 'react-native-table-component';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const Data = require('./data.json');

export default class Plate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      widthArr: [],
      attr_sel: 0,
      tableTitle: [],
      value: 0,
      real: false,
      atts: [],
      multiSliderValue: [0, 10],
      highlight: false,
      sourcePlates: false,
      sourceWells: false,
      selectedWell: null,
      selectedPlate: null,
    }

    this.expectedValue = this.expectedValue.bind(this);
    this.setWidth = this.setWidth.bind(this);
    this.getAttributes = this.getAttributes.bind(this);
    this.multiSliderValuesChange = this.multiSliderValuesChange.bind(this);
    this.getSourcePlates = this.getSourcePlates.bind(this);
    this.getWellInfo = this.getWellInfo.bind(this);
    this.expectedPosition = this.expectedPosition.bind(this);
  }


  getWellInfo(index, cellIndex){
    const cols = Data.COLUMN_EXTENT;
    const realIndex = index*cols+cellIndex-1;
    const wellKeys = Object.keys(Data.wells);
    const keys = Object.keys(Data.wells[wellKeys[realIndex]]);
    let attNames = [];
    let attValues = [];
    let display = [];

    if(Data.wells[wellKeys[realIndex]].POSITION == this.expectedPosition(realIndex)){
      const attKeys = Object.keys(Data.wells[wellKeys[realIndex]].ATTRIBUTES);

      attNames.push('CLONE ID: ', 'POSITION: ', 'EMPTY: ');
      for(let i=0; i<attKeys.length; i++){
        attNames.push(`${attKeys[i]}${': '}`);
      }

      attValues.push(Data.wells[wellKeys[realIndex]].CLONE_ID);
      attValues.push(Data.wells[wellKeys[realIndex]].POSITION);
      if(Data.wells[wellKeys[realIndex]].EMPTY != null){
        attValues.push('Yes');
      }
      else{
        attValues.push('No');
      }
      for(let i=0; i<attKeys.length; i++){
        if (typeof Data.wells[wellKeys[realIndex]].ATTRIBUTES[attKeys[i]] != 'undefined'){
          attValues.push(Data.wells[wellKeys[realIndex]].ATTRIBUTES[attKeys[i]].VALUE);
        }
      }
    }
    else{
      for(let i=0; i<wellKeys.length; i++){
        if(Data.wells[wellKeys[i]].POSITION == this.expectedPosition(realIndex)){
          const attKeys = Object.keys(Data.wells[wellKeys[i]].ATTRIBUTES);

          attNames.push('CLONE ID: ', 'POSITION: ', 'EMPTY: ');
          for(let i=0; i<attKeys.length; i++){
            attNames.push(`${attKeys[i]}${': '}`);
          }

          attValues.push(Data.wells[wellKeys[i]].CLONE_ID);
          attValues.push(Data.wells[wellKeys[i]].POSITION);
          if(Data.wells[wellKeys[i]].EMPTY != null){
            attValues.push('Yes');
          }
          else{
            attValues.push('No');
          }
          for(let j=0; j<attKeys.length; j++){
            attValues.push(Data.wells[wellKeys[i]].ATTRIBUTES[attKeys[j]].VALUE);
          }
        }
      }
    }
    for(let i=0; i<attValues.length; i++){
      display.push(`${attNames[i]}${attValues[i]}`,"\n");
    }
    alert(display);

  }

  setWidth(col){
    for (let i=0; i<=col; i++){
      this.state.widthArr[i]=100;
    }
  }

  expectedPosition(index){
    const col = index%Data.COLUMN_EXTENT + 1;
    const row = String.fromCharCode(65 + index/Data.COLUMN_EXTENT);
    let expPos = `${row}${col}`;
    return expPos;
  }

  expectedValue(letter, number){
    let expV = `${letter}${number+1}`;
    return expV;
  }

  getSourcePlates(numRows, numCols){
    let tempSourcePlates = new Array();
    let sourcePlates = new Array();
    const wellKeys = Object.keys(Data.wells);
    for(let i=0; i<numRows*numCols; i++){
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
    return sourcePlates;
  }

  getSourceWells(numRows, numCols){
    let tempSourceWells = new Array();
    let sourceWells = new Array();
    const wellKeys = Object.keys(Data.wells);
    for(let i=0; i<numRows*numCols; i++){
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
    return sourceWells;
  }

  getAttributes(numRows, numCols){
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

  multiSliderValuesChange(values){
    this.setState({
      multiSliderValue: values,
    });
  }

  render() {
    let atts = this.state;
    const state = this.state;
    const tableData = [];
    const tableHead = [];
    const tableTitle = [];
    const rows = Data.ROW_EXTENT;
    const cols = Data.COLUMN_EXTENT;
    const attReal = [];
    const sourcePlate = [];
    const sourceWell = [];
    let attHighlight = [];
    wellKeys = Object.keys(Data.wells);
    let count = 0;


    this.setWidth(cols);
    atts = this.getAttributes(rows, cols);

    tableHead[0]='  ';
    for(let i=1; i<=cols; i++){
      tableHead.push(i);
    }

    let letter_counter = 65;
    let data_counter = 0;
    var choices = [];
    for (let i = 0; i < wellKeys.length; i+=12) {
      const rowData = [];

      asc = String.fromCharCode(letter_counter);
      rowData.push(asc);

      for (let j = 0; j < cols; j ++) {
        choices = [];
        let attKeys = Object.keys(Data.wells[wellKeys[data_counter]].ATTRIBUTES);
        let pos = Data.wells[wellKeys[data_counter]].POSITION;
        let cl_id = Data.wells[wellKeys[data_counter]].CLONE_ID;

        //if position of next element is in order
        if(pos == this.expectedValue(asc, j)){
          //clone ID
          choices.push(cl_id);
          attReal.push(false);
          sourcePlate.push(false);
          sourceWell.push(false);

          if(Data.wells[wellKeys[data_counter]].EMPTY == null){
          //Empty?
            choices.push('N');
            attReal.push(false);
            sourcePlate.push(false);
            sourceWell.push(false);
          }else{
            choices.push('Y');
            attReal.push(false);
            sourcePlate.push(false);
            sourceWell.push(false);
          }

          for(let n = 0; n<atts.length; n++){
            let attVal;
            if(typeof Data.wells[wellKeys[data_counter]].ATTRIBUTES[attKeys[n]] != 'undefined'){
              if(Data.wells[wellKeys[data_counter]].ATTRIBUTES[attKeys[n]].TYPE == 'REAL'){
                attVal = Number.parseFloat(Data.wells[wellKeys[data_counter]].ATTRIBUTES[attKeys[n]].VALUE).toFixed(2);
                attReal.push(true);
                sourcePlate.push(false);
                sourceWell.push(false);
              }
              else if (JSON.stringify(attKeys[n]).includes('Source Plate')){
                attVal = Data.wells[wellKeys[data_counter]].ATTRIBUTES[attKeys[n]].VALUE;
                attReal.push(false);
                sourcePlate.push(true);
                sourceWell.push(false);
              }
              else if (JSON.stringify(attKeys[n]).includes('Source Well')){
                attVal = Data.wells[wellKeys[data_counter]].ATTRIBUTES[attKeys[n]].VALUE;
                attReal.push(false);
                sourcePlate.push(false);
                sourceWell.push(true);
              }
              else{
                attVal = Data.wells[wellKeys[data_counter]].ATTRIBUTES[attKeys[n]].VALUE;
                attReal.push(false);
                sourcePlate.push(false);
                sourceWell.push(false);
              }
            }
            else{
              attVal = 'DNE';
              attReal.push(false);
              sourcePlate.push(false);
              sourceWell.push(false);
            }
            choices.push(attVal);
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
              sourcePlate.push(false);
              sourceWell.push(false);

              choices.push('Y');
              attReal.push(false);
              sourcePlate.push(false);
              sourceWell.push(false);

              for(let x = 0; x<atts.length; x++){

                if(typeof Data.wells[wellKeys[z]].ATTRIBUTES[attKeys[x]] != 'undefined'){
                  if(Data.wells[wellKeys[z]].ATTRIBUTES[attKeys[x]].TYPE == 'REAL'){
                    attVal = Number.parseFloat(Data.wells[wellKeys[z]].ATTRIBUTES[attKeys[x]].VALUE).toFixed(2);
                    attReal.push(true);
                    sourcePlate.push(false);
                    sourceWell.push(false);
                  }
                  else if (JSON.stringify(attKeys[n]).includes('Source Plate')){
                    attVal = Data.wells[wellKeys[data_counter]].ATTRIBUTES[attKeys[n]].VALUE;
                    attReal.push(false);
                    sourcePlate.push(true);
                    sourceWell.push(false);
                  }
                  else if (JSON.stringify(attKeys[n]).includes('Source Well')){
                    attVal = Data.wells[wellKeys[data_counter]].ATTRIBUTES[attKeys[n]].VALUE;
                    attReal.push(false);
                    sourcePlate.push(false);
                    sourceWell.push(true);
                  }
                  else{
                    attVal = Data.wells[wellKeys[z]].ATTRIBUTES[attKeys[x]].VALUE;
                    attReal.push(false);
                    sourcePlate.push(false);
                    sourceWell.push(false);
                  }
                }
                else{
                  attVal = 'DNE';
                  attReal.push(false);
                  sourcePlate.push(false);
                  sourceWell.push(false);
                }
                choices.push(attVal);
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

    for(let i=0; i<tableData.length; i++){
      const rowData = tableData[i];
      for(let j=0; j<rowData.length; j++){
        const cellData = rowData[j];
        if((parseFloat(cellData) >= this.state.multiSliderValue[0] && parseFloat(cellData) <= this.state.multiSliderValue[1] && this.state.real) || (JSON.stringify(cellData) == this.state.selectedWell) || (JSON.stringify(cellData) == this.state.selectedPlate)){
          count++;
        }
      }
    }

    return (
      <View style={styles.container}
      //   onLayout = {(event)=>{
      //   var{x,y,width,height} = event.nativeEvent.layout;
      //   if(width > height//landscape
      //   else //portriat
      //
      //   alert(JSON.stringify(event.nativeEvent.layout));
      // }}
      >
        <View >
          <View style = {{resizeMode: 'contain'}}>
            <Table borderStyle={{borderColor: '#C1C0B9'}}>
              <Row data={tableHead} widthArr={state.widthArr} style={styles.header} textStyle={styles.headerText} />
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
                            && this.state.real) || JSON.stringify(cellData) == this.state.selectedWell || JSON.stringify(cellData) == this.state.selectedPlate ? styles.cell_high : styles.cell_low
                          }
                          //if cell title
                          textStyle = {typeof cellData == 'string' && cellData.length == 1 && cellData != 'Y' && cellData != 'N' ? styles.headerText : styles.cellText}
                          onPress={() => this.getWellInfo(index, cellIndex)} />
                        ))
                      }
                    </TableWrapper>
                  ))
                }
              </Table>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                {/* PICKER */}
                <Picker
                  selectedValue={this.state.attr_sel}
                  style={{ height: 20, width: 400 }}
                  onValueChange={(itemValue, itemIndex) => {this.setState({
                    attr_sel: itemValue,
                    real: attReal[itemIndex],
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
                <View style = {{ width:600, height: 400, alignContent: 'center'}}>
                  {this.state.real && this.findmin(tableData) != this.findmax(tableData)
                  ?
                  <View style = {{justifyContent: 'center'}} >
                    <MultiSlider
                      values={[this.state.multiSliderValue[0], this.state.multiSliderValue[1]]}
                      sliderLength={400}
                      onValuesChange={this.multiSliderValuesChange}
                      min={this.findmin(tableData)}
                      max={this.findmax(tableData)}
                      step={0.001}
                      allowOverlap
                      snapped
                    />
                    <Text>
                      Min: {Number.parseFloat(this.state.multiSliderValue[0]).toFixed(2)}                                                               Max: {Number.parseFloat(this.state.multiSliderValue[1]).toFixed(2)}
                    </Text>
                  </View>
                  :
                    <Text>

                    </Text>
                  }
                  {this.state.sourcePlates
                  ?
                  <View style = {{flexDirection: 'row', width: 300, flexWrap: 'wrap', justifyContent: 'center'}}>
                      {plateButtons}
                  </View>
                   :
                   <Text>

                   </Text>
                 }
                 {this.state.sourceWells
                 ?
                 <View style = {{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
                   {wellButtons}
                 </View>
                  :
                  <Text>

                  </Text>
                }
                </View>
              <Text style = {{fontWeight: 'bold', fontSize: 20, paddingTop: 30}}>
                Highlighted Wells: {count}
              </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingLeft: 16, paddingRight: 50, paddingTop: 30, backgroundColor: '#fff' },
  header: { height: 80, backgroundColor: 'white' },
  title: { backgroundColor: 'white', height: 80, width: 100 },
  cellText: { textAlign: 'center' },
  headerText: { textAlign: 'center', fontWeight: 'bold', fontSize: 40 },
  dataWrapper: { marginTop: -1 },
  row: { flexDirection: 'row', backgroundColor: '#FFF1C1'},
  btnText: { textAlign: 'center', color: '#fff' },
  cell_high: {height: 80, width: 100, backgroundColor: 'yellow'},
  cell_low: {height: 80, width: 100, backgroundColor: 'white'}
});

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
