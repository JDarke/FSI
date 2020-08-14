import { useQuery, useMutation } from "@apollo/react-hooks";
import { useState, useEffect } from "react";
import {
  QUERY_GET_POSTS,
  MUTATION_SUBMIT_POST,
} from "@blueheart/fsi-api-spec/lib/queries";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import {
  GetPostsQuery,
  GetPostsQueryVariables,
} from "@blueheart/fsi-api-spec/lib/generated/graphql";
import * as React from "react";


export const Posts = () => {
  return (
    <Container>
      <h1>Posts</h1>
      <NewPosts />
      <PostsTable />
    </Container>
  );
};


export const NewPosts = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [newPost, { data }] = useMutation(MUTATION_SUBMIT_POST);
  const handleSubmit = () => {
    try {
      if (title !== "" && content !== "") {
        newPost({ variables: { post: { title: title, content: content } } });
        setTitle('');
        setContent('');
      }
    } catch (e) {
      console.log("error");
    }
  };

  return (
    <div className="newPost__container">
      <input
        className="newPost__title"
        name="title"
        type="text"
        value={title}
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      ></input>
      <input
        className="newPost__content"
        name="content"
        type="text"
        value={content}
        placeholder="Content"
        onChange={(e) => setContent(e.target.value)}
      ></input>
      <Button onClick={handleSubmit}>Add</Button>
    </div>
  );
};


export const PostsTable = () => {
  const [page, setPage] = useState(0);
  const [postsPerPage, setPostsPerPage] = useState(5);
  const pageBack = () => {
    setPage(page > 0 ? page - 1 : page);
  };
  const pageForward = () => {
    setPage(page < entries.length / postsPerPage - 1 ? page + 1 : page);
  };

  useEffect(() => {
    setPage(0);
  }, [postsPerPage]);

  const { data, loading, error } = useQuery<
    GetPostsQuery,
    GetPostsQueryVariables
    >(QUERY_GET_POSTS, {
      pollInterval: 500,
    });

  if (loading) {
    return <Spinner animation={"border"} />;
  }

  if (error || !data) {
    return <div>{error ? error.toString() : "Error: no data"}</div>;
  }

  const entries = data.getPosts.map((post) => (
    <tr key={post.id}>
      <td className="col__id">{post.id}</td>
      <td className="col__title">{post.title}</td>
      <td className="col__content">{post.content}</td>
    </tr>
  ));

  const currentEntries = entries.slice(
    page * postsPerPage,
    page * postsPerPage + postsPerPage
  );

  return (
    <div>
      <div className="paginate__controls">
        <Button onClick={pageBack}>{`<`}</Button>
        <div className="current__page">{`Page ${page + 1}`}</div>
        <Button onClick={pageForward}>{`>`}</Button>
        <input
          name="postsPerPage"
          type="text"
          value={postsPerPage}
          onChange={(e) => setPostsPerPage(parseInt(e.target.value))}
        />
        <div className="input__perPage">posts per page</div>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Content</th>
          </tr>
        </thead>
        <tbody>{currentEntries}</tbody>
      </Table>
    </div>
  );
};
