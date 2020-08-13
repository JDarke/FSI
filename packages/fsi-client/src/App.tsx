import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";

import "./App.css";
import { Posts } from "./Posts";
export class App extends React.Component {
  private readonly apolloClient: ApolloClient<unknown>;

  constructor(props: {}) {
    super(props);
    this.apolloClient = new ApolloClient<unknown>({
      uri: "http://localhost:3010/graphql",
    });
  }

  render = () => (
    <ApolloProvider client={this.apolloClient}>
      <Posts />
    </ApolloProvider>
  );
}

export default App;
