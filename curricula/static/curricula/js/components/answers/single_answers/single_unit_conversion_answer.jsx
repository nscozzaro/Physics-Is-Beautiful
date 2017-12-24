import React from 'react'
import {UnitConversionBase, ConversionTable, MathquillBox} from '../../../games/unit_conversion'

/* global MathQuill */

class UnitConversionCanvas extends UnitConversionBase {
  initialBoxes (props) {
    var spanBoxesIds = ['11', '21', '15']

    // for (var x=0; x < props.conversion_steps.length; x++){
    //   if (props.conversion_steps[x]['numerator'] &&
    //       props.conversion_steps[x]['denominator']){
    //     spanBoxesIds.push('1'+(x+1))
    //     spanBoxesIds.push('2'+(x+1))
    //   }
    // }

    for (var i = 0; i < spanBoxesIds.length; i++) {
      document.getElementById(spanBoxesIds[i]).classList.remove('green-border')
      document.getElementById(spanBoxesIds[i]).classList.remove('red-border')
      document.getElementById(spanBoxesIds[i]).style.pointerEvents = 'auto'
    }

    var MQ = MathQuill.getInterface(2)

    var numBox = MQ(document.getElementById('11'))
    var denumBox = MQ(document.getElementById('21'))
    var answerBox = MQ(document.getElementById('15'))

    if (props.unit_conversion_type === '10') { // fill right hand side
      // fist column reset
      this.setLatexWoFireEvent(numBox, '')
      this.setLatexWoFireEvent(denumBox, '')

      document.getElementById('15').style.pointerEvents = 'none'

      this.setState({
        answer: { 'data': props.answer, 'box': answerBox },
        numColumns: 1,
        answersSteps: [[
          {'data': '', 'box': MQ(document.getElementById('11'))},
          {'data': '', 'box': MQ(document.getElementById('21'))}
        ]] // column set by default
      }, function () {
        this.setLatexWoFireEvent(answerBox, props.answer)
      })
    }

    if (props.unit_conversion_type === '20') { // fill left hand side
      var answersSteps = []

      this.setLatexWoFireEvent(answerBox, '')

      // reset default column
      // document.getElementById('11').style.pointerEvents = 'none'
      // document.getElementById('21').style.pointerEvents = 'none'
      // if(x == 0){
      //        this.setLatexWoFireEvent(numBox, props.conversion_steps[x]['numerator'])
      //        this.setLatexWoFireEvent(denumBox, props.conversion_steps[x]['denominator'])
      //      } else (
      //
      //      )

      this.setState({
        // answersSteps: answersSteps,
        numColumns: props.conversion_steps.length
        // answersSteps: [[
        //   {'data': props.numerator, 'box': numBox},
        //   {'data': props.denominator, 'box': denumBox}
        // ]]
      }, function () {
        // numBox.latex(props.numerator)
        // denumBox.latex(props.denominator)

        for (var x = 0; x < props.conversion_steps.length; x++) {
          if (props.conversion_steps[x]['numerator'] &&
              props.conversion_steps[x]['denominator']) {
            answersSteps.push([
              {'data': props.conversion_steps[x]['numerator'], 'box': MQ(document.getElementById('1' + (x + 1)))},
              {'data': props.conversion_steps[x]['denominator'], 'box': MQ(document.getElementById('2' + (x + 1)))}
            ])

            this.setLatexWoFireEvent(answersSteps[x][0]['box'], answersSteps[x][0]['data'])
            this.setLatexWoFireEvent(answersSteps[x][1]['box'], answersSteps[x][1]['data'])
            answersSteps[x][0]['box'].__controller.container[0].style.pointerEvents = 'none'
            answersSteps[x][1]['box'].__controller.container[0].style.pointerEvents = 'none'
          }
        }
        this.setState({
          answersSteps: answersSteps,
          numColumns: answersSteps.length
        })
      })
    }

    if (props.unit_conversion_type === '30') { // no fill any side
      this.setState({
        answersSteps: []
      })
    }
  }

  componentDidMount () {
    this.initialBoxes(this.props)
  }

  componentWillReceiveProps (newProps) {
    if (newProps.uuid !== this.props.uuid) {
      this.props.updateAnswer(null)
      this.initialBoxes(newProps)
    }
  }

