import React from 'react';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';

import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';

// used to establish new connection to the GraphQL server using Apollo
// uri: Uniform Resource Identifier
const client = new ApolloClient({
  uri: '/graphql'
})

function App() {
  return ( 
    //wrap ApolloProvider around the JSX code to use GraphQL with Apollo
    <ApolloProvider client={client}>
      <div className="flex-column justify-flex-start min-100-vh">
        <Header />
        <div className="container">
          <Home />
        </div>
        <Footer />
      </div>
    </ApolloProvider>
  );
}

export default App;
