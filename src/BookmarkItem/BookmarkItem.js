import React from "react";
import Rating from "../Rating/Rating";
import BookmarksContext from "../BookmarksContext";
import config from "../config";
import "./BookmarkItem.css";
import { Link } from "react-router-dom";

function deleteBookmarkRequest(bookmarkId, callback) {
  fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${config.API_TOKEN}`
    }
  })
    .then(res => {
      if (!res.ok) {
        return res
          .json()
          .then(error => {
        throw error
      })
      }
      return res.json()
    })
    .then(data => {
      callback(bookmarkId)
    })
    .catch(error => {
    console.error(error)
  })
}

function refreshPage() {
  window.location.reload(false);
}

export default function BookmarkItem(props) {
  return (
    <BookmarksContext.Consumer>
      {(context) => (
        <li className="BookmarkItem">
          <div className="BookmarkItem__row">
            <h3 className="BookmarkItem__title">
              <a href={props.url} target="_blank" rel="noopener noreferrer">
                {props.title}
              </a>
            </h3>
            <Rating value={props.rating} />
          </div>
          <p className="BookmarkItem__description">{props.description}</p>
          <div className="BookmarkItem__buttons">
            <button
              className="BookmarkItem__description"
              onClick={() => {
                deleteBookmarkRequest(
                  props.id,
                  context.deleteBookmark,
                );
                refreshPage();
              }}
            >
              Delete
            </button>
          </div>
          <Link to={`/edit/${props.id}`}>Edit Bookmark</Link>
        </li>
      )}
    </BookmarksContext.Consumer>
  );
}

BookmarkItem.defaultProps = {
  onClickDelete: () => {}
};