  updateExternalAnswer () {
    var answerSteps = this.state.answersSteps
    var conversionSteps = []

    if (this.props.unit_conversion_type === '20') {
      conversionSteps = this.props.conversion_steps
    } else {
      for (var x = 0; x < answerSteps.length; x++) {
        var numSplit = answerSteps[x][0]['splitData']
        var denSplit = answerSteps[x][1]['splitData']

        var numQty = null
        var denomQty = null

        if (numSplit) { numQty = this.getQtyFromSplitData(numSplit) }
        if (denSplit) { denomQty = this.getQtyFromSplitData(denSplit) }

        if (numQty && denomQty) {
          var baseCompareLst = this.getBaseFor2Qty(numQty, denomQty)
          conversionSteps.push(
            {
              'numerator': baseCompareLst[0],
              'denominator': baseCompareLst[1]
            })
        }
      }
    }

    // var numQty = null
    // var denomQty = null
    //
    // if (numSplit) { numQty = this.getQtyFromSplitData(numSplit) }
    // if (denSplit) { denomQty = this.getQtyFromSplitData(denSplit) }

    var answerSplit = null

    if (typeof this.state.answer !== 'undefined' && this.state.answer['box']) {
      answerSplit = this.constructor.parseToValueUnit(this.clearDataText(this.state.answer['box'].latex()))
    }

    if (answerSplit) {
      // var baseCompareLst = this.getBaseFor2Qty(numQty, denomQty)

      this.props.updateAnswer([
        this.props.uuid,
        {
          unit_conversion: {
            answer: answerSplit[0] + answerSplit[1],
            conversion_steps: conversionSteps
            // numerator: baseCompareLst[0],
            // denominator: baseCompareLst[1]
          }
        }
      ])
    }
  }

  // result answer change
  onResultChange (data, row, col, mathquillObj) {
    if (this.props.unit_conversion_type === '10') {
      this.setLatexWoFireEvent(mathquillObj, this.calculateAnswer()) // recalculate answer from lefside
    } else { // show num & denum
      this.setState({
        answer: {'data': data, 'box': mathquillObj}
      })
    }

    this.updateExternalAnswer()
  }

  calculateAnswer () {
    var numUnits = []
    var denomUnits = []

    var answerValue = this.props.number

    // exclude strikethrouth
    if (!this.state.strikethroughN) {
      numUnits.push(this.props.unit.split('/')[0])
    }
    if (!this.state.strikethroughD && this.props.unit.split('/').length > 1) {
      denomUnits.push(this.props.unit.split('/')[1])
    }

    var uncrossedUnits = Object.assign({}, this.state.uncrossedUnits)

    for (var x = 0; x < this.state.answersSteps.length; x++) {

      var numSplitData = this.state.answersSteps[x][0].splitData
      var numAnswerData = this.clearDataText(this.state.answersSteps[x][0].data).split(' ')[0]

      // test if it simple Number
      if (!numSplitData && (Number(numAnswerData) === Number(numAnswerData))) {
        numSplitData = [Number(numAnswerData)]
      }

      if (typeof numSplitData !== 'undefined' && numSplitData) {
        var numValue = numSplitData[0]
        if (numValue === '') { numValue = 1 }

        if (numValue || numAnswerData.trim() === '0') {
          answerValue *= numValue
        }
        if (numSplitData[1] && uncrossedUnits['nums'].length > 0) {
          var indexNUnit = uncrossedUnits['nums'].indexOf(numSplitData[1])
          if (indexNUnit !== -1) {
            // remove unti from nums
            uncrossedUnits['nums'].splice(indexNUnit, 1)
            numUnits.push(numSplitData[1])
          }
        }
      }

      var denomSplitData = this.state.answersSteps[x][1].splitData
      var denomAnswerData = this.clearDataText(this.state.answersSteps[x][1].data).split(' ')[0]

      // test if it simple Number
      if (!denomSplitData && (Number(denomAnswerData) === Number(denomAnswerData))) {
        denomSplitData = [Number(denomAnswerData)]
      }

      if (typeof denomSplitData !== 'undefined' && denomSplitData) {
        var denomValue = denomSplitData[0]
        if (denomValue === '') { denomValue = 1 }

        if (denomValue || denomAnswerData.trim() === '0') {
          answerValue = answerValue / denomValue
        }

        if (denomSplitData[1] && uncrossedUnits['denoms'].length > 0) {
          var indexDUnit = uncrossedUnits['denoms'].indexOf(denomSplitData[1])
          if (indexDUnit !== -1) {
            uncrossedUnits['denoms'].splice(indexDUnit, 1)
            denomUnits.push(denomSplitData[1])
          }
        }
      }
    }

    var unit

    if (denomUnits.length > 0) {
      unit = '\\frac{' + numUnits.join('*') + '}{' + denomUnits.join('*') + '}'
    } else {
      unit = numUnits.join('*')
    }

    return answerValue + '\\ ' + unit
  }

  onMathQuillChange (data, row, col, mathquillObj) {
    super.onMathQuillChange(data, row, col, mathquillObj)
    var MQ = MathQuill.getInterface(2)

    var answerSteps = this.state.answersSteps

    answerSteps[col - 1][row - 1]['data'] = this.clearDataText(data)
    answerSteps[col - 1][row - 1]['splitData'] = this.constructor.parseToValueUnit(this.clearDataText(data))

    if (this.props.unit_conversion_type === '10') { // automatically fill right hand box | left side blank
      var answerBox = MQ(document.getElementById('15'))
      this.setLatexWoFireEvent(answerBox, this.calculateAnswer())
    }
    if (this.props.unit_conversion_type === '20') { // disable left side editing | right side blank
      // var numeratorBox = MQ(document.getElementById('11'))
      // var denominatorBox = MQ(document.getElementById('21'))
      // this.setLatexWoFireEvent(numeratorBox, this.props.numerator)
      // this.setLatexWoFireEvent(denominatorBox, this.props.denominator)
      // answerSteps[0][0]['data'] = this.props.numerator
      // answerSteps[0][1]['data'] = this.props.denominator
      // answerSteps[0][0]['splitData'] = this.constructor.parseToValueUnit(this.props.numerator)
      // answerSteps[0][1]['splitData'] = this.constructor.parseToValueUnit(this.props.denominator)

      // this.setState({
      //   answerSteps: answerSteps
      // })
      // }, function () {
      //   this.reDrawStrikes()
      // })
    }
    this.setState({
      answerSteps: answerSteps
    })

    this.updateExternalAnswer()
  }

