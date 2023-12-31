import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import Stack from "react-bootstrap/Stack";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { BASE_URL } from "src/constants";
import ListTagOfArticle from "../home/ListTagOfArticle";
import Comment from "./Comment";
import { AuthorAndButton } from "src/components";
import { AuthContext } from "src/context";

import { Avatar } from "src/components";
import {
  deleteArticle,
  favoriteArticle,
  unFavoriteArticle,
  followProfile,
  unFollowProfile,
} from "src/utils";
import { getAuthorizationHeader } from "src/common";

function Article() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [article, setArticle] = useState({});
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const {
    title,
    description,
    author = {},
    createAt,
    favoritesCount,
    body = "",
    tagList = [],
    favorited,
  } = article;

  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    axios
      .get(`${BASE_URL}/articles/${slug}`, {
        headers: {
          Authorization: getAuthorizationHeader(currentUser),
        },
      })
      .then(
        (res) => {
          const { article: articleFromApi } = res.data;
          setArticle(articleFromApi);
        },
        {
          headers: {
            Authorization: getAuthorizationHeader(currentUser),
          },
        }
      );
    axios
      .get(`${BASE_URL}/articles/${slug}/comments`, {
        headers: {
          Authorization: getAuthorizationHeader(currentUser),
        },
      })
      .then((res) => {
        const { data } = res;
        const { comments: commentsFromApi } = data;
        setComments(commentsFromApi);
      });
  }, [currentUser, slug]);

  const createComment = (e) => {
    e.preventDefault();
    axios
      .post(`${BASE_URL}/articles/${slug}/comments`, {
        comment: {
          body: comment,
        },
      })
      .then((res) => {
        const { data } = res;
        const { comment: commentFromApi } = data;
        setComments((comments) => [commentFromApi, ...comments]);
        setComment("");
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(`${BASE_URL}/articles/${slug}/comments/${id}`, {
        headers: {
          Authorization: getAuthorizationHeader(currentUser),
        },
      })
      .then(() => {
        setComments((comments) => comments.filter((x) => x.id != id));
      });
  };

  const favorite = () => {
    if (!currentUser) navigate("/login");
    else {
      favoriteArticle(slug).then((a) => {
        setArticle(a);
      });
    }
  };

  const unFavorite = () => {
    if (!currentUser) navigate("/login");
    else {
      unFavoriteArticle(slug).then((a) => {
        setArticle(a);
      });
    }
  };

  const deleteAr = () => {
    if (!currentUser) navigate("/login");
    else {
      deleteArticle(slug).then(() => {
        navigate("/");
      });
    }
  };

  const unFollow = async () => {
    if (!currentUser) navigate("/login");
    else {
      const p = await unFollowProfile(author.username);
      setArticle((a) => ({ ...a, author: p }));
    }
  };

  const follow = () => {
    if (!currentUser) navigate("/login");
    else {
      followProfile(author.username).then((p) => {
        setArticle((a) => ({ ...a, author: p }));
      });
    }
  };

  let AuthorAndButtonWithProp = () => {
    return (
      <AuthorAndButton
        author={author}
        createAt={createAt}
        favoritesCount={favoritesCount}
        slug={slug}
        favorited={favorited}
        deleteArticle={deleteAr}
        favorite={favorite}
        unFavorite={unFavorite}
        follow={follow}
        unFollow={unFollow}
      />
    );
  };

  return (
    <div className="mb-5">
      <section className="bg-dark bg-gradient text-light p-4">
        <div className="container">
          <h1>{title}</h1>
          <AuthorAndButtonWithProp />
          <p className="fw-lighter my-3">{description}</p>
        </div>
      </section>
      <section className="">
        <div className="container border-bottom py-5">
          <article className="result">
            <ReactMarkdown>{body}</ReactMarkdown>
          </article>
          <ListTagOfArticle tagList={tagList} />
        </div>
      </section>
      <section>
        <div className="container">
          <div className="d-flex justify-content-center my-3">
            <AuthorAndButtonWithProp />
          </div>
          <Stack gap={2} className="col-md-6 mx-auto">
            {currentUser ? (
              <Form onSubmit={createComment}>
                <Card className="text-start ">
                  <Card.Body className="p-0 pt-2">
                    <Form.Control
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      as="textarea"
                      rows={3}
                      className="border-0 shadow-none"
                      placeholder="Write a comment..."
                    />
                  </Card.Body>
                  <Card.Footer className="text-muted">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <Avatar url={currentUser.image} />
                      </div>
                      <Button type="submit">Post Comment</Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Form>
            ) : (
              <p className="mt-5 mb-3 text-center">
                <Link to={"/login"}>Sign in</Link> or{" "}
                <Link to={"/register"}>sign up</Link> to add comments on this
                article.{" "}
              </p>
            )}

            {comments.map((c, i) => (
              <Comment key={i} comment={c} clickDeleteComment={deleteComment} />
            ))}
          </Stack>
        </div>
      </section>
    </div>
  );
}

export default Article;
