import React, { Component } from "react";
import BookmarksContext from "../BookmarksContext";
import config from "../config";

const Required = () => <span className="AddBookmark__required">*</span>;

class EditBookmark extends Component {
  static contextType = BookmarksContext;

  state = {
    title: "",
    url: "",
    description: "",
    rating: "",
  };

  componentDidMount() {
    const bookmarkId = this.props.match.params.bookmarkId
    fetch(`https://localhost:8000/api/bookmarks/${bookmarkId}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${config.API_TOKEN}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        this.setState({
          title: res.title,
          url: res.url,
          description: res.description,
          rating: res.rating
        })
      })
      .catch(error => this.setState({ error }));
  }

  handleSubmit = e => {
    e.preventDefault()
    const { title, url, description, rating } = e.target;
    const bookmark = {
      title: title.value,
      url: url.value,
      description: description.value,
      rating: rating.value
    };
    this.setState({ error: null });
    fetch(`https://localhost:8000/api/bookmarks/${this.props.match.params.bookmarkId}`, {
      method: "PATCH",
      body: JSON.stringify(bookmark),
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${config.API_TOKEN}`
      }
    })
      .then(res => {
        if (!res.ok) {
          return res
            .json()
            .then(error => {
              throw error;
            });
        }
        this.context.updateBookmark(res)
      })
      .then(this.props.history.push("/bookmarks"))
      .catch(error => {
        this.setState({ error });
      });
  }

  handleClickCancel = () => {
    this.props.history.push("/bookmarks")
  };

  render() {
    const {
      error,
      title,
      url,
      description,
      rating
    } = this.context;

    return (
      <section className="EditBookmark">
        <h2>Edit Bookmark</h2>
        <form className="AddBookmark__form" onSubmit={this.handleSubmit}>
          <div className="AddBookmark__error" role="alert">
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor="title">
              Title <Required />
            </label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Great website!"
              required
              value={title}
            />
          </div>
          <div>
            <label htmlFor="url">
              URL <Required />
            </label>
            <input
              type="url"
              name="url"
              id="url"
              placeholder="https://www.great-website.com/"
              required
              value={url}
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              value={description}
            />
          </div>
          <div>
            <label htmlFor="rating">
              Rating <Required />
            </label>
            <input
              type="number"
              name="rating"
              id="rating"
              defaultValue="1"
              min="1"
              max="5"
              required
              value={rating}
            />
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