  render () {
    if (typeof this.props.is_correct_answer !== 'undefined') { // user gave answer
      var spanBoxes = []
      if (this.props.unit_conversion_type === '20') { // RIGHT SIDE BLANK
        spanBoxes.push(15)
      }
      if (this.props.unit_conversion_type === '10') { // LEFT SIDE BLANK
        for (var x = 0; x < this.state.answersSteps.length; x++) {
          spanBoxes.push('1' + (x + 1))
          spanBoxes.push('2' + (x + 1))
        }
      }

      for (var i = 0; i < spanBoxes.length; i++) {
        var element = document.getElementById(spanBoxes[i])
        element.style.pointerEvents = 'none' // disable editable

        if (this.props.is_correct_answer === true) {
          element.classList.add('green-border') // green if correct
        }

        if (this.props.is_correct_answer === false) {
          element.classList.add('red-border') // red if incorrect
        }
      }
    }

    var buttonStyle = {
      padding: 2,
      display: 'block',
      margin: 'auto',
      marginTop: 1,
      marginBottom: 1
    }
    var disabledButtonStyle = {
      padding: 2,
      display: 'block',
      margin: 'auto',
      marginTop: 1,
      marginBottom: 1,
      cursor: 'not-allowed',
      pointerEvents: 'none',
      color: '#c0c0c0',
      border: '.2rem solid #c0c0c0',
      backgroundColor: '#ffffff'
    }

    return (<div style={{display: 'block'}}>
      <div style={{display: 'table', marginLeft: 'auto', marginRight: 'auto'}}>
        <ConversionTable
          numColumns={this.state.numColumns}
          onMathQuillChange={this.onMathQuillChange}
          number={this.props.number}
          unit={this.props.unit}
          strikethroughN={this.state.strikethroughN}
          strikethroughD={this.state.strikethroughD}
        />
        {this.props.unit_conversion_type === '20' ? null
          : <div style={{fontSize: 10, display: 'table-cell', verticalAlign: 'middle', paddingLeft: 0, paddingRight: 0}}>
            <button
              className='hover-button'
              style={this.state.numColumns === 4 ? disabledButtonStyle : buttonStyle}
              onClick={this.addColumn}>+Add Step</button>
            <button
              className='hover-button'
              style={this.state.numColumns === 1 ? disabledButtonStyle : buttonStyle} onClick={this.removeColumn}
              disabled={this.state.numColumns === 1}>
              -Remove Step
            </button>
          </div>
        }
        <div style={{fontSize: 30, display: 'table-cell', verticalAlign: 'middle', paddingLeft: 15, paddingRight: 15}}>
            =
        </div>
        <div style={{display: 'table-cell', verticalAlign: 'middle'}}>
          <MathquillBox
            onMathQuillChange={this.onResultChange}
            row={1}
            column={5}
          />
        </div>
      </div>
    </div>
    )
  }
}
UnitConversionCanvas.propTypes = {
  updateAnswer: React.PropTypes.func.isRequired,
  unit_conversion_type: React.PropTypes.string,
  conversion_steps: React.PropTypes.array,
  // numerator: React.PropTypes.string,
  // denominator: React.PropTypes.string,
  // show_answer: React.PropTypes.bool,
  is_correct_answer: React.PropTypes.bool
}

export class SingleUnitConversionAnswer extends React.Component {
  constructor () {
    super()
    this.questionId = null
  }

  reset () {
    this.answer.latex('')
  }

  render () {
    var [number, unit] = UnitConversionBase.parseToValueUnit(this.props.question.additional_text)

    return (<div className='bounding-box'>
      <UnitConversionCanvas
        answer={this.props.question.unit_conversion.answer}
        number={number}
        unit={unit}
        unit_conversion_type={this.props.question.unit_conversion.unit_conversion_type}
        conversion_steps={this.props.question.unit_conversion.conversion_steps}
        // numerator={this.props.question.unit_conversion.numerator}
        // denominator={this.props.question.unit_conversion.denominator}
        // show_answer={this.props.question.unit_conversion.show_answer}
        updateAnswer={this.props.updateAnswer}
        uuid={this.props.question.uuid}
        is_correct_answer={this.props.correct}
      />
    </div>)
  }
}
SingleUnitConversionAnswer.propTypes = {
  updateAnswer: React.PropTypes.func.isRequired,
  question: React.PropTypes.object,
  correct: React.PropTypes.bool
}