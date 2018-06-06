import React from 'react';

import {UnitConversionTypes, UnitConversionTypeLabels} from '../constants'
import {EditableLabel} from './label'


export class UnitConversionAnswer extends React.Component {

  render() {
    var typeOptions=[];
    for (var uct in UnitConversionTypeLabels)
      typeOptions.push(<option value={uct}>{UnitConversionTypeLabels[uct]}</option>)
    var steps=[];
    for (var s in this.props.conversion_steps){
      steps.push(<div className="conversion-step" key={s}>
                 <div className="numerator"><EditableLabel value={this.props.conversion_steps[s].numerator.replace('\\ ',' ')} onChange={this.props.onStepNumeratorChanged.bind(null, s)}/></div>
                 <div className="denominator"><EditableLabel value={this.props.conversion_steps[s].denominator.replace('\\ ',' ')} onChange={this.props.onStepDenominatorChanged.bind(null,s)}/></div>
                 </div>)
    }
    return (
      <div className="unit-conversion">
        <select onChange={this.props.onTypeChange} value={this.props.unit_conversion_type}>{typeOptions}</select>
        <br/>
        <div className="conversion-steps">
          <div className="conversion-step">
            <div className="numerator"><EditableLabel value={this.props.question_number+' '+this.props.question_unit} onChange={this.props.onQuestionValueChange}/></div>
            <div className="denominator">&nbsp;</div>
          </div>
          {steps}
        </div>
        <div className="add-remove-steps">
          <a onClick={this.props.onAddStepClick}><span className="glyphicon glyphicon-plus"/> Add step</a> <br/>
          <a onClick={this.props.onRemoveStepClick}><span className="glyphicon glyphicon-minus"/> Remove step</a>
        </div>
        <div className="equals"> = </div>
        <div className="conversion-result">
          <EditableLabel value={this.props.answer_number+' '+this.props.answer_unit} onChange={this.props.onAnswerValueChange}/>
        </div>
      </div>
    )
  }
}