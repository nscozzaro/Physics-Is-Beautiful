import React from 'react';

export const DEFAULT_MATHJAX_OPTIONS = {
  extensions: ['tex2jax.js'],
  jax: ['input/TeX', 'output/HTML-CSS'],
  tex2jax: {
    inlineMath: [ ['$', '$'], ['\\(', '\\)'] ],
    displayMath: [ ['$$', '$$'], ['\\[', '\\]'] ],
    processEscapes: true
  },
  'HTML-CSS': { availableFonts: ['TeX'] }
}


export class EditableLabel extends React.Component {
  constructor (props) {
    super(props);
    this.state = {editing : false};
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.setInputRef = this.setInputRef.bind(this);
  }  

  handleEditClick(e){
    if (this._inputRef)
      this._inputRef.focus()
    this.setState({editing : true,
                   value : this.props.value});
  }

  setInputRef(ref){
    this._inputRef = ref
    if (ref && this.state.editing) 
      ref.focus()
  }
  
  handleInputChange(e){
    this.setState({'value' : e.target.value}); 
  }

  handleInputBlur(e){
    this.setState({editing : false})
  }
  
  handleFormSubmit(e){
    e.preventDefault();
    this.setState({editing:false});
    this.props.onChange(this.state.value);
    return false;
  }
  
  componentDidMount () {
    MathJax.Hub.Config(DEFAULT_MATHJAX_OPTIONS);
    MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
  }
  componentDidUpdate () {
    MathJax.Hub.Config(DEFAULT_MATHJAX_OPTIONS);
    MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
  }

  render () {
    if (this.state.editing){
      return (<form onSubmit={this.handleFormSubmit} style={{display:'inline'}}>
              <input type="text" value={this.state.value} onChange={this.handleInputChange} onBlur={this.handleInputBlur} ref={this.setInputRef}/>
              </form>)
    } else {
      return (<span className={'editable-label' + (((this.props.value && this.props.value.trim()) || this.props.defaultValue)?'':' empty')} onClick={this.handleEditClick}>
              <span>{this.props.value || this.props.defaultValue}</span>
              <span  className="glyphicon glyphicon-pencil"/>              
              </span>)
    }
  }
}
