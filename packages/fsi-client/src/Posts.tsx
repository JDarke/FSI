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
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

export const Posts = () => {
  const [update, setUpdate] = useState(false);
  const handleUpdate = () => {
    setUpdate(!update);
  };

  useEffect(() => {
    //console.log(update); 
  }, [update]);

  return (
    <Container>
      <h1>Posts</h1>
      <NewPosts handleUpdate={handleUpdate} />
      <PostsTable update={update} />
    </Container>
  );
};

interface Props {
  handleUpdate(): void;
}

export const NewPosts = (props: Props) => {
  const { handleUpdate } = props;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [newPost, { data }] = useMutation(MUTATION_SUBMIT_POST);
  const handleSubmit = () => {
    console.log(newPost);
    try {
      if (title !== "" && content !== "") {
        newPost({ variables: { post: { title: title, content: content } } });
      }
      handleUpdate();
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

interface PropsPT {
  update: boolean;
}

export const PostsTable = (props: PropsPT) => {
  const { update } = props;
  const [page, setPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5);
  const pageBack = () => {
    setPage(page - 1);
  };
  const pageForward = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    console.log(page);
  }, [page]);

  const { data, loading, error } = useQuery<
    GetPostsQuery,
    GetPostsQueryVariables
  >(QUERY_GET_POSTS);
  console.log("data " + data);
  if (loading) {
    return <Spinner animation={"border"} />;
  }

  if (error || !data) {
    return <div>{error ? error.toString() : "Error: no data"}</div>;
  }

  const entries = data.getPosts.map((post) => (
    <tr key={post.id}>
      <td>{post.id}</td>
      <td>{post.title}</td>
      <td>{post.content}</td>
    </tr>
  ));

  return (
    <div>
      <div className="paginate__controls">
        <Button onClick={pageBack}>Back</Button>
        <Button onClick={pageForward}>Forward</Button>
        <input
          name="postsPerPage"
          type="text"
          value={postsPerPage}
          onChange={(e) => setPostsPerPage(parseInt(e.target.value))}
        />
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Content</th>
          </tr>
        </thead>
        <tbody>{entries}</tbody>
      </Table>
    </div>
  );
};
