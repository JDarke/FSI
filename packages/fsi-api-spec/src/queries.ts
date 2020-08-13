import gql from "graphql-tag";

export const FRAGMENT_POST = gql`
  fragment GQLPost on GQLPost {
    id
    title
    content
  }
`;

export const QUERY_GET_POSTS = gql`
  ${FRAGMENT_POST}
  query GetPosts {
    getPosts {
      ...GQLPost
    }
  }
`;

export const QUERY_FEED_POSTS = gql`
  ${FRAGMENT_POST}
  query GetPosts {
    getPosts {
      ...GQLPost
    }
  }
`;

export const MUTATION_SUBMIT_POST = gql`
  ${FRAGMENT_POST}
  mutation CreatePost($post: GQLPostInput!) {
    createPost(post: $post) {...GQLPost}
}
`;
