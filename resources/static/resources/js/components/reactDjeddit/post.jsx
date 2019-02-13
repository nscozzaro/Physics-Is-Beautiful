import React from 'react'

import PropTypes from 'prop-types'

import Moment from 'react-moment'

import { Glyphicon, Grid, Row, Col, FormControl, Checkbox, Form, Button } from 'react-bootstrap'

import { ReplyForm } from './replyForm'
import { EditForm } from './editForm'

import MathJax from 'react-mathjax2'

// import RMathJax from 'react-mathjax'

export class Post extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      replyFormShow: false,
      editFormShow: false
    }

    this.onSubmitReplay = this.onSubmitReplay.bind(this)
    this.onSubmitEdit = this.onSubmitEdit.bind(this)
    this.toggleReplyForm = this.toggleReplyForm.bind(this)
    this.toggleEditForm = this.toggleEditForm.bind(this)
    this.upDownClick = this.upDownClick.bind(this)
    this.editComment = this.editComment.bind(this)
  }

  onSubmitReplay (...args) {
    this.props.onSubmitReplay(...args)
    this.toggleReplyForm()
  }

  onSubmitEdit (...args) {
    this.props.onSubmitEdit(...args)
    this.toggleEditForm()
  }

  toggleReplyForm () {
    this.setState({ replyFormShow: !this.state.replyFormShow })
  }

  toggleEditForm () {
    this.setState({ editFormShow: !this.state.editFormShow })
  }

  deleteComment () {
    // TODO delete comment reload thread
  }

  editComment () {
    this.setState({ editFormShow: !this.state.editFormShow })
  }

  upDownClick (value) {
    this.props.changePostVote(this.props.post, value)
  }

  render () {
    var renderMathJs = function (content) {
      return (
        <MathJax.Context
          input='ascii'
          onError={(MathJax, error) => {
            console.warn(error)
            console.log('Encountered a MathJax error, re-attempting a typeset!')
            MathJax.Hub.Queue(
              MathJax.Hub.Typeset()
            )
          }}
          script='https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=AM_HTMLorMML'
          options={{
            extensions: ['tex2jax.js', '[mhchem]/mhchem.js'],
            jax: ['input/TeX', 'output/HTML-CSS'],
            tex2jax: {
              inlineMath: [ ['$', '$'], ['\\(','\\)'] ],
              displayMath: [ ['$$', '$$'], ['\\[','\\]'] ],
              processEscapes: true
            },
            'HTML-CSS': { fonts: ['TeX'] }
          }}>
          <MathJax.Text text={content} />
        </MathJax.Context>
      )

    // react-mathjax1 do not work with "options="
    //   return (
    //    <RMathJax.Context
    //    options={{
    //         extensions: ['tex2jax.js', '[mhchem]/mhchem.js'],
    //         jax: ['input/TeX', 'output/HTML-CSS'],
    //         tex2jax: {
    //           inlineMath: [ ['$','$'], ['\\(','\\)'] ],
    //           displayMath: [ ['$$','$$'], ['\\[','\\]'] ],
    //           processEscapes: true
    //         },
    //         'HTML-CSS': { fonts: ['TeX'] }}}>
    //     <RMathJax.Node inline>
    //       { content }
    //     </RMathJax.Node>
    //   </RMathJax.Context>
    //   )
    }

    return (
      <div>
        { this.props.post
          ? <Grid fluid style={{padding: 0}}>
            <Row>
              <Col sm={11} md={11}>
                <Row className={'gray-text'}>
                  <Col md={1} sm={2} xs={4}>
                    {this.props.post.created_by
                      ? <a href={this.props.post.created_by.get_absolute_url} target={'_blank'}>
                        {this.props.post.created_by.display_name}
                      </a> : 'Guest'
                    }
                  </Col>
                  <Col md={2} sm={3} xs={3}>
                    <Moment fromNow>{this.props.post.created_on}</Moment>
                  </Col>
                  <Col md={2} sm={3} xs={4}>
                    {this.props.post.modified_on !== this.props.post.created_on
                      ? <span>edited <Moment fromNow>{this.props.post.modified_on}</Moment></span>
                      : null
                    }
                  </Col>
                </Row>
                <Row>
                  <Col sm={12} md={12}>
                    {/* djeddit part*/}
                    <div className='postcol'>
                      <div className='post-content'>
                        {/* fix for markdown editor */}
                        <div style={{display: this.state.editFormShow ? 'block' : 'none'}}>
                          <EditForm
                            parentPost={this.props.post}
                            currentProfile={this.props.currentProfile}
                            onSubmitPost={this.onSubmitEdit}
                            onToggleForm={this.toggleEditForm}
                          />
                        </div>
                        {this.state.editFormShow
                          ? null : renderMathJs(this.props.post.content)
                        }
                      </div>
                      <div className='djeddit-post-item-footer'>
                        <div className='djeddit-score'>
                          <i className='fas fa-arrow-up djeddit-score-upvote  ' onClick={() => this.upDownClick(1)} />
                          <span className=' djeddit-score-number'>{this.props.post.score}</span>
                          <i className='fas fa-arrow-down djeddit-score-downvote ' onClick={() => this.upDownClick(-1)} />
                        </div>
                        <div className='btn-group btn-group-xs fixed-50' role='group'>
                          <button
                            onClick={this.toggleEditForm}
                            className='btn btn-secondary'>
                            Edit
                          </button>
                          <button
                            onClick={this.toggleReplyForm}
                            className='btn btn-secondary'>
                            Reply
                          </button>
                          <button
                            onClick={this.toggleReplyForm}
                            className='btn btn-secondary'>
                            Parent
                          </button>
                          <button
                            onClick={this.toggleReplyForm}
                            className='btn btn-secondary'>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm={12} md={12}>
                    <div className='btn-group btn-group-xs fixed-50' role='group'>
                      {/*<span className='pib-link' onClick={this.toggleReplyForm}>Reply</span>*/}
                      {/*<span className='pib-link' onClick={this.toggleReplyForm}>Share</span>*/}
                    </div>
                  </Col>
                </Row>
                {/* fix for markdown editor */}
                <div style={{display: this.state.replyFormShow ? 'block' : 'none'}}>
                  <ReplyForm
                    parentPost={this.props.post}
                    currentProfile={this.props.currentProfile}
                    onSubmitPost={this.onSubmitReplay}
                    onToggleForm={this.toggleReplyForm}
                  />
                </div>
              </Col>
            </Row>
          </Grid> : null }
      </div>
    )
  }
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
  onSubmitReplay: PropTypes.func.isRequired,
  onSubmitEdit: PropTypes.func.isRequired,
  currentProfile: PropTypes.object.isRequired,
  changePostVote: PropTypes.func.isRequired
}
