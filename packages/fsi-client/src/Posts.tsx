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
  CreatePostMutation,
  CreatePostMutationVariables,
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

  useEffect(() => {
    console.log(title, content);
  }, [title, content]);

  const [newPost, { data }] = useMutation(MUTATION_SUBMIT_POST);
  
  //console.log(newPost);

  const handleSubmit = () => {
    console.log(newPost);
    try {
      newPost({ variables: { post: { title: title, content: content } } });
    } catch (e) {
      console.log('error');
    }
  };

  return (
    <form>
      <input
        name="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      ></input>
      <input
        name="content"
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></input>

      <Button onClick={handleSubmit}>Add</Button>
    </form>
  );
};

export const PostsTable = () => {
  const { data, loading, error } = useQuery<
    GetPostsQuery,
    GetPostsQueryVariables
  >(QUERY_GET_POSTS);
  console.log(data);
  if (loading) {
    return <Spinner animation={"border"} />;
  }

  if (error || !data) {
    return <div>{error ? error.toString() : "Error: no data"}</div>;
  }

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Content</th>
          </tr>
        </thead>
        <tbody>
          {data.getPosts.map((post) => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>{post.title}</td>
              <td>{post.content}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
