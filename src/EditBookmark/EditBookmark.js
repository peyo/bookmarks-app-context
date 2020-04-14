import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BookmarksContext from '../BookmarksContext';
import config from '../config'
import './EditBookmark.css';

const Required = () => (
  <span className='EditBookmark__required'>*</span>
)

class EditBookmark extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object,
    })
  };

  static contextType = BookmarksContext;

  state = {
    error: null,
    id: '',
    title: '',
    url: '',
    description: '',
    rating: 1,
  };

  componentDidMount() {
    const { bookmarkId } = this.props.match.params
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: 'GET',
      headers: {
        'authorization': `Bearer ${config.API_TOKEN}`
      }
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(error => Promise.reject(error))

        return res.json()
      })
      .then(res => {
        this.setState({
          id: res.id,
          title: res.title,
          url: res.url,
          description: res.description,
          rating: res.rating,
        })
      })
      .catch(error => {
        console.error(error)
        this.setState({ error })
      })
  }

  handleChange = event => {
    let name = event.target.getAttribute("name");
    this.setState({
      [name]: event.target.value
    });
  }

  handleSubmit = e => {
    e.preventDefault()
    const { bookmarkId } = this.props.match.params
    const { id, title, url, description, rating } = this.state
    const newBookmark = { id, title, url, description, rating }
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: 'PATCH',
      body: JSON.stringify(newBookmark),
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${config.API_TOKEN}`
      },
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(error => Promise.reject(error))
      })
      .then(() => {
        this.resetFields(newBookmark)
        this.context.updateBookmark(newBookmark)
        this.props.history.push('/bookmarks')
      })
      .catch(error => {
        console.error(error)
        this.setState({ error })
      })
  }

  resetFields = (newFields) => {
    this.setState({
      id: newFields.id || '',
      title: newFields.title || '',
      url: newFields.url || '',
      description: newFields.description || '',
      rating: newFields.rating || '',
    })
  }

  handleClickCancel = () => {
    this.props.history.push('/bookmarks')
  };

  render() {
    const {
      error,
      title,
      url,
      description,
      rating
    } = this.state;

    return (
      <section className="EditBookmark">
        <h2>Edit Bookmark</h2>
        <form
          className="AddBookmark__form"
          onSubmit={this.handleSubmit}>
          <div
            className="AddBookmark__error"
            role="alert">
            {error && <p>{error.message}</p>}
          </div>
          <input
            type="hidden"
            name="id"
          />
          <div>
            <label htmlFor="title">
              Title <Required />
              <input
                type="text"
                name="title"
                id="title"
                required
                value={title}
                onChange={this.handleChange}
                />
            </label>
          </div>
          <div>
            <label htmlFor="url">
              URL <Required />
              <input
                type="url"
                name="url"
                id="url"
                required
                value={url}
                onChange={this.handleChange}
              />
            </label>
          </div>
          <div>
            <label htmlFor="description">
              Description
              <textarea
                name="description"
                id="description"
                value={description}
                onChange={this.handleChange}
              />
            </label>
          </div>
          <div>
            <label htmlFor="rating">
              Rating <Required />
              <input
                type="number"
                name="rating"
                id="rating"
                min="1"
                max="5"
                required
                value={rating}
                onChange={this.handleChange}
              />
            </label>
          </div>
          <div className="AddBookmark__buttons">
            <button type="button" onClick={this.handleClickCancel}>
              Cancel
            </button>{" "}
            <button type="submit">Save</button>
          </div>
        </form>
      </section>
    )
  }
}

export default EditBookmark;